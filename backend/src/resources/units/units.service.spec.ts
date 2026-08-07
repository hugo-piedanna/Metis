import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnitsService } from '@/resources/units/units.service';
import { Unit, UnitType } from '@/resources/units/entities/unit.entity';

describe('UnitsService (lecture)', () => {
  let service: UnitsService;
  let unitRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    unitRepo = {
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitsService,
        { provide: getRepositoryToken(Unit), useValue: unitRepo },
      ],
    }).compile();

    service = module.get(UnitsService);
  });

  it('findOne renvoie l’unité', async () => {
    unitRepo.findOne.mockResolvedValue({
      id: 'u1',
      label: 'Gramme',
      code: 'g',
      type: UnitType.MASS,
    } as Unit);

    const result = await service.findOne('u1');
    expect(result.data.code).toBe('g');
  });

  it('findOne renvoie 404 si absente', async () => {
    unitRepo.findOne.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('findAll filtre et trie via query builder', async () => {
    const qb = {
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([{ code: 'g' }]),
    };
    unitRepo.createQueryBuilder.mockReturnValue(qb);

    const result = await service.findAll('gram', UnitType.MASS);

    expect(qb.andWhere).toHaveBeenCalledTimes(2);
    expect(result.data).toHaveLength(1);
  });
});
