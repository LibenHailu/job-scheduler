import { DynamicModule, Module, Type } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsController } from '../presenters/http/commands.controller';
import { CommandFactory } from '../domain/factories/command.factory';
import { CommandRepository } from './ports/command.repository';
import { OrmCommandRepository } from '../infrastructure/persistence/orm/repositories/command.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandEntity } from '../infrastructure/persistence/orm/entities/command.entity';

@Module({
  controllers: [CommandsController],
  providers: [CommandsService, CommandFactory],
  exports: [CommandsService],
})
export class CommandsModule {
  static withInfrastructure(infrastructureModule: Type | DynamicModule) {
    return {
      module: CommandsModule,
      imports: [
        infrastructureModule,
        TypeOrmModule.forFeature([CommandEntity]),
      ],
      providers: [
        {
          provide: CommandRepository,
          useClass: OrmCommandRepository,
        },
      ],
      exports: [CommandRepository],
    };
  }
}
