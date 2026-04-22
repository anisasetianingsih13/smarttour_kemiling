import { Test, TestingModule } from '@nestjs/testing';
import { TourismService } from './tourism.service';

describe('TourismService', () => {
  let service: TourismService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TourismService],
    }).compile();

    service = module.get<TourismService>(TourismService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
