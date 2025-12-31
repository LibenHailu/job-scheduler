import { randomUUID } from 'crypto';
import { CommandType } from '../value-objects/command-type';
import { CommandStatus } from '../value-objects/command-status';
import { Command } from '../command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommandFactory {
  create(status: string, type: string): Command {
    const commandId = randomUUID();
    const commandType = new CommandType(type as CommandType['value']);
    const commandStatus = new CommandStatus(status as CommandStatus['value']);
    return new Command(commandId, commandStatus, commandType);
  }
}
