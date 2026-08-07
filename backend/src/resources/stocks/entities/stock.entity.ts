import { BaseEntity } from '@/core/entity/base.entity';
import { Product } from '@/resources/products/entities/product.entity';
import { Unit } from '@/resources/units/entities/unit.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('stocks')
export class Stock extends BaseEntity {
  @ManyToOne(() => Product, (product) => product.stocks, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Unit, (unit) => unit.stocks, {
    onDelete: 'RESTRICT',
    nullable: false,
  })
  @JoinColumn({ name: 'unit_id' })
  unit: Unit;

  @Column({ type: 'float', default: 1 })
  quantity: number;

  /** Absent = stock sans date (ex. vrac). Si présent, doit être ≥ aujourd’hui. */
  @Column({ type: 'date', nullable: true })
  expirationDate?: string | Date | null;
}
