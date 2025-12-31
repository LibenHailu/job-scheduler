import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/app-bootstrap-options.interface';

@Module({})
export class CoreModule {
  static forRoot(options?: ApplicationBootstrapOptions) {
    return [
      TypeOrmModule.forRoot({
        type: 'sqlite',
        database: './../dev.db', // The name of your database file
        entities: [join(process.cwd(), 'dist/**/*.entity.js')], // Scan for entities
        synchronize: true, // Automatically create database tables from entities (good for dev, use migrations in prod)
      }),
      // RabbitMQModule.forRoot({
      //   exchanges: [
      //     {
      //       name: 'command_execution_exchange',
      //       type: 'direct',
      //     },
      //   ],
      //   uri: process.env.AMPQ_URL,
      //   connectionInitOptions: { wait: false },
      // }),
    ];
  }
}
