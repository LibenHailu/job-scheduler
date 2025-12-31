import { Repository } from 'typeorm';
import { CommandEntity } from '../entities/command.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Command } from 'src/commands/domain/command';
import { CommandMapper } from '../mappers/command.mapper';

export class OrmCommandRepository {
  constructor(
    @InjectRepository(CommandEntity)
    private readonly ormRepository: Repository<CommandEntity>,
  ) {}

  async findOne(id: string): Promise<Command> {
    const entity = await this.ormRepository.findOneBy({
      id,
    });
    return CommandMapper.toDomain(entity!);
  }

  async save(command: Command): Promise<Command> {
    const persistanceModel = CommandMapper.toPersistence(command);
    const newEntity = await this.ormRepository.save(persistanceModel);
    return CommandMapper.toDomain(newEntity);
  }
}
