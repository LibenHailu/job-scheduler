/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxyFactory } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { Mutex } from 'async-mutex';
import { catchError, of } from 'rxjs';
import { Agent } from '../agents/domain/agent';

@Injectable()
export class ControllerService implements OnModuleInit {
  private readonly mutex: Mutex = new Mutex();
  private readonly agents: Agent[] = [];
  public static readonly assignableShardLength = 10;
  private readonly shardStatus: Map<number, boolean> = new Map();

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

  @Cron('*/1 * * * *')
  async dispatchQueueWorkCommand() {
    try {
      const activeAgents = this.agents.filter(
        (agent) => agent.shards.length > 0,
      );
      console.log(activeAgents);

      for (const agent of activeAgents) {
        const client = ClientProxyFactory.create({
          // transport: Transport.RMQ,
          options: {
            urls: [process.env.AMPQ_URL],
            queue: `${agent.id}-queue`,
            queueOptions: {
              durable: false,
            },
          },
        });
        await client.connect();
        for (const shard of agent.shards) {
          console.log(
            `dispatching queue command to worker ${agent.id} for shard ${shard}`,
          );

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
                console.log('herereee', agent.id);
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

  @Cron('*/1 * * * *')
  getAllAgentsStatus() {
    return this.agents.map((agent) => ({
      id: agent.id,
      shards: agent.shards,
    }));
  }
}
