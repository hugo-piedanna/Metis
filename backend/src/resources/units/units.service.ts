import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Unit, UnitType } from '@/resources/units/entities/unit.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private readonly unitRepo: Repository<Unit>,
  ) {}

  async findAll(search?: string, type?: UnitType) {
    const qb = this.unitRepo.createQueryBuilder('u');

    if (search) qb.andWhere('u.label ILIKE :s', { s: `%${search}%` });
    if (type) qb.andWhere('u.type = :t', { t: type });

    qb.orderBy('u.type', 'ASC').addOrderBy('u.label', 'ASC');

    const data = await qb.getMany();
    return { message: 'Units retrieved successfully', data };
  }

  async findOne(id: string) {
    const unit = await this.unitRepo.findOne({ where: { id } });
    if (!unit) throw new NotFoundException(`Unit ${id} not found`);

    return { message: 'Unit retrieved successfully', data: unit };
  }
}
