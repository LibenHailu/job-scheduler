import { Command } from 'src/commands/domain/command';
import { CommandEntity } from '../entities/command.entity';
import { CommandStatus } from 'src/commands/domain/value-objects/command-status';
import { CommandType } from 'src/commands/domain/value-objects/command-type';

export class CommandMapper {
  static toDomain(CommandEntity: CommandEntity): Command {
    const commandType = new CommandType(
      CommandEntity.type as 'DELAY' | 'HTTP_GET_JSON',
    );
    const commandStatus = new CommandStatus(
      CommandEntity.status as 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED',
    );
    const commandModel = new Command(
      CommandEntity.id,
      commandStatus,
      commandType,
      CommandEntity.scheduledTime && CommandEntity.scheduledTime,
      CommandEntity.url && CommandEntity.url,
    );
    return commandModel;
  }

  static toPersistence(command: Command): CommandEntity {
    const commandEntity = new CommandEntity();
    commandEntity.id = command.id;
    commandEntity.status = command.status.value;
    commandEntity.type = command.type.value;
    commandEntity.scheduledTime = command.scheduledTime;
    commandEntity.url = command.url;
    return commandEntity;
  }
}
