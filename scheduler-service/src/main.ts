import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import 'dotenv/config';
import { agentId } from './agents/agents.service';

async function bootstrap() {
  if (!process.env.AMQP_URL) {
    throw new Error('AMQP_URL is not defined');
  }

  const app = await NestFactory.create(AppModule.register({ driver: 'orm' }));

  app.setGlobalPrefix('v1/api');

  const APP_ROLE = process.env.APP_ROLE;

  if (APP_ROLE === 'master') {
    // const app = await NestFactory.create(ControllerModule);

    // app.setGlobalPrefix('v1/api');
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AMQP_URL!],
        queue: 'scheduler-controller-queue',
        queueOptions: { durable: false },
      },
    });
    await app.startAllMicroservices();
    await app.listen(process.env.MASTER_PORT ?? 3000);
  } else {
    // const app = await NestFactory.create(AgentModule);

    // app.setGlobalPrefix('v1/api');

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.AMQP_URL!],
        queue: `${agentId}-queue`,
        queueOptions: { durable: false },
      },
    });
    await app.startAllMicroservices();
    await app.listen(process.env.WORKER_PORT ?? 3000);
  }

  // await app.startAllMicroservices();
  // await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
