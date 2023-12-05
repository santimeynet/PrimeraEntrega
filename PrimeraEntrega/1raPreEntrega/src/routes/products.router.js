import { Router } from "express";
import { ProductManager } from "../index.js";

const productsRouter = Router();

productsRouter.get('/', async (req, res) =>{
    try{
        const { limit } = req.query;
        const products = await ProductManager.getProducts();

        if(limit){
            const limitedProducts = products.slice(0, limit)
            return res.json(limitedProducts)
        }

        return res.json(products)

    }catch (error) {
        console.log(error);
        res.send('Error al recibir los productos.')
    }
})

productsRouter.get('/:pid', async (req, res) =>{
    const {pid} = req.params;
    try {
        const products = await ProductManager.getProductById(pid);
        res.json(products)
    } catch (error) {
        console.log(error);
        res.send(`Error al recibir el producto con ID: ${pid}`)
    }
})

productsRouter.post('/', async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;
        const response = await ProductManager.addProduct({ title, description, price, thumbnail, code, stock, status, category });
        res.json(response);
    } catch (error) {
        console.log('Error al intentar agregar el producto', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});


productsRouter.put('/:pid', async (req, res)=>{
    const {pid} = req.params;
    try{
        const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;
        const response = await ProductManager.updateProduct(pid, { title, description, price, thumbnail, code, stock, status, category });
        res.json(response)
    }catch(error){
        console.log('Error al intentear agregar el producto')
    }
})

productsRouter.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        await ProductManager.deleteProduct(pid);
        res.send('Producto eliminado con éxito');
    } catch (error) {
        console.log('Error al intentar eliminar el producto', error);
        res.status(500).send('Error al intentar eliminar el producto');
    }
});

export {productsRouter};