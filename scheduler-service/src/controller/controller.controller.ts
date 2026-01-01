import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ControllerService } from './controller.service';

@Controller()
export class ControllerController {
  constructor(private readonly controllerService: ControllerService) {}

  @MessagePattern({ cmd: 'registerAgent' })
  async registerWorker(params: { agentId: string }): Promise<boolean> {
    try {
      await this.controllerService.addAgent(params);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
