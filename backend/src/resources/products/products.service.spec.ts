import { Test, TestingModule } from '@nestjs/testing';
import { GoneException, NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from '@/resources/products/products.service';
import {
  Product,
  ProductType,
} from '@/resources/products/entities/product.entity';
import { Category } from '@/resources/categories/entities/category.entity';
import { StocksService } from '@/resources/stocks/stocks.service';
import { Stock } from '@/resources/stocks/entities/stock.entity';
import { Unit } from '@/resources/units/entities/unit.entity';

describe('ProductsService (métier)', () => {
  let service: ProductsService;
  let productRepo: Record<string, jest.Mock>;
  let categoryRepo: Record<string, jest.Mock>;
  let stocksService: Record<string, jest.Mock>;

  const category = { id: 'cat-1', name: 'Féculents' } as Category;
  const unitKg = {
    id: 'u-kg',
    code: 'kg',
    label: 'Kilogramme',
  } as Unit;
  const unitBox = { id: 'u-box', code: 'box', label: 'Boîte' } as Unit;

  beforeEach(async () => {
    productRepo = {
      findOne: jest.fn(),
      save: jest.fn(async (p) => ({ id: 'prod-1', ...p })),
      create: jest.fn((x) => x),
      softDelete: jest.fn(),
      restore: jest.fn(),
      createQueryBuilder: jest.fn(),
    };
    categoryRepo = {
      findOne: jest.fn().mockResolvedValue(category),
    };
    stocksService = {
      createForProduct: jest.fn(async (_p, dto) => ({
        id: 'stock-1',
        quantity: dto.quantity,
        unit: unitKg,
        expirationDate: dto.expirationDate ?? null,
      })),
      softDeleteAllForProduct: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useValue: productRepo },
        { provide: getRepositoryToken(Category), useValue: categoryRepo },
        { provide: StocksService, useValue: stocksService },
      ],
    }).compile();

    service = module.get(ProductsService);
  });

  describe('create', () => {
    it('crée la fiche + la première ligne de stock', async () => {
      productRepo.findOne.mockResolvedValue({
        id: 'prod-1',
        name: 'Pâtes',
        type: ProductType.FOOD,
        category,
        stocks: [
          {
            id: 'stock-1',
            quantity: 2.5,
            unit: unitKg,
            expirationDate: null,
          } as Stock,
        ],
      });

      const result = await service.create({
        name: 'Pâtes',
        categoryId: category.id,
        type: ProductType.FOOD,
        initialStock: { quantity: 2.5, unitId: unitKg.id },
      });

      expect(stocksService.createForProduct).toHaveBeenCalled();
      expect(result.data.totalsByUnit).toEqual([
        expect.objectContaining({ code: 'kg', quantity: 2.5 }),
      ]);
    });

    it('404 si catégorie absente', async () => {
      categoryRepo.findOne.mockResolvedValue(null);

      await expect(
        service.create({
          name: 'Pâtes',
          categoryId: 'missing',
          type: ProductType.FOOD,
          initialStock: { quantity: 1, unitId: unitKg.id },
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('totalsByUnit', () => {
    it('agrège par unité sans fusionner kg et box', async () => {
      productRepo.findOne.mockResolvedValue({
        id: 'prod-1',
        name: 'Pâtes',
        type: ProductType.FOOD,
        deletedAt: null,
        category,
        stocks: [
          { quantity: 2.5, unit: unitKg } as Stock,
          { quantity: 1, unit: unitBox } as Stock,
          { quantity: 0.5, unit: unitKg } as Stock,
        ],
      });

      const result = await service.findOne('prod-1');

      expect(result.data.totalsByUnit).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ code: 'kg', quantity: 3 }),
          expect.objectContaining({ code: 'box', quantity: 1 }),
        ]),
      );
    });
  });

  describe('soft-delete / restore', () => {
    it('findOne renvoie 410 si soft-deleted', async () => {
      productRepo.findOne.mockResolvedValue({
        id: 'prod-1',
        deletedAt: new Date(),
      } as Product);

      await expect(service.findOne('prod-1')).rejects.toBeInstanceOf(
        GoneException,
      );
    });

    it('remove soft-delete le produit et toutes ses lignes', async () => {
      productRepo.findOne.mockResolvedValue({
        id: 'prod-1',
        name: 'Pâtes',
        deletedAt: null,
        category,
        stocks: [],
      });

      await service.remove('prod-1');

      expect(stocksService.softDeleteAllForProduct).toHaveBeenCalledWith(
        'prod-1',
      );
      expect(productRepo.softDelete).toHaveBeenCalledWith('prod-1');
    });

    it('restore ne touche pas aux lignes (pas d’appel softDeleteAll inverse)', async () => {
      productRepo.findOne.mockResolvedValue({
        id: 'prod-1',
        name: 'Pâtes',
        category,
        stocks: [],
      });

      await service.restore('prod-1');

      expect(productRepo.restore).toHaveBeenCalledWith('prod-1');
      expect(stocksService.softDeleteAllForProduct).not.toHaveBeenCalled();
    });
  });
});
