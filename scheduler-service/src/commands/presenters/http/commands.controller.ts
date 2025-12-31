import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommandsService } from '../../application/commands.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { CreateJobCommand } from 'src/commands/application/commands/create-command.command';

@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Post()
  create(@Body() createCommandDto: CreateCommandDto) {
    console.log(createCommandDto);
    return this.commandsService.create(
      new CreateJobCommand(
        createCommandDto.type,
        createCommandDto.status,
        createCommandDto.scheduledTime,
        createCommandDto.url,
      ),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commandsService.findOne(id);
  }
}
