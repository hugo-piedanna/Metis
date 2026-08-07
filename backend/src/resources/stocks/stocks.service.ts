import {
  GoneException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateStockDto } from '@/resources/stocks/dto/create-stock.dto';
import { UpdateStockDto } from '@/resources/stocks/dto/update-stock.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '@/resources/products/entities/product.entity';
import { Stock } from '@/resources/stocks/entities/stock.entity';
import { Unit } from '@/resources/units/entities/unit.entity';
import { Repository } from 'typeorm';
import { assertStockExpiration } from '@/resources/stocks/stock.rules';

@Injectable()
export class StocksService {
  constructor(
    @InjectRepository(Stock) private readonly stockRepo: Repository<Stock>,
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    @InjectRepository(Unit) private readonly unitRepo: Repository<Unit>,
  ) {}

  private async getProduct(productId: string, allowDeleted = false) {
    const product = await this.productRepo.findOne({
      where: { id: productId },
      withDeleted: true,
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.deletedAt && !allowDeleted) {
      throw new GoneException(`Product ${productId} has been deleted`);
    }
    return product;
  }

  private async resolveUnit(unitId: string) {
    const unit = await this.unitRepo.findOne({ where: { id: unitId } });
    if (!unit) throw new NotFoundException('Unit not found');
    return unit;
  }

  async create(productId: string, dto: CreateStockDto) {
    const product = await this.getProduct(productId);
    assertStockExpiration(product.type, dto.expirationDate);
    const unit = await this.resolveUnit(dto.unitId);

    const entity = this.stockRepo.create({
      product,
      unit,
      quantity: dto.quantity,
      expirationDate: dto.expirationDate ?? null,
    });

    const saved = await this.stockRepo.save(entity);
    saved.product = product;
    saved.unit = unit;

    return { message: `Stock line created for "${product.name}"`, data: saved };
  }

  async findAllByProduct(productId: string) {
    await this.getProduct(productId);

    const data = await this.stockRepo.find({
      where: { product: { id: productId } },
      relations: ['unit'],
      order: { expirationDate: 'ASC', createdAt: 'ASC' },
    });

    return { message: 'Stock lines retrieved successfully', data };
  }

  async findOne(productId: string, id: string) {
    const stock = await this.stockRepo.findOne({
      where: { id, product: { id: productId } },
      relations: ['product', 'unit'],
      withDeleted: true,
    });

    if (!stock) throw new NotFoundException(`Stock ${id} not found`);
    if (stock.deletedAt) {
      throw new GoneException(`Stock ${id} has been deleted`);
    }

    return { message: 'Stock line retrieved successfully', data: stock };
  }

  async update(productId: string, id: string, dto: UpdateStockDto) {
    const { data: stock } = await this.findOne(productId, id);

    if (dto.unitId) {
      stock.unit = await this.resolveUnit(dto.unitId);
    }
    if (dto.quantity != null) stock.quantity = dto.quantity;

    const nextExpiration =
      dto.expirationDate !== undefined
        ? dto.expirationDate
        : stock.expirationDate;

    assertStockExpiration(stock.product.type, nextExpiration ?? null);

    if (dto.expirationDate !== undefined) {
      stock.expirationDate = dto.expirationDate || null;
    }

    const saved = await this.stockRepo.save(stock);
    return { message: 'Stock line updated', data: saved };
  }

  async remove(productId: string, id: string) {
    const { data: stock } = await this.findOne(productId, id);
    await this.stockRepo.softDelete(stock.id);

    const remaining = await this.stockRepo.count({
      where: { product: { id: productId } },
    });

    if (remaining === 0) {
      await this.productRepo.softDelete(productId);
      return {
        message:
          'Stock line deleted; product soft-deleted (no remaining stock)',
        data: null,
      };
    }

    return { message: 'Stock line deleted', data: null };
  }

  async restore(productId: string, id: string) {
    const stock = await this.stockRepo.findOne({
      where: { id, product: { id: productId } },
      relations: ['product', 'unit'],
      withDeleted: true,
    });

    if (!stock) throw new NotFoundException(`Stock ${id} not found`);
    if (!stock.deletedAt) {
      throw new BadRequestException(`Stock ${id} is not deleted`);
    }

    const product = await this.getProduct(productId, true);
    if (product.deletedAt) {
      await this.productRepo.restore(productId);
    }

    await this.stockRepo.restore(id);
    const restored = await this.stockRepo.findOne({
      where: { id },
      relations: ['product', 'unit'],
    });
    if (!restored) {
      throw new NotFoundException(`Stock ${id} not found after restore`);
    }

    return { message: 'Stock line restored', data: restored };
  }

  async createForProduct(
    product: Product,
    dto: CreateStockDto,
  ): Promise<Stock> {
    assertStockExpiration(product.type, dto.expirationDate);
    const unit = await this.resolveUnit(dto.unitId);

    return this.stockRepo.save(
      this.stockRepo.create({
        product,
        unit,
        quantity: dto.quantity,
        expirationDate: dto.expirationDate ?? null,
      }),
    );
  }

  async softDeleteAllForProduct(productId: string): Promise<void> {
    await this.stockRepo
      .createQueryBuilder()
      .softDelete()
      .where('product_id = :productId', { productId })
      .execute();
  }
}
