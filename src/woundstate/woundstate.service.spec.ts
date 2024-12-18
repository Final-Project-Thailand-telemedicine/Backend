import { Test, TestingModule } from '@nestjs/testing';
import { WoundstateService } from './woundstate.service';

describe('WoundstateService', () => {
  let service: WoundstateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WoundstateService],
    }).compile();

    service = module.get<WoundstateService>(WoundstateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
