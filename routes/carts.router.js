import { Router } from "express";
import CartManager from "../managers/cartManager.js";
import { __dirname } from "../path.js";

const cManager = new CartManager(`${__dirname}/db/carts.json`);

const router = Router();

router.post('/', async (req, res)=>{
    try {
            const response = await cManager.addCart();
            res.status(200).json({message: 'nuevo carrito creado exitosamente', data: response})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:'error al agragar productos al carrito'})
        }
    })

router.get('/:cid', async (req, res) =>{
    const cartId = req.params.cid;
    try {
        const carts = await cManager.getCartsById(cartId);
        console.log(carts);
        res.status(200).json({message:`carrito con id ${cartId} obtenido con exito`,data: carts })
    } catch (error) {
        console.log('error al obtener carrito por id', error);
        res.status(500).json({message:`no existe carrito con el id: ${cartId}`, error: error.message})
    }    
})

router.post('/:cid/products/:pid', async (req, res) =>{
    const cartId = req.params.cid;
    const prodId = req.params.pid;
    try {
        const AddProduct = await cManager.addProductToCart(cartId,prodId);
        console.log(AddProduct);
        res.status(200).json({message:`producto con id ${prodId} agregado exitosamente en el cattiro con ir: ${cartId}`, data: AddProduct })
    } catch (error) {
        console.log('error al agregar el producto', error);
        res.status(500).json({message:`error al agregar el producto`, error: error.message})
    }
    
    
})


router.get("/", async (req, res)=>{
try {
    const carts = await cManager.getCarts();
    if(carts.length === 0){
        res.status(200). json({message:'El carrito de compra aun no tiene productos agregados'})
    } else {
        res.status(200).json({message: 'Carrito obtenido con exito', data: carts})
    }
} catch (error) {
    console.log(error);
    res.status(500).json({message: 'Error al obtener la informacion', data: error})
}
})




export default router;