import { forwardRef, Module } from '@nestjs/common';
import { LotsService } from './lots.service';
import { LotsController } from './lots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lot } from './entities/lot.entity';
import { Product } from '../products/entities/product.entity';
import { ProductsModule } from '../products/products.module';

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
