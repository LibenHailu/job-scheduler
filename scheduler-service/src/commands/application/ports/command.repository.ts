import { Command } from 'src/commands/domain/command';

export abstract class CommandRepository {
  abstract findOne(id: string): Promise<Command>;
  abstract save(command: Command): Promise<Command>;
  abstract findDueCommandsByShard(
    currentTimeMs: number,
    shard: number,
  ): Promise<Command[]>;
  abstract update(command: Command): Promise<void>;
}
