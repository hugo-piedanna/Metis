import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from '@/resources/categories/dto/create-category.dto';
import { UpdateCategoryDto } from '@/resources/categories/dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '@/resources/categories/entities/category.entity';
import { ILike, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) { }

  async create(dto: CreateCategoryDto) {
    const created = this.categoryRepo.create(dto);
    const saved = await this.categoryRepo.save(created);

    return { message: `Category "${saved.name}" created`, data: saved };
  }

  async findAll(search?: string) {
    const where = search ? { name: ILike(`%${search}%`) } : {};
    const data = await this.categoryRepo.find({
      where,
      relations: ['products'],
      withDeleted: false,
      order: { name: 'ASC' },
    });

    return { message: 'Categories retrieved successfully', data };
  }

  async findOne(id: string) {
    const cat = await this.categoryRepo.findOne({
      where: { id },
      relations: ['products'],
      withDeleted: true,
    });

    if (!cat) throw new NotFoundException(`Category ${id} not found`);
    if (cat.deletedAt) throw new GoneException(`Category ${id} has been deleted`);

    return { message: 'Category retrieved successfully', data: cat };
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const { data: cat } = await this.findOne(id);
    Object.assign(cat, dto);
    const saved = await this.categoryRepo.save(cat);

    return { message: `Category "${saved.name}" updated`, data: saved };
  }

  async remove(id: string) {
    const { data: cat } = await this.findOne(id);
    await this.categoryRepo.softDelete(cat.id);

    return { message: `Category "${cat.name}" deleted`, data: null };
  }

  async restore(id: string) {
    await this.categoryRepo.restore(id);
    const restored = await this.categoryRepo.findOne({ where: { id } });
    if (!restored) throw new NotFoundException(`Category ${id} not found after restore`);
    return { message: `Category "${restored.name}" restored`, data: restored };
  }
}
