import { forwardRef, Module } from '@nestjs/common';
import { LotsService } from '@/resources/lots/lots.service';
import { LotsController } from '@/resources/lots/lots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from '@/resources/lots/entities/lot.entity';
import { Product } from '@/resources/products/entities/product.entity';
import { ProductsModule } from '@/resources/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lot, Product]),
    forwardRef(() => ProductsModule),
  ],
  providers: [LotsService],
  controllers: [LotsController],
  exports: [LotsService],
})
export class LotsModule { }
