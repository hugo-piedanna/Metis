import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from '@/resources/products/dto/create-product.dto';
import { UpdateProductDto } from '@/resources/products/dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product, ProductType } from '@/resources/products/entities/product.entity';
import { Category } from '@/resources/categories/entities/category.entity';
import { Lot } from '@/resources/lots/entities/lot.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product) private readonly productRepo: Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepo: Repository<Category>,
    @InjectRepository(Lot) private readonly lotRepo: Repository<Lot>,
  ) { }

  async create(dto: CreateProductDto) {
    const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
    if (!category) throw new NotFoundException('Category not found');

    const entity = this.productRepo.create({
      ...dto,
      category
    });

    const saved = await this.productRepo.save(entity);
    return { message: `Product "${saved.name}" created`, data: saved };
  }

  async findAll(params?: { search?: string; categoryId?: string; type?: ProductType }) {
    const { search, categoryId, type } = params || {};

    const qb = this.productRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.category', 'c')
      .leftJoinAndSelect('p.lots', 'l');

    if (search) qb.andWhere('p.name ILIKE :s', { s: `%${search}%` });
    if (categoryId) qb.andWhere('c.id = :cid', { cid: categoryId });
    if (type) qb.andWhere('p.type = :t', { t: type });

    qb.orderBy('p.name', 'ASC');

    const data = await qb.getMany();
    return { message: 'Products retrieved successfully', data };
  }

  async findOne(id: string) {
    const prod = await this.productRepo.findOne({
      where: { id },
      relations: ['category', 'lots'],
    });

    if (!prod) throw new NotFoundException(`Product ${id} not found`);
    if (prod.deletedAt) throw new GoneException(`Product ${id} has been deleted`);

    return { message: 'Product retrieved successfully', data: prod };
  }

  async update(id: string, dto: UpdateProductDto) {
    const { data: prod } = await this.findOne(id);
    Object.assign(prod, dto);

    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({ where: { id: dto.categoryId } });
      if (!category) throw new NotFoundException('Category not found');
      prod.category = category;
    }

    const saved = await this.productRepo.save(prod);
    return { message: `Product "${saved.name}" updated`, data: saved };
  }

  async remove(id: string) {
    const { data: prod } = await this.findOne(id);
    await this.productRepo.softDelete(prod.id);

    return { message: `Product "${prod.name}" deleted`, data: null };
  }

  async restore(id: string) {
    await this.productRepo.restore(id);

    const restored = await this.productRepo.findOne({ where: { id } });
    if (!restored) throw new NotFoundException(`Product ${id} not found after restore`);

    return { message: `Product "${restored.name}" restored`, data: restored };
  }

  async updateTotalQuantity(productId: string): Promise<Product> {
    const prod = await this.productRepo.findOne({ where: { id: productId } });
    if (!prod) throw new NotFoundException('Product not found');
    if (prod.type !== ProductType.FOOD) return;

    const lots = await this.lotRepo.find({ where: { product: { id: productId } } });
    const total = lots.reduce((acc, l) => acc + (l.quantity || 0), 0);
    prod.totalQuantity = total;
    const saved = await this.productRepo.save(prod);
    return saved;
  }
}
