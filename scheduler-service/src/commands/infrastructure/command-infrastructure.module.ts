import { DynamicModule, Module, Type } from '@nestjs/common';
import { OrmPersistanceModule } from './persistence/orm/orm-persistance.module';

@Module({})
export class CommandInfrastructureModule {
  static use(driver: 'orm'): Type | DynamicModule {
    const persistanceModule = OrmPersistanceModule;
    return {
      module: CommandInfrastructureModule,
      imports: [persistanceModule],
      exports: [persistanceModule],
    };
  }
}
