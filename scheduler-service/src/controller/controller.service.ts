import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  ClientProxyFactory,
  Transport,
  RmqOptions,
} from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { Mutex } from 'async-mutex';
import { catchError, of } from 'rxjs';
import { Agent } from '../agents/domain/agent';

@Injectable()
export class ControllerService implements OnModuleInit {
  private readonly mutex: Mutex = new Mutex();
  private readonly agents: Agent[] = [];
  public static readonly assignableShardLength = 6;
  private readonly shardStatus: Map<number, boolean> = new Map();
  private readonly randomFailures = process.env.RANDOM_FAILURES === 'true';
  private readonly killAfter = Number(process.env.KILL_AFTER) * 1000 || null;

  onModuleInit() {
    for (let i = 1; i <= ControllerService.assignableShardLength; i++) {
      this.shardStatus.set(i, false);
    }
  }
  async addAgent(params: { agentId: string }): Promise<Agent> {
    const release = await this.mutex.acquire();
    try {
      if (this.agents.find((agent) => agent.id === params.agentId)) {
        return this.agents.find((agent) => agent.id === params.agentId)!;
      }

      const newAgent = new Agent({
        id: params.agentId,
        shards: [],
      });

      this.agents.push(newAgent);
      const shard = this.getNextShard();
      this.assignShard(newAgent.id, shard);

      return newAgent;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      release();
    }
  }

  getNextShard(): number {
    for (const [shard, assigned] of this.shardStatus) {
      if (!assigned) {
        return shard;
      }
    }

    const agent = this.agents.find((agent) => agent.shards.length > 1);
    if (agent) {
      const shard = agent.shards[0];
      this.unAssignShard(shard);
      return shard;
    }

    return -1;
  }

  unAssignShard(shard: number) {
    const agent = this.agents.find((agent) => agent.shards.includes(shard));
    if (agent) {
      agent.updateShards(agent.shards.filter((s) => s !== shard));
    }
    this.shardStatus.set(shard, false);
  }

  assignShard(workerId: string, shard: number) {
    const agent = this.agents.find((worker) => worker.id === workerId);
    if (agent) {
      agent.addShard(shard);
    }
    this.shardStatus.set(shard, true);
  }

  @Cron('*/5 * * * * *')
  shardAssignment() {
    this._assignUnassignedShardsToIdleAgents();
    this._assignUnassignedShardsToAgentsWithLowestShardCount();
  }

  private _assignUnassignedShardsToIdleAgents() {
    const idleAgents = this.agents.filter((agent) => agent.shards.length === 0);

    for (const [shard, status] of this.shardStatus) {
      if (!status && idleAgents.length > 0) {
        const agent = idleAgents.pop()!;
        this.assignShard(agent.id, shard);
      }
    }
  }

  private _assignUnassignedShardsToAgentsWithLowestShardCount() {
    const agentsWithLowestShardCount = this.agents
      .filter((agent) => agent.shards.length > 0)
      .sort((a, b) => a.shards.length - b.shards.length);

    for (const [shard, status] of this.shardStatus) {
      if (!status && agentsWithLowestShardCount.length > 0) {
        const agent = agentsWithLowestShardCount.pop()!;
        this.assignShard(agent.id, shard);
      }
    }
  }

  private removeRandomAgentSafely() {
    if (this.agents.length <= 1) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * this.agents.length);
    const agent = this.agents[randomIndex];

    console.log(`💥 Randomly removing agent: ${agent.id}`);

    for (const shard of agent.shards) {
      this.shardStatus.set(shard, false);
    }

    this.agents.splice(randomIndex, 1);

    this._assignUnassignedShardsToIdleAgents();
    this._assignUnassignedShardsToAgentsWithLowestShardCount();
  }

  @Cron('*/1 * * * *')
  crashAgent() {
    if (!this.randomFailures && !this.killAfter) return;
    this.removeRandomAgentSafely();
  }

  @Cron('*/1 * * * *')
  async dispatchQueueWorkCommand() {
    try {
      const activeAgents = this.agents.filter(
        (agent) => agent.shards.length > 0,
      );
      for (const agent of activeAgents) {
        const client = ClientProxyFactory.create(<RmqOptions>{
          transport: Transport.RMQ,
          options: {
            urls: [process.env.AMQP_URL!],
            queue: `${agent.id}-queue`,
            queueOptions: {
              durable: false,
            },
          },
        });
        await client.connect();
        for (const shard of agent.shards) {
          client
            .send<number>(
              { cmd: 'queueCommands' },
              {
                shard,
                timestamp: new Date().getTime(),
              },
            )
            .pipe(
              catchError((e) => {
                console.log(e);
                return of(false);
              }),
            )
            .subscribe(() => {});
        }

        setTimeout(() => {
          client.close();
        }, 5000);
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Cron('*/10 * * * *')
  getAllAgentsStatus() {
    this.agents.map((agent) => ({
      id: agent.id,
      shards: agent.shards,
    }));

    console.log('Current Agents Status:', this.agents);
  }
}
