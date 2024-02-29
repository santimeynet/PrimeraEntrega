import express from 'express';
import productRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import MongoStore from "connect-mongo";
import session from "express-session";
import { errorHandler } from "./middleware/errorHandler.js";
import { usersRouter } from "./routes/user.route.js";
import { Server } from 'socket.io';
import handlebars from 'express-handlebars';
import passport from "passport";


import {__dirname} from './utils.js'
import viewsRouter from './routes/views.routes.js';
import ProductManager from './dao/managersFS/ProductManager.js';
import mongoose from 'mongoose';
import { initializeApp } from './appInitialization.js';
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import sessionRouter from "./routes/sessions.routes.js";
import inicializePassport from "./config/passport.config.js";

mongoose.connect(
  'mongodb+srv://santimeynet:mmyynntt@ecommerce.sgmhbgf.mongodb.net/ecommerce'
).then(() => {
  console.log('DB connected');
}).catch((err) => {
  console.log('Hubo un error');
  console.log(err);
});

const app = express();
const port = 8080;
const pManager = new ProductManager();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(__dirname + '/public'));
app.use("/api/users", usersRouter);
app.use(errorHandler);

app.use(session({
    store: new MongoStore({
        mongoUrl: 'mongodb+srv://santimeynet:mmyynntt@ecommerce.sgmhbgf.mongodb.net/ecommerce',
        ttl: 3600
    }),
    secret: "CoderSecret",
    resave: false,
    saveUninitialized: false
}));


inicializePassport()
app.use(passport.initialize());
app.use(passport.session());


app.engine(
    "handlebars",
    handlebars.engine({
      extname: "handlebars",
      defaultLayout: "main",
      handlebars: allowInsecurePrototypeAccess(Handlebars),
    })
);

const httpServer = app.listen(port, () =>
  console.log(`Servidor Express corriendo en el puerto ${port}`)
);
const io = new Server(httpServer); 

initializeApp(app, __dirname);

app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/', viewsRouter);
app.use('/api/session', sessionRouter);

io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');

  try {
    socket.emit('productos', await pManager.getProducts());

    socket.on('post_send', async (data) => {
      try {
        const product = {
          price: Number(data.price),
          stock: Number(data.stock),
          title: data.title,
          description: data.description,
          code: data.code,
          thumbnails: data.thumbnails,
        };

        await pManager.addProduct(product);
        socket.emit('productos', await pManager.getProducts());
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('delete_product', async (_id) => {
      try {
        const deletedProduct = await pManager.deleteProduct(_id);
        if (deletedProduct) {
          console.log('Producto eliminado:', deletedProduct);
          socket.emit('productos', await pManager.getProducts());
        } else {
          console.log('El producto no existe o no se pudo eliminar.');
        }
      } catch (error) {
        console.error('Error al eliminar el producto:', error);
      }
    });
  } catch (error) {
    console.error(error);
  }
});

export default app;
