import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import { __dirname } from "../path.js";
import { validationProd } from "../middlewares/validationProd.js";
import { validationId } from "../middlewares/validationId.js";

const pManager = new ProductManager(`${__dirname}/db/products.json`);

console.log(pManager.products);

const router = Router();

    router.get("/", async (req, res) => {
    try {
        const { limit } = req.query;
        const products = await pManager.getProducts(limit);
        if (products.length === 0) {
        res
            .status(200)
            .json({
            message: "Aun no hay productos agregados en la lista",
            data: [],
            });
        } else {
        res.status(200).json({ message: "Productos obtenidos con exito", data: products });
        }
    } catch (error) {
        res
        .status(500)
        .json({ message: `error al intentar recibir los productos` });
    }
    });

    router.get("/:pid", async (req, res) => {
    
    try {
        const { pid } = req.params;
        const product = await pManager.getProductsById(pid);
        res.json(product);
        res
        .status(200)
        .json({
            message: `producto con el id: ${pid} recibido con exito`,
            data: product,
        });
    } catch (error) {
        console.log(error);
        res
        .status(500)
        .json({ message: `error al intentar recibir el producto con id ${pid}` });
    }
    });

    router.post("/", validationProd, async (req, res) => {
        try {
            const productObj = req.body;
            const newProduct = await pManager.addProduct(productObj);
            res.status(201).json(newProduct);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.put("/:pid", validationId, async (req, res) => {
        try {
            const { productId } = req.params;
            const productObj = req.body;
            const productUpdated = await pManager.updateProduct(productId, productObj);
            !productUpdated ? res.status(404).json({ error: "Product not found" }) : res.status(200).json(productUpdated);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    });

    router.delete("/:pid", async (req, res) => {
    
    try {
        const { pid } = req.params;
        await pManager.deleteProduct(pid);
        res
        .status(200)
        .json({ message: `producto con id: ${pid} eliminado con exito` });
    } catch (error) {
        console.log(error);
        res.send(`error al intentar eliminar producto con id: ${pid}`);
    }
    });

export default router;
