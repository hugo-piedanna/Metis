import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUnitDto } from '@/resources/units/dto/create-unit.dto';
import { UpdateUnitDto } from '@/resources/units/dto/update-unit.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit, UnitType } from '@/resources/units/entities/unit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UnitsService {

  constructor(
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>,
  ) { }

  async create(dto: CreateUnitDto) {
    const created = this.unitRepo.create(dto);
    const saved = await this.unitRepo.save(created);

    return { message: `Unit "${saved.label}" created`, data: saved };
  }

  async findAll(search?: string, type?: UnitType) {
    const qb = this.unitRepo.createQueryBuilder('u');

    if (search) qb.andWhere('u.label ILIKE :s', { s: `%${search}%` });
    if (type) qb.andWhere('u.type = :t', { t: type });

    qb.orderBy('u.type', 'ASC').addOrderBy('u.label', 'ASC');

    const data = await qb.getMany();
    return { message: 'Units retrieved successfully', data };
  }

  async findOne(id: string) {
    const unit = await this.unitRepo.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!unit) throw new NotFoundException(`Unit ${id} not found`);
    if (unit.deletedAt) throw new GoneException(`Unit ${id} has been deleted`);

    return { message: 'Unit retrieved successfully', data: unit };
  }

  async update(id: string, dto: UpdateUnitDto) {
    const { data: unit } = await this.findOne(id);
    Object.assign(unit, dto);
    const saved = await this.unitRepo.save(unit);

    return { message: `Unit "${saved.label}" updated`, data: saved };
  }

  async remove(id: string) {
    const { data: unit } = await this.findOne(id);
    await this.unitRepo.softDelete(unit.id);

    return { message: `Unit "${unit.label}" deleted`, data: null };
  }

  async restore(id: string) {
    await this.unitRepo.restore(id);
    const restored = await this.unitRepo.findOne({ where: { id } });
    if (!restored) throw new NotFoundException(`Unit ${id} not found after restore`);
    return { message: `Unit "${restored.label}" restored`, data: restored };
  }
}
