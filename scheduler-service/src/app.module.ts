import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandsModule } from './commands/application/commands.module';
import { CoreModule } from './core/core.module';
import { ApplicationBootstrapOptions } from './common/interfaces/app-bootstrap-options.interface';
import { CommandInfrastructureModule } from './commands/infrastructure/command-infrastructure.module';
import { ControllerModule } from './controller/controller.module';
import { AgentsModule } from './agents/agents.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    CoreModule,
    ControllerModule,
    AgentsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ...CoreModule.forRoot(options),
        CommandsModule.withInfrastructure(
          CommandInfrastructureModule.use(options.driver),
        ),
      ],
    };
  }
}
