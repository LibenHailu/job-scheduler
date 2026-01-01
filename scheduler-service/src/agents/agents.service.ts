/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Cron } from '@nestjs/schedule';
import { randomUUID } from 'crypto';
import { catchError, Observable, of } from 'rxjs';
import { CommandRepository } from 'src/commands/application/ports/command.repository';
import { Command } from 'src/commands/domain/command';

let connected = false;
export const agentId = randomUUID();

@Injectable()
export class AgentsService {
  constructor(
    protected amqpConnection: AmqpConnection,
    private readonly commandRepository: CommandRepository,
    @Inject('WORKER_MANAGER') private client: ClientProxy,
  ) {}

  @Cron('*/10 * * * * *')
  connectToMaster() {
    if (process.env.APP_ROLE! === 'master') {
      return;
    }
    if (!connected) {
      try {
        const response: Observable<boolean> = this.client.send<boolean>(
          { cmd: 'registerAgent' },
          {
            agentId: agentId,
          },
        );
        console.log('Attempting to connect to master with agentId:', agentId);

        response
          .pipe(
            catchError((err) => {
              console.log(err);
              return of(false);
            }),
          )
          .subscribe((res) => {
            if (res) {
              connected = true;
              console.log('Connected to controller!');
              console.log(res);
            } else {
              console.log('Failed to connect to controller!: ' + res);
            }
          });
      } catch (_: unknown) {
        /* ignore */
      }
    }
  }

  async queueCommands(scheduledCommands: Command[]) {
    for (const scheduledCommand of scheduledCommands) {
      const command = await this.commandRepository.findOne(scheduledCommand.id);

      await this.amqpConnection.publish(
        'command_execution_exchange',
        command.type.value,
        JSON.stringify(command),
      );

      await this.markScheduledCommandAsQueued(command.id);
    }
  }

  async queueCommandsByShard(params: {
    shard: number;
    timestamp: number;
  }): Promise<number> {
    try {
      const scheduledCommands =
        await this.commandRepository.findDueCommandsByShard(
          params.shard,
          params.timestamp,
        );

      await this.queueCommands(scheduledCommands);

      return scheduledCommands.length;
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  async markScheduledCommandAsQueued(commandId: string): Promise<void> {
    const scheduledCommand = await this.commandRepository.findOne(commandId);
    scheduledCommand.isQueued = true;
    await this.commandRepository.update(scheduledCommand);
  }
}
