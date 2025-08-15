import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from '@/resources/products/dto/create-product.dto';

export class UpdateProductDto extends PartialType(OmitType(CreateProductDto, ['type'])) { }
