import { Test, TestingModule } from '@nestjs/testing';
import { TreatController } from './treat.controller';

describe('TreatController', () => {
  let controller: TreatController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreatController],
    }).compile();

    controller = module.get<TreatController>(TreatController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
