import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from '@/resources/categories/categories.controller';
import { CategoriesService } from '@/resources/categories/categories.service';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        {
          provide: CategoriesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            restore: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
