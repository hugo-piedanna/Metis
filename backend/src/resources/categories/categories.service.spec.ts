import { Test, TestingModule } from '@nestjs/testing';
import { GoneException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '@/resources/categories/categories.service';
import { Category } from '@/resources/categories/entities/category.entity';

describe('CategoriesService (métier)', () => {
  let service: CategoriesService;
  let categoryRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    categoryRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => ({ id: 'c1', ...x })),
      softDelete: jest.fn(),
      restore: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        { provide: getRepositoryToken(Category), useValue: categoryRepo },
      ],
    }).compile();

    service = module.get(CategoriesService);
  });

  it('findOne renvoie 410 si la catégorie est soft-deleted', async () => {
    categoryRepo.findOne.mockResolvedValue({
      id: 'c1',
      name: 'Alimentaire',
      deletedAt: new Date(),
    });

    await expect(service.findOne('c1')).rejects.toBeInstanceOf(GoneException);
  });

  it('remove soft-delete la catégorie', async () => {
    categoryRepo.findOne.mockResolvedValue({
      id: 'c1',
      name: 'Alimentaire',
      deletedAt: null,
    });

    await service.remove('c1');

    expect(categoryRepo.softDelete).toHaveBeenCalledWith('c1');
  });

  it('restore restaure une catégorie', async () => {
    categoryRepo.findOne.mockResolvedValue({
      id: 'c1',
      name: 'Alimentaire',
    });

    const result = await service.restore('c1');

    expect(categoryRepo.restore).toHaveBeenCalledWith('c1');
    expect(result.data.name).toBe('Alimentaire');
  });
});
