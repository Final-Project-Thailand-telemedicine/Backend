import { Test, TestingModule } from '@nestjs/testing';
import { WoundService } from './wound.service';

describe('WoundService', () => {
  let service: WoundService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WoundService],
    }).compile();

    service = module.get<WoundService>(WoundService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
