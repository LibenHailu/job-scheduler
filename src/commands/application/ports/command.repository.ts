import { Command } from 'src/commands/domain/command';

export abstract class CommandRepository {
  abstract findOne(id: number): Promise<Command>;
  abstract save(command: Command): Promise<Command>;
}
