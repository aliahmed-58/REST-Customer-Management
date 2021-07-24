import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, OneToMany} from "typeorm";
import { ShoppingItems } from "./ShoppingItem";

@Entity()
export class Product {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column({type: "real"})
    price: number

    
}