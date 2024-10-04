import { Test, TestingModule } from '@nestjs/testing';
import { WoundController } from './wound.controller';

describe('WoundController', () => {
  let controller: WoundController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WoundController],
    }).compile();

    controller = module.get<WoundController>(WoundController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
