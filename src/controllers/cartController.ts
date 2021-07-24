import { Response } from 'express';
import { getConnection, getMongoRepository, getRepository } from 'typeorm';
import { Cart } from '../entity/Cart';
import { Customer } from '../entity/Customer';
import { Product } from '../entity/Product';
import { ShoppingItems } from '../entity/ShoppingItem';


// POST new product to customer's cart
export const addtocart = async (req: any, res: Response) => {
    const customer_id = req.body.customer_id;
    const product_id = req.body.product_id;
    const date = req.body.date;
    const qty : number = req.body.qty;

    try {
        // check if user has a cart
        const customer = await getRepository(Customer)
            .createQueryBuilder("customer")
            .where("customer.id = :id", { id: customer_id })
            .getOne()

        // get the seleccted product by id
        const product = await getRepository(Product)
            .createQueryBuilder("product")
            .where("product.id = :id", { id: product_id })
            .getOne();


        if (!customer.cartId) {
            // create a new cart
            const cart = getRepository(Cart).create({ customer: customer });
            await getRepository(Cart).save(cart);

            //assign it to customer
            customer.cart = cart;

            // make a shoppingitems 
            const shoppingitem = getRepository(ShoppingItems).create();
            await getRepository(ShoppingItems).save(shoppingitem);

            shoppingitem.cart = cart;
            shoppingitem.product = product;
            shoppingitem.qty = qty;
            shoppingitem.duedate = date;

            await getRepository(ShoppingItems).save(shoppingitem);

            await getRepository(Customer).save(customer);

            return res.json(cart);
        }

        else {
            const cart = await getRepository(Cart).findOne(customer.cartId, { relations: ["customer"] });

            const itemPresent = await getRepository(ShoppingItems)
                .createQueryBuilder("item") // fix get cart id == cart id AND product id == product id
                .where("item.cartId = :id", { id: customer.cartId })
                .andWhere("item.productId = :product", { product: product_id })
                .getOne();

            if (itemPresent) {
                const qtypresent: number = itemPresent.qty;
                console.log(qtypresent);
                const newQty = qtypresent + qty;
                
                itemPresent.qty = newQty;

                await getRepository(ShoppingItems).save(itemPresent);

                return res.json("saved");
            }

            else {
                const shoppingitem = getRepository(ShoppingItems).create();
                await getRepository(ShoppingItems).save(shoppingitem);

                shoppingitem.cart = cart;
                shoppingitem.product = product;
                shoppingitem.duedate = date;
                shoppingitem.qty = qty;

                await getRepository(ShoppingItems).save(shoppingitem);
            }

            await getRepository(Customer).save(customer);

            return res.json(cart);
        }

    } catch (error) {
        console.log(error)
    }

}


// GET user id and get cart
export const getCart = async (req: any, res: Response) => {
    const customer_id = req.query.customer_id;

    // get his cart
    try {
        const customer = await getRepository(Customer)
            .createQueryBuilder("customer")
            .where("customer.id = :id", { id: customer_id })
            .getOne();

        if (!customer.cartId) return res.json({});

        const cart = await getRepository(Customer)
            .createQueryBuilder("customer")
            .where("customer.cartId = :id", { id: customer.cartId })
            .getOne();

        if (!cart) return res.json({});

        const shopping_items = await getRepository(ShoppingItems)
            .createQueryBuilder("items")
            .where("items.cartId = :id", { id: cart.cartId })
            .getMany();


        type displayProduct = {
            date: Date,
            qty: number,
            product: Product;
        }

        console.log(shopping_items);

        let items = [];

        for (const i in shopping_items) {

            const qty = shopping_items[i].qty;
            const date = shopping_items[i].duedate;
            const product = await getRepository(Product)
                .createQueryBuilder("product")
                .where("product.id = :id", { id: shopping_items[i].productId })
                .getOne();

            let p: displayProduct = {date, qty, product };

            items.push(p);
        }

        return res.json(items);

    } catch (error) {
        console.log(error)
    }

}

//DELETE from cart by product_id
export const delFromCart = async (req: any, res: Response) => {
    const customer_id = req.query.customer_id;
    const product_id = req.query.product_id;

    try {
        const cart = await getRepository(Cart)
            .createQueryBuilder("cart")
            .where("cart.customerId = :id", { id: customer_id })
            .getOne();

        const shopping_items = await getRepository(ShoppingItems)
            .createQueryBuilder("items")
            .where("items.cartId = :cart", {cart: cart.id})
            .andWhere("items.productId = :product", {product: product_id})
            .getOne();

        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(ShoppingItems)
            .where("id = :id", {id: shopping_items.id})
            .execute()
        
        return res.json("item deleted");


    } catch (error) {
        console.log(error)
    }
}


// TODO 
// unique value constraint error, for example if another customer adds the same product, the database is unable to save it as the productId already exists in the shopping_items table.
// FIX?