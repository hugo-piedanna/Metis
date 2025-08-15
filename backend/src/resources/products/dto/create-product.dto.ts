import { IsEnum, IsNotEmpty, IsNumber, IsString, IsUUID, Min } from "class-validator";
import { ProductType } from "@/resources/products/entities/product.entity";

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsUUID()
    @IsNotEmpty()
    categoryId: string;

    @IsEnum(ProductType)
    type: ProductType;

    @IsNumber()
    @Min(0)
    totalQuantity: number;
}
