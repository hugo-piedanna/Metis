import { BaseEntity } from "@/core/entity/base.entity";
import { Category } from "@/resources/categories/entities/category.entity";
import { Lot } from "@/resources/lots/entities/lot.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

export enum ProductType {
    FOOD = 'food',
    EQUIPMENT = 'equipment',
}

@Entity('products')
export class Product extends BaseEntity {
    @Column()
    name: string;

    @ManyToOne(() => Category, (category) => category.products, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @Column({ type: 'enum', enum: ProductType })
    type: ProductType;

    @Column({ type: 'float', default: 0 })
    totalQuantity: number;

    @OneToMany(() => Lot, (lot) => lot.product)
    lots: Lot[];
}
