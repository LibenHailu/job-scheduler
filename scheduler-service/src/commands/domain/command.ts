import { CommandStatus } from './value-objects/command-status';
import { CommandType } from './value-objects/command-type';

export class Command {
  constructor(
    public id: string,
    public status: CommandStatus,
    public type: CommandType,
    public scheduledTime?: string,
    public url?: string,
    public shard?: number,
    public isQueued: boolean = false,
  ) {}
}
