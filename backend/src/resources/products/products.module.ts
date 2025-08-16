import { Module } from '@nestjs/common';
import { ProductsService } from '@/resources/products/products.service';
import { ProductsController } from '@/resources/products/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/resources/products/entities/product.entity';
import { Category } from '@/resources/categories/entities/category.entity';
import { Lot } from '@/resources/lots/entities/lot.entity';
import { Unit } from '@/resources/units/entities/unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Lot, Unit])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule { }
