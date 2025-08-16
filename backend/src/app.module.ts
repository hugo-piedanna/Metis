import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { Logger } from 'winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CategoriesModule } from '@/resources/categories/categories.module';
import { ProductsModule } from '@/resources/products/products.module';
import { LotsModule } from '@/resources/lots/lots.module';
import { UnitsModule } from '@/resources/units/units.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.POSTGRES_URL,
      autoLoadEntities: true,
      synchronize: process.env.ENV !== 'production',
    }),
    CategoriesModule,
    ProductsModule,
    LotsModule,
    UnitsModule
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
})
export class AppModule { }
