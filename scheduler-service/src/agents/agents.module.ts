import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import 'dotenv/config';
import { CommandsModule } from 'src/commands/application/commands.module';
import { CommandInfrastructureModule } from 'src/commands/infrastructure/command-infrastructure.module';
import { AgentsController } from './agents.controller';
import { AgentsService } from './agents.service';

@Module({
  imports: [
    CommandsModule.withInfrastructure(CommandInfrastructureModule.use('orm')),
    ClientsModule.register([
      {
        name: 'WORKER_MANAGER',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.AMQP_URL!],
          queue: 'scheduler-controller-queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    RabbitMQModule.forRoot({
      exchanges: [
        {
          name: 'scheduler_execution_exchange',
          type: 'direct',
        },
      ],
      uri: process.env.AMQP_URL!,
      connectionInitOptions: { wait: false },
    }),
  ],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
