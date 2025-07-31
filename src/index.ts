import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import categoryRoutes from './routes/category_route';
import userRoutes from './routes/user_route';
import productRoutes from './routes/product_route';
import orderRoutes from './routes/order_route';
import cartRoutes from './routes/cart_route';
import authRoute from './routes/auth_route';
import addressRoute from './routes/adress_route';
import cors from 'cors';






dotenv.config({ path: './config.env' });

import './config/db_connection';

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(cors({
    origin: '*',
    credentials: true,
}));
app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/categories', categoryRoutes);
app.use('/orders', orderRoutes);
app.use('/cart', cartRoutes);
app.use('/auth', authRoute);
app.use('/address', addressRoute);

//route error handler
// app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
//     const err = new Error(`Route ${req.originalUrl} not found`);
//     next(err);
// });

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(500).json({ err });
    next({ error: err.message });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
