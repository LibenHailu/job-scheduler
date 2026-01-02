import { Injectable } from '@nestjs/common';
import { CreateJobCommand } from './commands/create-command.command';
import { CommandRepository } from './ports/command.repository';
import { CommandFactory } from '../domain/factories/command.factory';

@Injectable()
export class CommandsService {
  constructor(
    private readonly commandRepository: CommandRepository,
    private readonly commandFactory: CommandFactory,
  ) {}
  async create(createCommand: CreateJobCommand) {
    const command = this.commandFactory.create(
      createCommand.type,
      createCommand.status,
      createCommand.scheduledTime,
      createCommand.url,
      createCommand.shard,
      createCommand.isQueued,
    );
    const newCommand = await this.commandRepository.save(command);
    return {
      commandId: newCommand.id,
    };
  }

  async findOne(id: string) {
    const command = await this.commandRepository.findOne(id);
    return {
      status: command.shard,
      agentId: command.shard,
    };
  }
}
