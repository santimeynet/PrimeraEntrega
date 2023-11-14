import fs from 'fs';

const path = './files/Productos.js';

export default class ProductManager {
    getProducts = async () => {
        if (fs.existsSync(path)) {
            const data = await fs.promises.readFile(path, 'utf-8');
            const productos = JSON.parse(data);
            return productos;
        } else {
            return [];
        }
    };

    getProductById = async (productId) => {
        const productos = await this.getProducts();
        const producto = productos.find((producto) => producto.id === productId);
        return producto || null;
    };

    updateProduct = async (id, updatedFields) => {
        try {
            const productos = await this.getProducts();
            const productoIndex = productos.findIndex((prod) => prod.id === id);

            if (productoIndex !== -1) {
                Object.assign(productos[productoIndex], updatedFields);
                await fs.promises.writeFile(path, JSON.stringify(productos, null, '\t'));
                return "Product Updated Successfully.";
            } else {
                return "Product not found";
            }
        } catch (err) {
            return err;
        }
    };

    deleteProduct = async (productId) => {
        try {
            const productos = await this.getProducts();
            const productoIndex = productos.findIndex((p) => p.id === productId);

            if (productoIndex !== -1) {
                productos.splice(productoIndex, 1);
                await fs.promises.writeFile(path, JSON.stringify(productos, null, '\t'));
                return "Product Deleted Successfully.";
            } else {
                return "Product not found";
            }
        } catch (err) {
            return err;
        }
    };

    addProduct = async (producto) => {
        const productos = await this.getProducts();
        if (productos.length === 0) {
            producto.id = 1;
        } else {
            producto.id = productos[productos.length - 1].id + 1;
        }
        productos.push(producto);
        await fs.promises.writeFile(path, JSON.stringify(productos, null, '\t'));
        return productos;
    };
}
