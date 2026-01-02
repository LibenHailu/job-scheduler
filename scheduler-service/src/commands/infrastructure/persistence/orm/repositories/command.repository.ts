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

  async findDueCommandsByShard(
    shard: number,
    currentTimeMs: number,
  ): Promise<Command[]> {
    const entities = await this.ormRepository
      .createQueryBuilder('command')
      .where('command.scheduledTime <= :now', { now: currentTimeMs })
      .andWhere('command.shard = :shard', { shard })
      .andWhere('command.isQueued = 0')
      .orderBy('command.scheduledTime', 'ASC')
      .getMany();

    return entities.map((item) => CommandMapper.toDomain(item));
  }

  async update(command: Command): Promise<void> {
    await this.ormRepository.update(
      { id: command.id },
      {
        ...CommandMapper.toPersistence(command),
      },
    );
  }
}
