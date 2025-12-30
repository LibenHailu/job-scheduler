import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandsModule } from './commands/application/commands.module';

@Module({
  imports: [CommandsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
