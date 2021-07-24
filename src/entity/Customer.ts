import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn} from 'typeorm';
import { Cart } from './Cart';

@Entity()
export class Customer {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column({type: "text", nullable: false})
    name: string

    @Column({type: "text", nullable: false})
    cellphone: string

    @Column({type: "text", nullable: true})
    date: string

    @Column("uuid", {nullable: true})
    cartId: string

    @OneToOne(() => Cart, cart => cart.customerId, {onDelete: 'SET NULL'})
    @JoinColumn()
    cart: Cart
}