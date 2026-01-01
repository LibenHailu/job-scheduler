import { Module } from '@nestjs/common';
import { ControllerService } from './controller.service';
import { ControllerController } from './controller.controller';

@Module({
  controllers: [ControllerController],
  providers: [ControllerService],
})
export class ControllerModule {}
