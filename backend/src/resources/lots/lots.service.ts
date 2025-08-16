import { BadRequestException, GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLotDto } from '@/resources/lots/dto/create-lot.dto';
import { UpdateLotDto } from '@/resources/lots/dto/update-lot.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductType } from '@/resources/products/entities/product.entity';
import { Lot } from '@/resources/lots/entities/lot.entity';
import { Repository } from 'typeorm';
import { ProductsService } from '@/resources/products/products.service';

@Injectable()
export class LotsService {

  constructor(
    @InjectRepository(Lot) private readonly lotRepo: Repository<Lot>,
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    private readonly productsService: ProductsService,
  ) { }


  async create(productId: string, dto: CreateLotDto) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.type !== ProductType.FOOD) {
      throw new BadRequestException('Lots can only be created for FOOD products');
    }

    const entity = this.lotRepo.create({
      product,
      quantity: dto.quantity,
      expirationDate: dto.expirationDate as any,
    });

    const saved = await this.lotRepo.save(entity);
    const prod = await this.productsService.updateQuantity(productId);
    saved.product = prod;

    return { message: `Lot created for product "${product.name}"`, data: saved };
  }

  async findAllByProduct(productId: string) {
    const product = await this.productRepo.findOne({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');
    if (product.type !== ProductType.FOOD) {
      throw new BadRequestException('Only FOOD products can have lots');
    }

    const data = await this.lotRepo.find({
      where: { product: { id: productId } },
      withDeleted: false,
      order: { expirationDate: 'ASC' },
    });

    return { message: 'Lots retrieved successfully', data };
  }

  async findOne(productId: string, id: string) {
    const lot = await this.lotRepo.findOne({
      where: { id, product: { id: productId } },
      relations: ['product'],
      withDeleted: true,
    });

    if (!lot) throw new NotFoundException(`Lot ${id} not found`);
    if (lot.deletedAt) throw new GoneException(`Lot ${id} has been deleted`);

    return { message: 'Lot retrieved successfully', data: lot };
  }

  async update(productId: string, id: string, dto: UpdateLotDto) {
    const { data: lot } = await this.findOne(productId, id);
    Object.assign(lot, dto);

    if (dto.expirationDate != null) {
      lot.expirationDate = dto.expirationDate as any;
    }

    const saved = await this.lotRepo.save(lot);
    const prod = await this.productsService.updateQuantity(productId);
    saved.product = prod;

    return { message: 'Lot updated', data: saved };
  }

  async remove(productId: string, id: string) {
    const { data: lot } = await this.findOne(productId, id);
    await this.lotRepo.softDelete(lot.id);
    await this.productsService.updateQuantity(productId);

    return { message: 'Lot deleted', data: null };
  }

  async restore(productId: string, id: string) {
    await this.lotRepo.restore(id);
    const restored = await this.lotRepo.findOne({ where: { id }, relations: ['product'] });
    if (!restored) throw new NotFoundException(`Lot ${id} not found after restore`);

    const prod = await this.productsService.updateQuantity(productId);
    restored.product = prod;

    return { message: 'Lot restored', data: restored };
  }
}
