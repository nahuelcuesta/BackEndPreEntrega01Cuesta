import express from 'express';
import productsRouter  from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';

const app = express();

//midlewares
app.use(express.json())
app.use(express.urlencoded({extended:true}))

const PORT = 8080;

//puntos de entrada para ROUTES
app.use('/api/carts', cartsRouter)
app.use('/api/products', productsRouter)


app.listen(PORT, (req,res)=>{
    console.log(`servidor escuchando en el puerto ${PORT}`);
})