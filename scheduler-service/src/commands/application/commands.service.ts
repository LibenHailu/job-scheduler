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
  create(createCommand: CreateJobCommand) {
    const command = this.commandFactory.create(
      createCommand.type,
      createCommand.status,
      createCommand.scheduledTime,
      createCommand.url,
    );
    return this.commandRepository.save(command);
  }

  findOne(id: string) {
    return this.commandRepository.findOne(id);
  }
}
