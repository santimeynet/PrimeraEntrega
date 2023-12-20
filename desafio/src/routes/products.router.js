import { Router } from "express";
import ProductManager from "../dao/managersFS/ProductManager.js";

const router = Router();
const path = "products.json"
const manager = new ProductManager(path);
const readProducts = manager.readProducts();



router.get("/", async (req, res) => {
  let limit = parseInt(req.query.limit);
  if (!limit) return res.send(await readProducts);
  let allProducts = await readProducts;
  let productLimit = allProducts.slice(0, limit);

  res.send(productLimit);
})


router.post('/', async (req, res) => {
  try {
    const { title, description, price, code, stock,  thumbnails } = req.body;

    await manager.addProduct(title, description, price, code, stock, thumbnails);

    res.send({
      status: "Success",
      msg: `Producto Agregado correctamente`
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    res.status(400).json({ error: error.message });
  }
});


router.get("/:pid", async (req, res) => {
  try {
    let pid = parseInt(req.params.pid);
    let allProducts = await readProducts;
    let productById = allProducts.find(product => product.id === pid);

    if (!productById) {
        throw new Error("Producto no encontrado");
    }

    res.status(200).json({
        status: "Success",
        productById
    });
} catch (error) {
    console.error('Error al procesar la solicitud:', error.message);
    res.status(404).json({
        status: "Error",
        msg: error.message
    });
}});





router.put("/:pid", async (req, res) => {
  try {
      const pid = parseInt(req.params.pid);
      const { title, description, price, code, stock, thumbnails } = req.body;

      
      const existingProduct = await manager.getProductsByID(pid);

      if (!existingProduct) {
          throw new Error("Producto no encontrado");
      }

      
      const updatedProduct = await manager.upgradeProduct({
          id: pid,
          title,
          description,
          price,
          code,
          stock,
          thumbnails,
      });

      res.status(200).json({
          status: "Success",
          msg: `Producto actualizado correctamente`,
          updatedProduct,
      });
  } catch (error) {
      console.error('Error al procesar la solicitud:', error.message);
      res.status(error.message === "Producto no encontrado" ? 404 : 500).json({
          status: "Error",
          msg: error.message
      });
  }
});




router.delete("/:pid", async (req, res) => {
  try {
      const pid = parseInt(req.params.pid);

     
      const existingProduct = await manager.getProductsByID(pid);

      if (!existingProduct) {
          throw new Error("Producto no encontrado");
      }

      
      await manager.deleteProductByID(pid);

      res.status(200).json({
          status: "Success",
          msg: `Producto eliminado correctamente`,
      });
  } catch (error) {
      console.error('Error al procesar la solicitud:', error.message);
      res.status(error.message === "Producto no encontrado" ? 404 : 500).json({
          status: "Error",
          msg: error.message
      });
  }
});











export { router as ProductRouter }