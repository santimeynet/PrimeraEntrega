import { Router } from "express";
import ProductManager from "../dao/managersFS/ProductManager.js";
import { Product } from "../dao/db/models/products.model.js";

const router = Router();
const path = "products.json";
const manager = new ProductManager(path);

const publicAccess = (req, res, next) => {
    if (req.session.user) {
        return res.redirect('/');
    }
    next();
};

const privateAccess = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

router.get('/register', publicAccess, (req, res) => {
    res.render('register');
});

router.get('/login', publicAccess, (req, res) => {
    res.render('login');
});

router.get('/', (req, res) => {
    res.render('home.handlebars');
});

router.get('/profile', privateAccess, (req, res) => {
    res.render('profile', { user: req.session.user });
});

router.get("/realtimeproducts", (req, res) => {
    res.render("products.handlebars");
});

router.get("/products", async (req, res) => {
    const { page, limit } = req.query;
    const products = await Product.paginate(
        {},
        {
            page: page || 1,
            limit: limit || 10,
        }
    );
    res.render("products", {
        products,
    });
});

export default router;
