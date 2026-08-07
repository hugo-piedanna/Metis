import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  GoneException,
  NotFoundException,
} from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StocksService } from '@/resources/stocks/stocks.service';
import { Stock } from '@/resources/stocks/entities/stock.entity';
import {
  Product,
  ProductType,
} from '@/resources/products/entities/product.entity';
import { Unit } from '@/resources/units/entities/unit.entity';

describe('StocksService (métier)', () => {
  let service: StocksService;
  let stockRepo: Record<string, jest.Mock>;
  let productRepo: Record<string, jest.Mock>;
  let unitRepo: Record<string, jest.Mock>;

  const unit = { id: 'u-kg', code: 'kg', label: 'Kilogramme' } as Unit;
  const food = {
    id: 'prod-1',
    name: 'Pâtes',
    type: ProductType.FOOD,
    deletedAt: null,
  } as Product;
  const equipment = {
    id: 'prod-eq',
    name: 'Tente',
    type: ProductType.EQUIPMENT,
    deletedAt: null,
  } as Product;

  beforeEach(async () => {
    const qb = {
      softDelete: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      execute: jest.fn(),
    };

    stockRepo = {
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => ({ id: 'stock-1', ...x })),
      softDelete: jest.fn(),
      restore: jest.fn(),
      count: jest.fn(),
      createQueryBuilder: jest.fn(() => qb),
    };
    productRepo = {
      findOne: jest.fn(),
      softDelete: jest.fn(),
      restore: jest.fn(),
    };
    unitRepo = {
      findOne: jest.fn().mockResolvedValue(unit),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        { provide: getRepositoryToken(Stock), useValue: stockRepo },
        { provide: getRepositoryToken(Product), useValue: productRepo },
        { provide: getRepositoryToken(Unit), useValue: unitRepo },
      ],
    }).compile();

    service = module.get(StocksService);
  });

  describe('create', () => {
    it('crée une ligne vrac (sans expiration) sur FOOD', async () => {
      productRepo.findOne.mockResolvedValue(food);

      const result = await service.create(food.id, {
        quantity: 2.5,
        unitId: unit.id,
      });

      expect(stockRepo.save).toHaveBeenCalled();
      expect(result.data.quantity).toBe(2.5);
      expect(result.data.expirationDate).toBeNull();
    });

    it('refuse une expiration sur EQUIPMENT', async () => {
      productRepo.findOne.mockResolvedValue(equipment);

      await expect(
        service.create(equipment.id, {
          quantity: 1,
          unitId: unit.id,
          expirationDate: '2030-01-01',
        }),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('refuse un produit soft-deleted (410)', async () => {
      productRepo.findOne.mockResolvedValue({
        ...food,
        deletedAt: new Date(),
      });

      await expect(
        service.create(food.id, { quantity: 1, unitId: unit.id }),
      ).rejects.toBeInstanceOf(GoneException);
    });
  });

  describe('soft-delete / restore', () => {
    const activeStock = {
      id: 'stock-1',
      quantity: 1,
      deletedAt: null,
      product: food,
      unit,
    } as Stock;

    it('soft-delete le produit si c’était la dernière ligne', async () => {
      stockRepo.findOne.mockResolvedValue(activeStock);
      stockRepo.count.mockResolvedValue(0);

      const result = await service.remove(food.id, activeStock.id);

      expect(stockRepo.softDelete).toHaveBeenCalledWith(activeStock.id);
      expect(productRepo.softDelete).toHaveBeenCalledWith(food.id);
      expect(result.message).toContain('product soft-deleted');
    });

    it('ne soft-delete pas le produit s’il reste des lignes', async () => {
      stockRepo.findOne.mockResolvedValue(activeStock);
      stockRepo.count.mockResolvedValue(2);

      await service.remove(food.id, activeStock.id);

      expect(productRepo.softDelete).not.toHaveBeenCalled();
    });

    it('restore restaure aussi le produit s’il était soft-deleted', async () => {
      const deletedStock = {
        ...activeStock,
        deletedAt: new Date(),
        product: { ...food, deletedAt: new Date() },
      } as Stock;

      stockRepo.findOne
        .mockResolvedValueOnce(deletedStock)
        .mockResolvedValueOnce({ ...activeStock, deletedAt: null });
      productRepo.findOne.mockResolvedValue({
        ...food,
        deletedAt: new Date(),
      });

      await service.restore(food.id, activeStock.id);

      expect(productRepo.restore).toHaveBeenCalledWith(food.id);
      expect(stockRepo.restore).toHaveBeenCalledWith(activeStock.id);
    });

    it('restore refuse une ligne non soft-deleted', async () => {
      stockRepo.findOne.mockResolvedValue(activeStock);

      await expect(
        service.restore(food.id, activeStock.id),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('restore refuse un mauvais productId', async () => {
      stockRepo.findOne.mockResolvedValue(null);

      await expect(
        service.restore('other', activeStock.id),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
