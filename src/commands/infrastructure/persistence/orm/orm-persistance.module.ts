import { TypeOrmModule } from '@nestjs/typeorm';
import { OrmCommandRepository } from './repositories/command.repository';
import { CommandEntity } from './entities/command.entity';
import { CommandRepository } from 'src/commands/application/ports/command.repository';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([CommandEntity])],
  providers: [{ provide: CommandRepository, useClass: OrmCommandRepository }],
  exports: [OrmCommandRepository],
})
export class OrmPersistanceModule {}
