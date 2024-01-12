import { Cart } from "../models/carts.model.js"
import { Product } from "../models/products.model.js";
class CartManagerDB {
    getCarts = async () => {
        const carts = await Cart.find().populate("products.product");
        return carts;
    };

    getCartById = async (cid) => {
        const cart = await Cart.find({ _id: cid });
        return cart;
    };

    createCart = async () => {
        const cart = await Cart.create({});
        return cart;
    };

    addProdInCart = async (cid, pid, quantity = 1) => {
        const carrito = await Cart.findOne({ _id: cid });
        if (!carrito) {
            return {
                status: error,
                msg: `El carrito con el id ${cid} no existe`,
        };
    }

    const product = await Product.findOne({ _id: pid });
    if (!product) {
        return {
            status: error,
            msg: `El carrito con el id ${pid} no existe`,
        };
    }
    let productsInCart = carrito.product;

    const indexProduct = productsInCart.findIndex(
        (product) => product.product == pid
    );

    if (indexProduct == -1) {
        const newProd = {
            product: pid,
            quantity: quantity,
        };
        carrito.product.push(newProd);
    } else {
        carrito.product.push[indexProduct].quantity += quantity;
    }

    await carrito.save();
    return carrito;
    };

    removeProductFromCart = async (cid, pid) => {
    const cart = await cartsModel.findOne({ _id: cid });

    if (!cart) {
        return {
            status: "error",
            msg: `El carrito con el ID ${cid} no existe`,
        };
    }

    const index = cart.products.findIndex((product) => product.product == pid);

    if (index !== -1) {
        cart.products.splice(index, 1);
        await cart.save();
    }
    return cart;
    };

    updateProductQuantity = async (cid, pid, quantity) => {
        const cart = await cartsModel.findOne({  _id: cid  })

        if (!cart) {
            return {
                status: "error",
                msg: `El carrito con el ID ${cid} no existe.`
            }
        }

        const product = await productsModel.findOne({ _id: pid })

        if (!product) {
            return {
                status: "error",
                msg: `El producto con el ID ${pid} no existe.`
            }
        }

        const index = cart.products.findIndex((product) => product.product == pid)

        if (index !== -1) {
            cart.products[index].quantity = quantity
            await cart.save()
        }

        return cart;
    }

    updateCart = async (cid, products) => {
        const cart = await cartsModel.findOne({_id:cid })

        if (!cart) {
            return {
                status: "error",
                msg: `El carrito con el ID ${cid} no existe`
            }
        }

        cart.products = products
        await cart.save()

        return cart
    }

    deleteCart = async (cid) => {
        const cart = await cartsModel.findOne({ _id: cid })

        if (!cart) {
            return {
                status: "error",
                msg:`El carrito con el ID ${cid} no existe`
            }
        }

        cart.products = [];
        await cart.save();

        return {
            status: "success",
            msg:`Productos del carrito con ID ${cid} eliminados con éxito`
        }
    }
}

export default CartManagerDB;