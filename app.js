import express from 'express';
import productsRouter  from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import {__dirname} from './path.js'
import handlebars from 'express-handlebars';
import { Server } from "socket.io";
import viewsRouter from './routes/views.routes.js' 

import ProductManager from './managers/productManager.js';

const pManager = new ProductManager(`${__dirname}/db/products.json`)
const app = express();

//midlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static(`${__dirname}/public`));

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', `${__dirname}/views`);
app.set('view engine', 'handlebars');

app.use('/', viewsRouter);

//puntos de entrada para ROUTES
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)

const PORT = 8080;

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const socketServer = new Server(httpServer);

socketServer.on('connection', async (socket) => {
    console.log(`New client connected - client ID: ${socket.id}`);
    
    socket.emit('products', await pManager.getProducts());
    console.log("Products sent to client");

    socket.on('disconnect', () => console.log(`Client disconnected`));

    socket.on('newProduct', async (newProduct) => {

        pManager.addProduct(newProduct);
        const products = await pManager.getProducts();
        socketServer.emit('products', products);
    });

    socket.on('deleteProduct', async (id) => {
        await pManager.deleteProduct(id);
        console.log("Product deleted");
        const products = await pManager.getProducts();
        socketServer.emit('products', products);
    });


})
