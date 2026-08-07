import { ProductType } from '@/resources/products/entities/product.entity';
import { assertStockExpiration } from '@/resources/stocks/stock.rules';
import { BadRequestException } from '@nestjs/common';

describe('assertStockExpiration', () => {
  const tomorrow = () => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + 1);
    return d.toISOString().slice(0, 10);
  };

  const yesterday = () => {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  };

  it('accepte une date absente (vrac)', () => {
    expect(() => assertStockExpiration(ProductType.FOOD, null)).not.toThrow();
    expect(() =>
      assertStockExpiration(ProductType.FOOD, undefined),
    ).not.toThrow();
  });

  it('accepte une date future pour FOOD', () => {
    expect(() =>
      assertStockExpiration(ProductType.FOOD, tomorrow()),
    ).not.toThrow();
  });

  it('refuse une date passée pour FOOD', () => {
    expect(() => assertStockExpiration(ProductType.FOOD, yesterday())).toThrow(
      BadRequestException,
    );
  });

  it('refuse toute date pour EQUIPMENT', () => {
    expect(() =>
      assertStockExpiration(ProductType.EQUIPMENT, tomorrow()),
    ).toThrow(BadRequestException);
  });

  it('accepte EQUIPMENT sans date', () => {
    expect(() =>
      assertStockExpiration(ProductType.EQUIPMENT, null),
    ).not.toThrow();
  });
});
