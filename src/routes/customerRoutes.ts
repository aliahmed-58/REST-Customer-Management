import {Router} from 'express';
import { newUser, getCustomers, getCustomerById, deleteCustomer, newCustomerRender } from '../controllers/customerController';
const router = Router();


//
router.get('/newCustomer', newCustomerRender)
//add a new user
router.post('/newUser', newUser);

//get all customers
router.get('/customers', getCustomers)

//get customer by id
router.get('/singleCustomer', getCustomerById);

//delete customer by id
router.delete('/delCustomer', deleteCustomer);

export default router;