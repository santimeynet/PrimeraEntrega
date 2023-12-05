import express from 'express';
import fs from 'fs';
import { engine } from "express-handlebars";
import { Server as SocketIOServer } from "socket.io";
import { ProductManager } from './ProductManager.js';
import { cartManager } from './routes/cartManager.js';
import { productsRouter } from './routes/products.router.js';
import { cartsRouter } from './routes/carts.router.js';
import __dirname from "./utils.js";
import viewsRouter from "./routes/views.router.js";

const PORT = 8080;

const app = express();


app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use('/products', productsRouter);
app.use('/carts', cartsRouter)
app.engine("handlebars", engine({ defaultLayout: "main" }));    
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");

app.get('/', (req, res) => {
    res.render('index');
});



const httpServer = app.listen(PORT, () => console.log(`Server funcionando en el puerto: ${PORT}`));
const io = new SocketIOServer(httpServer);

const productManagerInstance = new ProductManager(io);  
const cartManagerInstance = new cartManager(io);



io.on("connection", (socket) => {
    console.log('Usuario conectado');

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
        
    socket.on('join-realtimeproducts', () => {
    console.log('Usuario conectado a /realtimeproducts');
    });
        
        fs.readFile('products.json', 'utf8', (err, data) => {
            if (err) {
                console.error('Error al leer el archivo products.json', err);
                return;
            }
    
            const products = JSON.parse(data);

            socket.emit("products", products);
        });
    });


app.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts');
});


export { productManagerInstance as ProductManager };
export { cartManagerInstance as cartManager };
