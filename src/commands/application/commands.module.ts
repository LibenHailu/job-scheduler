import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsController } from '../presenters/http/commands.controller';
import { CommandFactory } from '../domain/factories/command.factory';

@Module({
  controllers: [CommandsController],
  providers: [CommandsService, CommandFactory],
})
export class CommandsModule {}
