import { BaseEntity } from '@/core/entity/base.entity';
import { Stock } from '@/resources/stocks/entities/stock.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum UnitType {
  VOLUME = 'volume',
  MASS = 'mass',
  LENGTH = 'length',
  SURFACE = 'surface',
  PIECE = 'piece',
}

@Entity('units')
export class Unit extends BaseEntity {
  @Column({ unique: true })
  code: string;

  @Column()
  label: string;

  @Column({ type: 'enum', enum: UnitType })
  type: UnitType;

  @OneToMany(() => Stock, (stock) => stock.unit)
  stocks: Stock[];
}
