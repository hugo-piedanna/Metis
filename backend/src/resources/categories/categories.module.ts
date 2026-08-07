import { Module } from '@nestjs/common';
import { CategoriesService } from '@/resources/categories/categories.service';
import { CategoriesController } from '@/resources/categories/categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '@/resources/categories/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  providers: [CategoriesService],
  controllers: [CategoriesController],
  exports: [CategoriesService],
})
export class CategoriesModule {}
