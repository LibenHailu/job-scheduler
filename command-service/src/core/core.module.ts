import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import 'dotenv/config';

@Module({})
export class CoreModule {
  static forRoot() {
    return [
      RabbitMQModule.forRoot({
        exchanges: [
          {
            name: 'command_execution_exchange',
            type: 'direct',
          },
        ],
        uri: process.env.AMPQ_URL,
        connectionInitOptions: { wait: false },
      }),
    ];
  }
}
