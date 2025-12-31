import { DynamicModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandsModule } from './commands/application/commands.module';
import { CoreModule } from './core/core.module';
import { ApplicationBootstrapOptions } from './common/interfaces/app-bootstrap-options.interface';
import { CommandInfrastructureModule } from './commands/infrastructure/command-infrastructure.module';

@Module({
  imports: [CoreModule],
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
