import { promises as fs } from "fs";
import { v4 as uuidv4 } from "uuid";

class ProductManager {
    constructor(path) {
        this.path = path;
        this.products = [];
        this.loadProducts();
    }

    async loadProducts() {
        try {
        this.products = await this.readProducts();
        } catch (error) {
        console.error("Error al cargar productos:", error);
        this.products = [];
        }
    }

    addProduct = async (
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category
    ) => {
        try {
        const newProductId = uuidv4();
        let newProduct = {
            id: newProductId,
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            status,
            category,
        };
        this.products.push(newProduct);
        await this.writeProducts(this.path, this.products);
        return newProduct;
        } catch (error) {
        console.error("Error al agregar producto:", error);
        throw error;
        }
    };

    writeProducts = async (path, data) => {
        await fs.writeFile(path, JSON.stringify(data));
    };

    readProducts = async () => {
        try {
            let response = await fs.readFile(this.path, "utf-8");
            return response ? JSON.parse(response) : [];
        } catch (error) {
            console.error("Error al leer productos:", error);
            return [];
        }
    };
    getProducts = async (limit) => {
        try {
        let products = await this.readProducts();
        if (limit) {
            products = products.slice(0, limit);
        }
        return products;
        } catch (error) {
        console.error("Error al obtener productos:", error);
        return [];
        }
    };

    getProductsById = async (id) => {
        try {
        let products = await this.getProducts();
        let prodFilter = products.find(product => product.id == id);
        if (prodFilter !== undefined) {
            return prodFilter;
        } else {
            throw new Error("No existe un producto con el ID proporcionado");
        }
        } catch (error) {
        console.error("Error al obtener productos por ID:", error);
        throw error;
        }
    };

    updateProduct = async (id, dataObjectUpdate) => {
        let products = await this.getProducts();
        let productToUpdate = products.find(product => product.id == id);
        try {
        if (productToUpdate) {
            if (id in dataObjectUpdate) {
            console.log("No se permite actualizar el campo id "); 
            } else {
            Object.assign(productToUpdate, dataObjectUpdate);
            await this.writeProducts(this.path, products);
            console.log(`Producto con id "${id}" actualizado correctamente.`);
            }

        } else {
            console.log(
            `No existe un producto con el ID "${id}". No se realizó ninguna operación de actualización.`
            );
        }
        } catch (error) {
        console.log(error);
        }
    };

    deleteProduct = async (id) => {
        try {
        let response = await this.getProducts();
        let productExists = response.some((product) => product.id == id);
        if (productExists) {
            let productFilter = response.filter(product => product.id != id);
            console.log(productFilter);
            await this.writeProducts(this.path, productFilter);
            console.log(`Producto con id "${id}" borrado correctamente.`);
        } else {
            console.log(
            `No existe un producto con el ID "${id}". No se realizó ninguna operación.`
            );
        }
        } catch (error) {
        console.error("Error al eliminar el producto:", error);
        }
    };

}

export default ProductManager;
