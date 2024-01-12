import express from 'express';
import ProductRouter from './routes/products.router.js';
import cartRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.routes.js';

export function initializeApp(app, __dirname) {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.set('view engine', 'handlebars');
  app.set('views', `${__dirname}/views`);
  
  app.use('/api/products', ProductRouter);
  app.use('/api/cart', cartRouter);
  app.use('/', viewsRouter);
  
  app.use('/public', (req, res, next) => {
    if (req.url.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
    next();
  }, express.static(`${__dirname}/public`));
}