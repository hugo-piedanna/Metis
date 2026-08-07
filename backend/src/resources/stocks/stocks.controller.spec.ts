import { Test, TestingModule } from '@nestjs/testing';
import { StocksController } from '@/resources/stocks/stocks.controller';
import { StocksService } from '@/resources/stocks/stocks.service';

describe('StocksController', () => {
  let controller: StocksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StocksController],
      providers: [
        {
          provide: StocksService,
          useValue: {
            create: jest.fn(),
            findAllByProduct: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            restore: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(StocksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
