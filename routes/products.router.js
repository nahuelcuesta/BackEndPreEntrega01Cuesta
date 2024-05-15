import { Router } from "express";
import ProductManager from "../managers/productManager.js";
import { __dirname } from "../path.js"

const pManager = new ProductManager((`${__dirname}/db/products.json`));

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
        res
            .status(200)
            .json({ message: "Productos obtenidos con exito", data: products });
        }
    } catch (error) {
        console.log(error);
        res
        .status(500)
        .json({ message: `error al intentar recibir los productos` });
    }
    });

    router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
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

    router.post("/", async (req, res) => {
    try {
        const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status = true,
        category,
        } = req.body;
        const response = await pManager.addProduct(
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
        );
        res
        .status(201)
        .json({ message: "Producto agregado exitosamente", data: response });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error al intentar agregar el producto" });
    }
    });

    router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status = true,
        category,
        } = req.body;
        const response = await pManager.updateProduct(pid, {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
        });
        res
        .status(201)
        .json({ message: "producto actualizado con exito", data: response });
    } catch (error) {
        console.log(error);
        res
        .status(500)
        .json({ error: `error al intentar editar producto con id: ${pid}` });
    }
    });

    router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
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
