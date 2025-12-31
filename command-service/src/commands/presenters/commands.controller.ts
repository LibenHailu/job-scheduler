import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommandsService } from '../application/commands.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { RabbitRPC } from '@golevelup/nestjs-rabbitmq';
@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Post()
  create(@Body() createCommandDto: CreateCommandDto) {
    return this.commandsService.create(createCommandDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandsService.findOne(id);
  }

  @RabbitRPC({
    exchange: 'command_execution_exchange_execution_exchange',
    routingKey: 'execute-command-task',
    queue: 'command-execution-queue',
  })
  executeCommand(rmqmsg) {
    try {
      console.log(rmqmsg);
    } catch (err) {
      console.error(err);
    }
  }
}
