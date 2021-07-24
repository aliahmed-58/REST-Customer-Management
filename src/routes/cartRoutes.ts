import { Router } from "express";
import { addtocart, delFromCart, getCart } from "../controllers/cartController";
const router = Router();

router.post('/addtocart', addtocart);

router.get('/cart', getCart);

router.delete('/delItem', delFromCart);

export default router;