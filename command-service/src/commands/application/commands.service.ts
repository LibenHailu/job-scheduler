import { Injectable } from '@nestjs/common';
import { CreateCommandDto } from '../presenters/dto/create-command.dto';
import axios from 'axios';
import 'dotenv/config';

@Injectable()
export class CommandsService {
  async create(createCommandDto: CreateCommandDto) {
    const schedulerUrl = process.env.SCHEDULER_SERVICE_URL!;

    try {
      const response = await axios.post(`${schedulerUrl}/commands`, {
        type: createCommandDto.type,
        status: createCommandDto.status,
        scheduledTime:
          new Date().getTime() + Number(createCommandDto?.payload?.ms),
        url: createCommandDto?.payload?.url,
      });

      return response.data as unknown;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async findOne(id: string) {
    const schedulerUrl = process.env.SCHEDULER_SERVICE_URL!;

    try {
      const response = await axios.get(`${schedulerUrl}/commands/${id}`);

      return response.data as unknown;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
