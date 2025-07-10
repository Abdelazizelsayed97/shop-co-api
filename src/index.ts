import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import categoryRoutes from './routes/category_route';
import userRoutes from './routes/user_route';
import productRoutes from './routes/product_routs';




dotenv.config({ path: './config.env' });

import './config/db_connection';
const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use('/sample_mflix/users', userRoutes);
app.use('/sample_mflix/products', productRoutes);
app.use('/sample_mflix/categories', categoryRoutes);



const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
