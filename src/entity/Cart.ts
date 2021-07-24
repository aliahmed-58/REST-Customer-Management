import {Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, ManyToOne, OneToMany} from 'typeorm';
import { Customer } from './Customer';
import { ShoppingItems } from './ShoppingItem';

@Entity()
export class Cart {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column("uuid", {nullable: true})
    customerId: string

    @OneToOne(() => Customer, customer => customer.cartId, {onDelete: 'CASCADE'})
    @JoinColumn()
    customer: Customer

}