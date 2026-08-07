import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from '@/resources/products/products.service';
import { ProductsController } from '@/resources/products/products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '@/resources/products/entities/product.entity';
import { Category } from '@/resources/categories/entities/category.entity';
import { StocksModule } from '@/resources/stocks/stocks.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Category]),
    forwardRef(() => StocksModule),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService],
})
export class ProductsModule {}
