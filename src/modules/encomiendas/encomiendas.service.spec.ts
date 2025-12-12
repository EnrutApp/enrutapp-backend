import { Test, TestingModule } from '@nestjs/testing';
import { EncomiendasService } from './encomiendas.service';

describe('EncomiendasService', () => {
  let service: EncomiendasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EncomiendasService],
    }).compile();

    service = module.get<EncomiendasService>(EncomiendasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
