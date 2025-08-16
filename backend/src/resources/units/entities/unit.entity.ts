import { BaseEntity } from "@/core/entity/base.entity";
import { Product } from "@/resources/products/entities/product.entity";
import { Column, Entity, OneToMany } from "typeorm";

export enum UnitType {
    VOLUME = 'volume',
    MASS = 'mass',
    LENGTH = 'length',
    SURFACE = 'surface',
    PIECE = 'piece'
}

@Entity('units')
export class Unit extends BaseEntity {

    @Column({ unique: true })
    code: string;

    @Column()
    label: string;

    @Column({ type: 'enum', enum: UnitType })
    type: UnitType;

    @OneToMany(() => Product, (product) => product.unit)
    products: Product[];
}
