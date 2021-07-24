import { getConnection, getRepository } from "typeorm";
import { Customer } from "../entity/Customer";
import { Response } from 'express';
import { validateUser } from "../helper/validate";
import { ShoppingItems } from "../entity/ShoppingItem";
import { Product } from "../entity/Product";

export type CustomerInfo = {
    name: string,
    cellphone: string
}

// POST a customer 
export const newUser = async (req: any, res: Response) => {
    const customer: CustomerInfo = req.body;

    //validate input
    try {
        await validateUser({ name: customer.name, cellphone: customer.cellphone });
    } catch (error) {
        return res.json({error: error.details[0].message});
    }

    // correct input check if user already exists;
    try {
        const customerList = await getRepository(Customer)
            .createQueryBuilder("customer")
            .where("customer.cellphone = :cellphone", { cellphone: customer.cellphone })
            .getMany();

        if (customerList.length > 0) return res.json({ error: 'user already exists' });

    } catch (error) {
        console.log(error)
    }

    // saving the user
    try {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Customer)
            .values(
                { name: customer.name.toLowerCase(), cellphone: customer.cellphone }
            )
            .execute();

        return res.json({success: true})
    } catch (error) {
        console.log(error)
    }

}

//GET customers
export const getCustomers = async (req: any, res: Response) => {

    type CustomerData = {
        customer: Customer,
        productsInCart: number
    }

    try {
        let customers = [];

        const output = await getRepository(Customer)
            .createQueryBuilder("customer")
            .getMany()

        for (const i in output) {
            let productsInCart: number = 0;
            let customer: Customer = output[i];
            if (output[i].cartId === null) {
                let input: CustomerData = { customer, productsInCart };
                customers.push(input);
            }
            else {
                try {
                    const items = await getRepository(ShoppingItems)
                        .createQueryBuilder("items")
                        .where("items.cartId = :id", { id: output[i].cartId })
                        .getMany();

                    productsInCart = items.length;
                    let x: CustomerData = { customer, productsInCart };
                    customers.push(x);
                } catch (error) {
                    console.log(error)
                }
            }
        }

        return res.render('index', {customers: customers});
    } catch (error) {
        console.log(error)
    }
}

//GET customer by id
export const getCustomerById = async (req: any, res: Response) => {

    // have to pass on his cart, count of shopping_items,

    const id = req.query.id;

    try {
        const customer = await getRepository(Customer)
            .createQueryBuilder("customer")
            .where("customer.id = :id", { id: id })
            .getOne()
        
        const items = await getRepository(ShoppingItems)
            .createQueryBuilder("items")
            .where("items.cartId = :id", {id: customer.cartId})
            .getMany();

        type productType = {
            qty: number,
            product: Product
            date: Date
        }
    
        let products = [];
        let total = 0;

        const allProduct = await getRepository(Product)
            .createQueryBuilder()
            .getMany();

        for (const i in items) {
            const product = await getRepository(Product)
                .createQueryBuilder("products")
                .where("products.id = :id", {id: items[i].productId})
                .getOne();
            
            total += product.price * items[i].qty;
            const item : productType = {qty: items[i].qty, product, date: items[i].duedate};
            products.push(item);
        }

        return res.render('singleCustomer', {allProducts: allProduct, customer: customer, unique: items.length, products: products, total: total});

    } catch (error) {
        console.log(error)
    }

}

// DELETE customer by id
export const deleteCustomer = async (req: any, res: Response) => {
    const id = req.query.id;

    try {

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Customer)
            .where("id = :id", { id: id })
            .execute()

        return res.status(200).json({ success: true });
    } catch (error) {
        console.log(error)
    }

}

export const newCustomerRender = (req: any, res: Response) => {
    return res.render('newCustomer');
}