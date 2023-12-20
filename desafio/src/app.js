import express from 'express';
import __dirname from './utils.js';
import { ProductRouter } from './routes/products.router.js';
import { CartRouter } from './routes/carts.router.js';
import { engine } from 'express-handlebars';
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io';
import ProductManager from './dao/managersFS/ProductManager.js';
import mongoose from 'mongoose';
import {dbProductRouter} from './routes/db.products.router.js';
import { dbCartRouter } from './routes/db.carts.router.js';
import chatRouter from './routes/db.chat.router.js';
import Message from './dao/db/models/message.model.js';


const PORT = 8080;

const app = express();
const MONGO = "mongodb+srv://santimeynet:mmyynntt@ecommerce.sgmhbgf.mongodb.net/ecommerce";
const connection = mongoose.connect(MONGO);


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const httpServer = app.listen(PORT, () => {
    console.log(`express localhost: ${PORT}`)
});

const socketServer = new Server(httpServer);




app.engine("handlebars",engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use("/", express.static(__dirname + "/public"));

app.use("/realtimeproducts", viewsRouter)
app.use("/api/products", ProductRouter);
app.use("/api/carts", CartRouter);
//MONGO
app.use("/db/products",dbProductRouter)
app.use("/db/carts",dbCartRouter)
app.use('/chat', chatRouter);

socketServer.on("connection", (socket) => {
    console.log("Nuevo cliente conectado con ID:",socket.id);
    socket.on('chatMessage', async (data) => {
        try {
          await Message.create(data);
          socket.emit('chatMessage', data);
        } catch (error) {
          console.error('Error al guardar el mensaje en la base de datos:', error.message);
        }
      });

    socket.on('addProduct', async (productData) => {
        try {
            console.log('Datos del producto recibidos en el servidor:', productData);

            const productManager = new ProductManager('products.json');
            await productManager.initializeId();
            await productManager.addProduct(productData.title, productData.description, productData.price, productData.thumbnails, productData.code, productData.stock);


            socketServer.emit('newProduct', productData);
        } catch (error) {
            console.error('Error al agregar producto:', error.message);
        }
    });
});