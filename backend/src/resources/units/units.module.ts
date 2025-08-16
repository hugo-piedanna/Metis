import { Module, OnModuleInit } from '@nestjs/common';
import { UnitsService } from '@/resources/units/units.service';
import { UnitsController } from '@/resources/units/units.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from '@/resources/units/entities/unit.entity';
import { UnitsSeed } from '@/seeds/units.seed';

@Module({
  imports: [TypeOrmModule.forFeature([Unit])],
  providers: [UnitsService, UnitsSeed],
  controllers: [UnitsController],
  exports: [UnitsService],
})
export class UnitsModule implements OnModuleInit {

  constructor(private readonly unitsSeed: UnitsSeed) { }

  onModuleInit() {
    this.unitsSeed.init();
  }
}
