import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToMany, ManyToOne, OneToMany, JoinTable } from "typeorm";
import { Cart } from "./Cart";
import { Product } from "./Product";

@Entity()
export class ShoppingItems {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({type: "real", default: 1})
    qty: number
    
    @Column("uuid", {nullable: true})
    productId: string

    @Column({type: 'date', nullable: true} )
    duedate: Date;

    @ManyToOne(() => Product, product => product.id ,{onDelete: 'CASCADE'})
    @JoinColumn()
    product: Product;

    @ManyToOne(() => Cart, cart => cart.id, {onDelete: 'CASCADE'})
    @JoinColumn()
    cart: Cart
}