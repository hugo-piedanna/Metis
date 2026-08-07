import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ProductType } from '@/resources/products/entities/product.entity';
import { CreateStockDto } from '@/resources/stocks/dto/create-stock.dto';

export class CreateProductDto {
  @ApiProperty({ example: 'Pâtes' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  categoryId: string;

  @ApiProperty({ enum: ProductType })
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({ type: CreateStockDto })
  @ValidateNested()
  @Type(() => CreateStockDto)
  initialStock: CreateStockDto;
}
