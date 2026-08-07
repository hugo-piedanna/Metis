import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '@/resources/products/dto/create-product.dto';
import { UpdateProductDto } from '@/resources/products/dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Product,
  ProductType,
} from '@/resources/products/entities/product.entity';
import { Category } from '@/resources/categories/entities/category.entity';
import { Stock } from '@/resources/stocks/entities/stock.entity';
import { Repository } from 'typeorm';
import { StocksService } from '@/resources/stocks/stocks.service';

export type TotalsByUnit = {
  unitId: string;
  code: string;
  label: string;
  quantity: number;
};

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
    private readonly stocksService: StocksService,
  ) {}

  private totalsByUnit(stocks: Stock[]): TotalsByUnit[] {
    const map = new Map<string, TotalsByUnit>();
    for (const s of stocks) {
      if (!s.unit) continue;
      const existing = map.get(s.unit.id);
      if (existing) {
        existing.quantity += s.quantity || 0;
      } else {
        map.set(s.unit.id, {
          unitId: s.unit.id,
          code: s.unit.code,
          label: s.unit.label,
          quantity: s.quantity || 0,
        });
      }
    }
    return Array.from(map.values()).sort((a, b) =>
      a.code.localeCompare(b.code),
    );
  }

  private withTotals(product: Product) {
    const stocks = product.stocks ?? [];
    return {
      ...product,
      stocks,
      totalsByUnit: this.totalsByUnit(stocks),
    };
  }

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOne({
      where: { id: dto.categoryId },
    });
    if (!category) throw new NotFoundException('Category not found');

    const product = await this.productRepo.save(
      this.productRepo.create({
        name: dto.name,
        type: dto.type,
        category,
      }),
    );

    const stock = await this.stocksService.createForProduct(
      product,
      dto.initialStock,
    );

    const full = await this.productRepo.findOne({
      where: { id: product.id },
      relations: ['category', 'stocks', 'stocks.unit'],
    });

    return {
      message: `Product "${product.name}" created`,
      data: this.withTotals(full ?? { ...product, stocks: [stock] }),
    };
  }

  async findAll(params?: {
    search?: string;
    categoryId?: string;
    type?: ProductType;
  }) {
    const { search, categoryId, type } = params || {};

    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c')
      .leftJoinAndSelect('p.stocks', 's')
      .leftJoinAndSelect('s.unit', 'u');

    if (search) qb.andWhere('p.name ILIKE :s', { s: `%${search}%` });
    if (categoryId) qb.andWhere('c.id = :cid', { cid: categoryId });
    if (type) qb.andWhere('p.type = :t', { t: type });

    qb.orderBy('p.name', 'ASC');

    const products = await qb.getMany();
    const data = products.map((p) => this.withTotals(p));

    return { message: 'Products retrieved successfully', data };
  }

  async findOne(id: string) {
    const prod = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'stocks', 'stocks.unit'],
      withDeleted: true,
    });

    if (!prod) throw new NotFoundException(`Product ${id} not found`);
    if (prod.deletedAt) {
      throw new GoneException(`Product ${id} has been deleted`);
    }

    return {
      message: 'Product retrieved successfully',
      data: this.withTotals(prod),
    };
  }

  async update(id: string, dto: UpdateProductDto) {
    const { data } = await this.findOne(id);
    const prod = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'stocks', 'stocks.unit'],
    });
    if (!prod) throw new NotFoundException(`Product ${id} not found`);

    if (dto.name != null) prod.name = dto.name;

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId },
      });
      if (!category) throw new NotFoundException('Category not found');
      prod.category = category;
    }

    const saved = await this.productRepo.save(prod);
    const full = await this.productRepo.findOne({
      where: { id: saved.id },
      relations: ['category', 'stocks', 'stocks.unit'],
    });

    return {
      message: `Product "${saved.name}" updated`,
      data: this.withTotals(full ?? { ...saved, stocks: data.stocks }),
    };
  }

  async remove(id: string) {
    const { data: prod } = await this.findOne(id);
    await this.stocksService.softDeleteAllForProduct(prod.id);
    await this.productRepo.softDelete(prod.id);

    return { message: `Product "${prod.name}" deleted`, data: null };
  }

  async restore(id: string) {
    await this.productRepo.restore(id);

    const restored = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'stocks', 'stocks.unit'],
    });
    if (!restored) {
      throw new NotFoundException(`Product ${id} not found after restore`);
    }

    return {
      message: `Product "${restored.name}" restored`,
      data: this.withTotals(restored),
    };
  }
}
