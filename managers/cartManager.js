import fs from 'fs';
import { v4 as uuidv4 } from "uuid";
import ProductManager from "./productManager.js";
import { __dirname } from "../path.js";

const pManager = new ProductManager(`${__dirname}/db/products.json`);

class CartManager {
    constructor(path) {
        this.path = path
    }

    addCart = async () => {
        try {
            const newCart = {
                id: uuidv4(),
                products: [],
            };
            const carts = await this.getCarts();
            carts.push(newCart);
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, '\t'));
            return newCart;
        } catch (error) {
            console.error(error);
        }
    }

    addProductToCart = async (cartId, productId) => {
        try {
            const product = await pManager.getProductsById(productId);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            let carts = await this.getCarts();
            const cart = carts.find((cart) => cart.id === cartId);
            if (!cart) {
                throw new Error("Carrito no encontrado");
            }

            const productInCart = cart.products.find((prod) => prod.id === productId);
            if (!productInCart) {
                const prodToAdd = {
                    id: productId,
                    quantity: 1,
                };
                cart.products.push(prodToAdd);
            } else {
                productInCart.quantity++;
            }

            const cartsUpdated = carts.map((cart) => cart.id === cartId ? cart : cart);
            await fs.promises.writeFile(this.path, JSON.stringify(cartsUpdated, null, '\t'));
            return cart;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    getCarts = async () => {
        try {
            if (fs.existsSync(this.path)) {
                const cartsFile = await fs.promises.readFile(this.path, 'utf-8');
                const carts = JSON.parse(cartsFile);
                return carts;
            } else return [];
        } catch (error) {
            console.error(error);
        }
    }

    getCartsById = async (id) => {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === id);
            return cart || null;
        } catch (error) {
            console.error(error);
        }
    }
}

export default CartManager;