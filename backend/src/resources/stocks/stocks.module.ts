import { Module } from '@nestjs/common';
import { StocksService } from '@/resources/stocks/stocks.service';
import { StocksController } from '@/resources/stocks/stocks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stock } from '@/resources/stocks/entities/stock.entity';
import { Product } from '@/resources/products/entities/product.entity';
import { Unit } from '@/resources/units/entities/unit.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Stock, Product, Unit])],
  providers: [StocksService],
  controllers: [StocksController],
  exports: [StocksService],
})
export class StocksModule {}
