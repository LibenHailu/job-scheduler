import { Test, TestingModule } from '@nestjs/testing';
import { CommandsController } from './commands.controller';
import { CommandsService } from '../../application/commands.service';

describe('CommandsController', () => {
  let controller: CommandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommandsController],
      providers: [CommandsService],
    }).compile();

    controller = module.get<CommandsController>(CommandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
