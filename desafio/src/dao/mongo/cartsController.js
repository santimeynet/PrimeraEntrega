const Cart = require('../db/models/carts.model');
const Product = require('../db/models/products.model');
const Ticket = require('../db/models/Ticket');

module.exports = {
    createCart: async (req, res) => {
        try {
            const newCart = new Cart({ products: [] });
            await newCart.save();
            res.status(201).json({ _id: newCart._id });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    getCartProducts: async (req, res) => {
        try {
            const cart = await Cart.findById(req.params.cid).populate('products.product');
            if (!cart) return res.status(404).send('Carrito no encontrado');
            res.json(cart.products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    removeProductFromCart: async (req, res) => {
        try {
            const cart = await Cart.findById(req.params.cid);
            if (!cart) return res.status(404).send('Carrito no encontrado');

            const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
            if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                await cart.save();
                res.send('Producto eliminado del carrito');
            } else {
                res.status(404).send('Producto no encontrado en el carrito');
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    checkoutCart: async (req, res) => {
        try {
            const cart = await Cart.findById(req.params.cid).populate('products.product');
            if (!cart) return res.status(404).send('Carrito no encontrado');

            let totalAmount = 0;
            const productsToUpdate = [];
            const productsNotAvailable = [];

            cart.products.forEach(item => {
                const product = item.product;
                if (product.stock < item.quantity) {
                    productsNotAvailable.push({ productId: product._id, title: product.title });
                } else {
                    totalAmount += product.price * item.quantity;
                    productsToUpdate.push({ product, quantity: item.quantity });
                }
            });

            if (productsNotAvailable.length === 0) {
                await Promise.all(productsToUpdate.map(({ product, quantity }) =>
                    Product.findByIdAndUpdate(product._id, { $inc: { stock: -quantity } })
                ));

                const purchaserEmail = req.user.email;

                const ticket = new Ticket({
                    purchaser: purchaserEmail,
                    amount: totalAmount,
                });
                await ticket.save();

                cart.products = [];
                await cart.save();

                res.json({ message: 'Compra realizada con éxito', ticketId: ticket._id, cartCleared: true });
            } else {

                res.status(400).json({ message: 'Algunos productos no están disponibles', productsNotAvailable });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },



    updateProductQuantityInCart: async (req, res) => {
        console.log(req.params.cid, req.params.pid, req.body.quantityChange);

        try {
            const cart = await Cart.findById(req.params.cid);
            if (!cart) return res.status(404).send('Carrito no encontrado');

            const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
            if (productIndex === -1) {
                return res.status(404).send('Producto no encontrado en el carrito');
            }

            const quantityChange = req.body.quantityChange;
            cart.products[productIndex].quantity += quantityChange;

            if (cart.products[productIndex].quantity <= 0) {
                cart.products.splice(productIndex, 1);
            }

            await cart.save();
            res.send('Cantidad actualizada');
        } catch (error) {
            console.error('Error en updateProductQuantityInCart:', error);
            res.status(500).json({ error: error.message });
        }
    },


    emptyCart: async (req, res) => {
        try {
            const cart = await Cart.findById(req.params.cid);
            if (!cart) return res.status(404).send('Carrito no encontrado');

            cart.products = [];
            await cart.save();
            res.send('Carrito vaciado con éxito');
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    incrementProductQuantityInCart: async (req, res) => {
        try {
            const cart = await Cart.findById(req.params.cid);
            if (!cart) return res.status(404).send('Carrito no encontrado');

            const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
            if (productIndex === -1) {
                return res.status(404).send('Producto no encontrado en el carrito');
            }

            cart.products[productIndex].quantity += 1;
            await cart.save();
            res.json({ quantity: cart.products[productIndex].quantity });
        } catch (error) {
            console.error('Error en incrementProductQuantityInCart:', error);
            res.status(500).json({ error: error.message });
        }
    },


    decrementProductQuantityInCart: async (req, res) => {
        try {
            const cart = await Cart.findById(req.params.cid);
            if (!cart) return res.status(404).send('Carrito no encontrado');

            const productIndex = cart.products.findIndex(p => p.product.toString() === req.params.pid);
            if (productIndex === -1) {
                return res.status(404).send('Producto no encontrado en el carrito');
            }

            cart.products[productIndex].quantity -= 1;

            if (cart.products[productIndex].quantity <= 0) {
                cart.products.splice(productIndex, 1);
                await cart.save();
                res.send('Producto eliminado del carrito');
            } else {
                await cart.save();
                res.json({ quantity: cart.products[productIndex].quantity });
            }
        } catch (error) {
            console.error('Error en decrementProductQuantityInCart:', error);
            res.status(500).json({ error: error.message });
        }
    },


    addProductToCart: async (req, res) => {
        const { productId } = req.body;
        const cartId = req.params.cid;

        try {
            const cart = await Cart.findById(cartId);
            if (!cart) return res.status(404).send('Carrito no encontrado');

            const product = await Product.findById(productId);
            if (!product) return res.status(404).send('Producto no encontrado');


            if (product.stock <= 0 || !product.status) {
                return res.status(400).send('Producto no disponible');
            }

            const productIndex = cart.products.findIndex(p => p.product.toString() === productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity += 1;
            } else {
                cart.products.push({ product: productId, quantity: 1 });
            }

            await cart.save();
            res.json(cart);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

};