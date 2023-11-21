import express from "express";
import bodyParser from "body-parser";
import fs from 'fs';
import ProductManager from './ProductManager.js';

const app = express();
const PORT = 8080;
const FILE_PATH = 'productos.json';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productManager = new ProductManager(FILE_PATH);

app.get('/products', async (req, res) => {
  try {
    const limit = req.query.limit;
    const productos = await productManager.getProducts();

    if (limit) {
      const limitedProducts = productos.slice(0, parseInt(limit));
      res.json(limitedProducts);
    } else {
      res.json(productos);
    }
  } catch (error) {
    console.error('Error al leer el archivo de productos:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});


  
  

app.get('/products/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const producto = await productManager.getProductById(parseInt(productId));

    if (producto) {
      res.json(producto);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  } catch (error) {
    console.error('Error al leer el archivo de productos:', error);
    res.status(500).json({ error: 'Error interno del servidor', details: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
