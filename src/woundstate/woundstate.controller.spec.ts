import { Test, TestingModule } from '@nestjs/testing';
import { WoundstateController } from './woundstate.controller';

describe('WoundstateController', () => {
  let controller: WoundstateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WoundstateController],
    }).compile();

    controller = module.get<WoundstateController>(WoundstateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
