/* import { promises as fs } from "fs";
import path from "path";


class CartManager {
    constructor(pathfile) {
        this.path = path.join(__dirname, `/files/${pathfile}`);
    }

    getCarts = async () => {
        const response = await fs.readFile(this.path, 'utf-8');
        const responseJSON = JSON.parse(response)
        return responseJSON
    }

    getCartProducts = async (id) => {
        const carts = await this.getCarts()
        const cart = carts.find(cart => cart.id === id);
        if (cart) {
            return cart.products;
        } else {
            console.log("Carrito ID no encontrado")
        }
    }

    newCart = async () =>{
        try {
           
            const carts = await this.getCarts();

           
            const lastId = carts.length > 0 ? carts[carts.length - 1].id : 0;

            const newCart = {
                id: lastId + 1,
                products: []
            };

            carts.push(newCart);

            
            await fs.writeFile(this.path, JSON.stringify(carts));

            return newCart;
        } catch (error) {
            console.error('Error al crear un nuevo carrito:', error.message);
            throw new Error('Error al crear un nuevo carrito');
        }
    }
    addProductToCart = async (cart_id, product_id) => {
        try {
            const carts = await this.getCarts();
            const cartIndex = carts.findIndex(cart => cart.id === cart_id);

            if (cartIndex !== -1) {
                const cart = carts[cartIndex];
                const existingProduct = cart.products.find(product => product.product_id === product_id);

                if (existingProduct) {
                    existingProduct.quantity += 1;
                } else {
                    cart.products.push({ product_id, quantity: 1 });
                }

                await fs.writeFile(this.path, JSON.stringify(carts));
                console.log("Producto Agregado con Éxito");
            } else {
                console.log("Carrito No encontrado");
            }
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error.message);
            throw new Error('Error al agregar producto al carrito');
        }
    }
} */

import {Cart} from "../dao/models/cart.model.js"
import {Product} from "../dao/models/product.model.js"

class CartManager {


    
    async createCart(products) {
        try {
            const totalPrice = products.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
            const cart = new Cart({
                products: products.map(({ _id, quantity }) => ({ productId: _id, quantity })),
                totalPrice,
            });
            await cart.save();
            console.log('Nuevo carrito creado exitosamente.');
            return cart;
        } catch (error) {
            console.error('Error al crear el carrito:', error);
            return null;
        }
    }





}
export default CartManager;
