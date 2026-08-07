import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductType } from '@/resources/products/entities/product.entity';
import { UnitType } from '@/resources/units/entities/unit.entity';

export class UnitDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'kg' })
  code: string;

  @ApiProperty({ example: 'Kilogramme' })
  label: string;

  @ApiProperty({ enum: UnitType })
  type: UnitType;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ nullable: true })
  deletedAt?: Date | null;
}

export class CategoryDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Féculents' })
  name: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ nullable: true })
  deletedAt?: Date | null;
}

export class StockDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 2.5 })
  quantity: number;

  @ApiPropertyOptional({ example: '2026-09-01', nullable: true })
  expirationDate?: string | Date | null;

  @ApiProperty({ type: () => UnitDto })
  unit: UnitDto;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ nullable: true })
  deletedAt?: Date | null;
}

export class TotalsByUnitDto {
  @ApiProperty()
  unitId: string;

  @ApiProperty({ example: 'kg' })
  code: string;

  @ApiProperty({ example: 'Kilogramme' })
  label: string;

  @ApiProperty({ example: 3 })
  quantity: number;
}

export class ProductDto {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Pâtes' })
  name: string;

  @ApiProperty({ enum: ProductType })
  type: ProductType;

  @ApiProperty({ type: () => CategoryDto })
  category: CategoryDto;

  @ApiProperty({ type: () => [StockDto] })
  stocks: StockDto[];

  @ApiProperty({ type: () => [TotalsByUnitDto] })
  totalsByUnit: TotalsByUnitDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ nullable: true })
  deletedAt?: Date | null;
}
