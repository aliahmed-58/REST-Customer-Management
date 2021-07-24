import Joi from 'joi';
import { CustomerInfo } from '../controllers/customerController';
import { ProductInfo } from '../controllers/productController';


const CustomerSchem = Joi.object({
    name: Joi.string()
        .required(),
    
    cellphone: Joi.string()
        .min(11)
        .max(11)
        .required()
        .messages({message: "invalid cellphone entered"})
})

const ProductSchema = Joi.object({
    title: Joi.string()
        .min(3)
        .required(),

    price: Joi.number()
        .min(1)
        .required()
})

export const validateUser = async (user: CustomerInfo) => {
    const result = await CustomerSchem.validateAsync(user);
    return result;
}

export const validateProduct = async (product: ProductInfo)  => {
    return await ProductSchema.validateAsync(product);   
}