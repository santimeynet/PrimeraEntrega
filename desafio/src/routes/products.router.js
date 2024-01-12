import { Router } from "express";
import ProductManager from "../dao/managersFS/ProductManager.js";



const manager = new ProductManager('products.json');
const router = Router();



router.get('/', (req, res) => {
    const { limit } = req.query;
    let productsToSend = manager.getProducts();
    
    if (limit) {
        const parsedLimit = parseInt(limit);
        if (!isNaN(parsedLimit)) {
            productsToSend = productsToSend.slice(0, parsedLimit);
        }
    }

    res.json(productsToSend);
});


router.get('/:pid', (req, res) => {
    const productpid = parseInt(req.params.pid);
    const product = manager.getProductBypid(productpid);

    if (product) {
        res.json(product);
    } else {
        res.status(404).json({ error: 'Producto no encontrado' });
    }
});


router.post('/', (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;

    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios excepto thumbnails' });
    }

    const newProduct = {
        title,
        description,
        code,
        price: Number(price),
        status: true,
        stock: Number(stock),
        category,
        thumbnails: thumbnails ? Array.isArray(thumbnails) ? thumbnails : [thumbnails] : [],
        pid: manager.getNextProductpid()
    };

    manager.addProduct(newProduct);

    res.status(201).json(newProduct);
});


router.put("/:pid", (req, res) => {

    const pid = parseInt(req.params.pid);


    const updatedProduct = req.body;


    const product = manager.updateProduct(pid, updatedProduct);
    if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
    }


    res.json(product);
});



router.delete("/:pid", (req, res) => {

    const pid = parseInt(req.params.pid);


    const product = manager.deleteProduct(pid);
    if (!product) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
    }


    res.json({ message: "Producto eliminado" });
});




export default router;