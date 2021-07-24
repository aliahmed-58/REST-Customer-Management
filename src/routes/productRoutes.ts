import {Router} from 'express';
import { addProduct, delProduct, getProductById, getProducts, searchProducts } from '../controllers/productController';
const router = Router();

// get products
router.get('/products', getProducts);

//
router.get('/newProduct', (req, res) => res.render('newProduct'));

//add new product
router.post('/newProduct', addProduct);

// get product by id
router.get('/singleProduct', getProductById);

// del product by id
router.delete('/delProduct', delProduct);

//search products
router.post('/searchProduct', searchProducts);



export default router;