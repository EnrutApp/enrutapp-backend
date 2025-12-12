import { Test, TestingModule } from '@nestjs/testing';
import { EncomiendasController } from './encomiendas.controller';

describe('EncomiendasController', () => {
  let controller: EncomiendasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EncomiendasController],
    }).compile();

    controller = module.get<EncomiendasController>(EncomiendasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
