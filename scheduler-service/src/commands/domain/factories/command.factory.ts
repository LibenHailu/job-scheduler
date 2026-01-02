import { randomUUID } from 'crypto';
import { CommandType } from '../value-objects/command-type';
import { CommandStatus } from '../value-objects/command-status';
import { Command } from '../command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandFactory {
  create(
    status: string,
    type: string,
    scheduledTime?: number,
    url?: string,
    shard: number = Math.floor(Math.random() * 6) + 1,
    isQueued: boolean = false,
  ): Command {
    const commandId = randomUUID();
    const commandType = new CommandType(type as CommandType['value']);
    const commandStatus = new CommandStatus(status as CommandStatus['value']);
    const commandScheduledTime = scheduledTime ?? new Date().getTime();
    const commandUrl = url;
    const commandShard = shard;
    const commandIsQueued = isQueued;
    return new Command(
      commandId,
      commandStatus,
      commandType,
      commandScheduledTime,
      commandUrl,
      commandShard,
      commandIsQueued,
    );
  }
}
