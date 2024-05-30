import fs from "fs";
import { v4 as uuidv4 } from "uuid";

class ProductManager {
    constructor(path) {
        this.path = path;
    }

    addProduct = async (obj) => {
        try {
            const newProduct = {
                id: uuidv4(),
                status: true,
                ...obj,
            };
            const products = await this.getProducts();
            products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, "\t"));
            console.log("producto agregado");
            return newProduct;
        } catch (error) {
            console.error(error);
        }
    }

    getProducts = async (limit) => {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, "utf8");
                return limit ? JSON.parse(products).slice(0, Math.max(0, limit)) : JSON.parse(products);
            } else return [];
        } catch (error) {
            console.error(error);
        }
    };

    getProductsById = async (id) => {
        try {
            const products = await this.getProducts();
            const productListed = products.find((product) => product.id === id);
            return productListed || null;
        } catch (error) {
            console.error(error);
        }
    };

    updateProduct = async (id, obj) => {
        try {
            const products = await this.getProducts();
            let productListed = products.find((product) => product.id === id);
            if (productListed) {
                productListed = { ...productListed, ...obj };
            } else return null;
            const productsUpdated = products.filter((product) => product.id !== id);
            productsUpdated.push(productListed);
            await fs.promises.writeFile(this.path, JSON.stringify(productsUpdated, null, "\t"));
            return productListed;
        } catch (error) {
            console.error(error);
        }

        deleteProduct = async (id) => {
            try {
                const products = await this.getProducts();
                const productListed = products.find((product) => product.id === id);
                if (!productListed) return null;
                const productsUpdated = products.filter((product) => product.id !== id);
                await fs.promises.writeFile(this.path, JSON.stringify(productsUpdated, null, "\t"));
                return productListed;
            } catch (error) {
                console.error(error);
            }
        }

    }
}

export default ProductManager;
