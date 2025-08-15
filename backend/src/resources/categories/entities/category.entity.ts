import { BaseEntity } from "@/core/entity/base.entity";
import { Product } from "@/resources/products/entities/product.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity('categories')
export class Category extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
