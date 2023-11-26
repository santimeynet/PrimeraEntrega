import express from 'express';
import { ProductManager } from './ProductManager.js';
import { cartManager } from './routes/cartManager.js';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';

const PORT = 8080;

const app = express();
const productManagerInstance = new ProductManager();  
const cartManagerInstance = new cartManager();

app.use(express.json());
app.use('/products', productsRouter);
app.use('/carts', cartsRouter)

app.listen(PORT, (req, res) => {
    console.log(`Servidor funcionando en el puerto ${PORT}`);
});

export { productManagerInstance as ProductManager };
export { cartManagerInstance as cartManager };
