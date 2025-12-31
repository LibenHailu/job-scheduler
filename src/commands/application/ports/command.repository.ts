import { Command } from 'src/commands/domain/command';

export abstract class CommandRepository {
  abstract findOne(id: string): Promise<Command>;
  abstract save(command: Command): Promise<Command>;
}
