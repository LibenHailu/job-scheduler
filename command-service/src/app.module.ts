import { Module } from '@nestjs/common';
import { CommandsModule } from './commands/application/commands.module';

@Module({
  imports: [CommandsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
