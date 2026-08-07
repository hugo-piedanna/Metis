import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateProductDto } from '@/resources/products/dto/create-product.dto';

export class UpdateProductDto extends PartialType(
  OmitType(CreateProductDto, ['type', 'initialStock'] as const),
) {}
