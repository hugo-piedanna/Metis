import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Category } from '../categories/entities/category.entity';
import { Lot } from '../lots/entities/lot.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Category, Lot])],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule { }
