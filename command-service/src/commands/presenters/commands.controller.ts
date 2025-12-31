import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CommandsService } from '../application/commands.service';
import { CreateCommandDto } from './dto/create-command.dto';
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
}
