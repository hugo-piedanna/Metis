import { BaseEntity } from "@/core/entity/base.entity";
import { Product } from "@/resources/products/entities/product.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('lots')
export class Lot extends BaseEntity {
    @ManyToOne(() => Product, (product) => product.lots, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @Column({ type: 'float', default: 1 })
    quantity: number;

    @Column({ type: 'date' })
    expirationDate: Date;
}
