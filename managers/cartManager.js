import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";
import ProductManager from "./productManager.js";
import { __dirname } from "../path.js";

const pManager = new ProductManager;

class CartManager {
    constructor(path){
        this.carts = [],
        this.path = path
        this.loadCarts();
    }
    async loadCarts() {
        try {
        this.carts = await this.readCarts();
        } catch (error) {
        console.error("Error al cargar productos:", error);
        this.carts = [];
        }
    }

    writeCarts = async (path, data) => {
        await fs.writeFile(path, JSON.stringify(data));
    };
    readCarts = async () => {
        try {
            let response = await fs.readFile(this.path, "utf-8");
            return response ? JSON.parse(response) : []; 
        } catch (error) {
            console.error("Error al leer carritos:", error);
            return [];
        }
    };

    addCart =  async ()=>{
        const newCartId = uuidv4();
        let newCart = {
            id: newCartId,
            products: []
        }
        this.carts.push(newCart)
        await this.writeCarts(this.path, this.carts)
    }

    addProductToCart = async(cartId, productId)=>{
    const dataCarts = await this.readCarts()
    const cart = dataCarts.find(cart => cart.id === cartId)
        if (!cart){
            throw new Error(`el carrito con el id: ${cartId} no existe`)
    }
    const productData = await fs.readFile(pManager.path, 'utf-8')
    const products = JSON.parse(productData);
    const product = products.find(prod => prod.id == productId)
    if (!product){
        throw new Error(`El producto con el id: ${productId} no existe`)
    }
    cart.products.push({id:productId, quantity: 1});
    await this.writeCarts(this.path, dataCarts);
    }

    getCarts = async ()=>{
        let carts = await this.readCarts();
        return carts;
    }

    getCartsById = async (id)=>{
        try {
            let carts = await this.readCarts();
            let cartFilter = carts.find(cart => cart.id === id )
            if (cartFilter !== undefined){
                return cartFilter
            }else {
                throw new Error("No existe un carrito con el ID proporcionado");
            }
        } catch (error) {
            console.error("Error al obtener productos por ID:", error);
            throw error;
        }
    }
}

export default CartManager;