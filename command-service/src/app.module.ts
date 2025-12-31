import { Module } from '@nestjs/common';
import { CommandsModule } from './commands/application/commands.module';
import { CoreModule } from './core/core.module';

@Module({
  imports: [CommandsModule, CoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
