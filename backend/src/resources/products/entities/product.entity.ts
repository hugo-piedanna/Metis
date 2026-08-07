import { BaseEntity } from '@/core/entity/base.entity';
import { Category } from '@/resources/categories/entities/category.entity';
import { Stock } from '@/resources/stocks/entities/stock.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

export enum ProductType {
  FOOD = 'food',
  EQUIPMENT = 'equipment',
}

@Entity('products')
export class Product extends BaseEntity {
  @Column()
  name: string;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @OneToMany(() => Stock, (stock) => stock.product)
  stocks: Stock[];
}
