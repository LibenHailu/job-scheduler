import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AgentsService } from './agents.service';

@Controller()
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @MessagePattern({ cmd: 'queueCommands' })
  async queueJobs(params: {
    shard: number;
    timestamp: number;
  }): Promise<number> {
    return await this.agentsService.queueCommandsByShard(params);
  }
}
