import { Test, TestingModule } from '@nestjs/testing';
import { UnitsController } from '@/resources/units/units.controller';
import { UnitsService } from '@/resources/units/units.service';

describe('UnitsController', () => {
  let controller: UnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitsController],
      providers: [UnitsService],
    }).compile();

    controller = module.get<UnitsController>(UnitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
