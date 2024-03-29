/* import { promises as fs } from "fs";
import path from "path";
import __dirname from "../../utils.js";


class ProductManager {
    constructor(pathfile) {
        this.path = path.join(__dirname, `/files/${pathfile}`);
    }

    initializeId = async() => {
        try {
            let products = await this.readProducts();
            this.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
        } catch (error) {
            console.error("Error initializing ID:", error.message);
            this.id = 1; 
        }
    }

    

    addProduct = async (title, description, price, thumbnails, code, stock) => {
        try {
            if (typeof this.id === 'undefined') {
                await this.initializeId();
            }
    
            let products = await this.readProducts();
    
            let newProduct = {
                title,
                description,
                price,
                thumbnails,
                code,
                stock,
                id: this.id
            };
    
            products.push(newProduct);
    
            await fs.writeFile(this.path, JSON.stringify(products));
    
            return "Producto Agregado ";
        } catch (error) {
            console.error("Error adding product:", error.message);
            return "Error al agregar producto";
        }
    }



    readProducts = async () => {
        try {
            const productsContent = await fs.readFile(this.path, "utf-8");
            const products = JSON.parse(productsContent);

            return Array.isArray(products) ? products : [];
            
        } catch (error) {
            console.error("Error reading file:", error.message);
            return [];
        }
    }

    getProducts = async () => {
       return await this.readProducts();
    }

    exist(id, productList) {
        return productList.find((producto) => producto.id === id)
    }

    getProductsByID = async (id) => {
        try {
            let products = await this.readProducts();
            let product = this.exist(id, products);
            if (!product) {
                throw new Error("Producto no encontrado");
            }
            return product;
        } catch (error) {
            console.error('Error al obtener producto por ID:', error.message);
            throw new Error("Error al obtener producto por ID");
        }
    
    }

    deleteProductByID = async (id) => {
        try {
            let products = await this.readProducts();
            
            
            const existingProduct = this.exist(id, products);
            if (!existingProduct) {
                throw new Error("Producto no encontrado");
            }

            
            const productFilter = products.filter((p) => p.id !== id);
            await fs.writeFile(this.path, JSON.stringify(productFilter));

            console.log("Producto eliminado correctamente");
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
            throw new Error("Error al eliminar producto");
        }
    }

    upgradeProduct = async ({ id, ...product }) => {
        try {
            let products = await this.readProducts();
            
           
            const existingProduct = this.exist(id, products);
            if (!existingProduct) {
                throw new Error("Producto no encontrado");
            }

           
            const productFilter = products.filter((p) => p.id !== id);
            await fs.writeFile(this.path, JSON.stringify(productFilter));

           
            const productMod = [{ ...product, id }, ...productFilter];
            await fs.writeFile(this.path, JSON.stringify(productMod));

            return productMod;
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
            throw new Error("Error al actualizar producto");
        }
    }
} */



import mongoose from 'mongoose';
 
import { Product } from '../db/models/products.model.js';


class ProductManager {
    constructor() {
        
    }

    async addProduct(producto) {
        try {
            const newProduct = new Product(producto);
            await newProduct.save();
            console.log('Producto agregado exitosamente.');
            return newProduct;
        } catch (error) {
            console.error('Error al agregar el producto:', error);
            return null;
        }
    }

    async updateProduct(_id, updatedProduct) {
        try {
            const product = await Product.findByIdAndUpdate(_id, updatedProduct, { new: true });
            if (!product) {
                console.log('El producto no existe.');
                return null;
            }
            console.log('Producto actualizado exitosamente.');
            return product;
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
            return null;
        }
    }

    async deleteProduct(_id) {
        try {
            const product = await Product.findByIdAndDelete(_id);
          
            if (!product) {
                console.log('El producto no existe.');
                return null;
            }
            console.log('Producto eliminado exitosamente.');
            
            return product;
            
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            return null;
        }
    }

    async getProducts() {
        try {
            const products = await Product.find();
            return products;
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            return [];
        }
    }

    async getProductBy_id(_id) {
        try {
            const product = await Product.findById(_id);
            return product || null;
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            return null;
        }
    }
}

export default ProductManager;