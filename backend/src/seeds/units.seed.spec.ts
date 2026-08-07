import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnitsSeed, DEFAULT_UNITS } from '@/seeds/units.seed';
import { Unit } from '@/resources/units/entities/unit.entity';

describe('UnitsSeed', () => {
  let seed: UnitsSeed;
  let unitRepo: Record<string, jest.Mock>;

  beforeEach(async () => {
    unitRepo = {
      findOne: jest.fn(),
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => x),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UnitsSeed,
        { provide: getRepositoryToken(Unit), useValue: unitRepo },
      ],
    }).compile();

    seed = module.get(UnitsSeed);
  });

  it('insère toutes les unités par défaut si la table est vide', async () => {
    unitRepo.findOne.mockResolvedValue(null);

    await seed.init();

    expect(unitRepo.save).toHaveBeenCalledTimes(DEFAULT_UNITS.length);
    expect(DEFAULT_UNITS.map((u) => u.code)).toEqual(
      expect.arrayContaining(['g', 'kg', 'ml', 'l', 'unit', 'can']),
    );
  });

  it('est idempotent : ne recrée pas une unité existante', async () => {
    unitRepo.findOne.mockImplementation(async ({ where }) => {
      return { id: 'existing', code: where.code } as Unit;
    });

    await seed.init();

    expect(unitRepo.save).not.toHaveBeenCalled();
  });

  it('ne recrée pas une unité soft-deleted (withDeleted)', async () => {
    unitRepo.findOne.mockResolvedValue({
      id: 'soft',
      code: 'g',
      deletedAt: new Date(),
    });

    await seed.init();

    expect(unitRepo.findOne).toHaveBeenCalledWith(
      expect.objectContaining({ withDeleted: true }),
    );
    expect(unitRepo.save).not.toHaveBeenCalled();
  });
});
