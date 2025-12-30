import { Injectable } from '@nestjs/common';
import { CreateJobCommand } from './commands/create-command.command';

@Injectable()
export class CommandsService {
  create(createCommandDto: CreateJobCommand) {
    return 'This action adds a new command';
  }

  findOne(id: number) {
    return `This action returns a #${id} command`;
  }
}
