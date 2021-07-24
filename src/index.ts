import "reflect-metadata";
import {createConnection} from "typeorm";
import express from 'express';
import dotenv from 'dotenv';
import customerRoutes from './routes/customerRoutes';
import cartRoutes from './routes/cartRoutes';
import productRoutes from './routes/productRoutes';

//config .env vars
dotenv.config();

// init express app
const app = express();

//set view engine
app.use(express.static('src/public'));
app.set('view engine', 'ejs');
app.set('views', 'src/views')

//express middleware requried;
app.use(express.json());
app.use(express.urlencoded({extended: true}))

//using routes
app.use(productRoutes);
app.use(customerRoutes);
app.use(cartRoutes);

//creating connection to db using the ormconfig.json and starting the server
createConnection().then(async connection => {
    app.listen(process.env.PORT, () => {
        console.log(`db connected and server listening on port ${process.env.PORT}`)
    })
}).catch(error => console.log(error));
