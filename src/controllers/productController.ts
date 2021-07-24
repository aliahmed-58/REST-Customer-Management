import { Product } from "../entity/Product";
import { Response } from 'express';
import { validateProduct } from "../helper/validate";
import { getConnection, getRepository } from "typeorm";

export type ProductInfo = {
    title: string,
    price: number
}

// POST a new product
export const addProduct = async (req: any, res: Response) => {
    const product: ProductInfo = req.body;

    //validate user input
    try {
        await validateProduct({ title: product.title, price: product.price });
    } catch (error) {
        return res.json({error : error.details[0].message})
    }

    // add new product
    try {
        await getConnection()
            .createQueryBuilder()
            .insert()
            .into(Product)
            .values({
                title: product.title.toLowerCase(), price: product.price
            })
            .execute()

        return res.status(200).json({ success: true })

    } catch (error) {
        console.log(error)
    }

}

// GET all products
export const getProducts = async (req: any, res: Response) => {
    try {
        const allproducts = await getRepository(Product)
            .createQueryBuilder('product')
            .getMany()

        return res.render('products', {products: allproducts})
    } catch (error) {
        console.log(error)
    }
}

// GET product by id
export const getProductById = async (req: any, res: Response) => {
    const id = req.query.id

    try {
        const single_product = await getRepository(Product)
            .createQueryBuilder("products")
            .where("products.id = :id", {id: id})
            .getOne()

        return res.status(200).json(single_product);

    } catch (error) {
        console.log(error)
    }
}

// Delete product by id 
export const delProduct = async (req: any, res: Response) => {
    const id = req.query.id;;

    try {
        await getConnection()
            .createQueryBuilder()
            .delete()
            .from(Product)
            .where("id = :id" , {id: id})
            .execute();

            return res.status(200).json({success: true})
    } catch (error) {
        console.log(error)
    }
}   

// Search products
export const searchProducts = async (req: any, res: Response) => {
    const query = req.body.search;

    try {
        if (query.split(' ').join('').length === 0) {
            const products = await getRepository(Product)
            .createQueryBuilder()
            .getMany();

            return res.redirect('/customers')
        }

        const searchResult = await getRepository(Product)
            .createQueryBuilder('products')
            .where('products.title like :title', {title: `%${query}%`})
            .getMany();

        return res.json(searchResult);
    } catch (error) {
        console.log(error);
    }
}