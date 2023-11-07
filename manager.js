class ProductManager {
    constructor() {
        this.products = [];
        this.productIdCounter = 1;
    }

    addProduct(title, description, price, thumbnail, code, stock) {
        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos son obligatorios.");
        }

        if (this.products.some(product => product.code === code)) {
            throw new Error("Error: El código del producto ya existe.");
        }

        const product = {
            id: this.productIdCounter++,
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        this.products.push(product);
        console.log(`Producto "${title}" agregado correctamente.`);
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        const product = this.products.find(product => product.id === id);
        if (product) {
            return product;
        } else {
            throw new Error("Error: Producto no encontrado.");
        }
    }
}

const productManager = new ProductManager();

console.log(productManager.getProducts());

try {
    productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
} catch (error) {
    console.log(error.message);
}


console.log(productManager.getProducts());

try {
    productManager.addProduct("producto prueba", "Este es un producto prueba", 200, "Sin imagen", "abc123", 25);
} catch (error) {
    console.log(error.message);
}

try {
    console.log(productManager.getProductById(3));
} catch (error) {
    console.log(error.message);
}
