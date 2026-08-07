import { Test, TestingModule } from '@nestjs/testing';
import { UnitsController } from '@/resources/units/units.controller';
import { UnitsService } from '@/resources/units/units.service';

describe('UnitsController', () => {
  let controller: UnitsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UnitsController],
      providers: [
        {
          provide: UnitsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(UnitsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
