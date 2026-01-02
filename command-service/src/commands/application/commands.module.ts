import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsController } from '../presenters/commands.controller';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';

@Module({
  controllers: [CommandsController],
  providers: [CommandsService],
  imports: [
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'command_execution_exchange',
          type: 'direct',
        },
      ],
      uri: process.env.AMQP_URL,
      connectionInitOptions: { wait: false },
    }),
  ],
})
export class CommandsModule {}
