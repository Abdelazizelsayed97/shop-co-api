import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import morgan from 'morgan';


dotenv.config({ path: './config.env' });
const connectionString = process.env.DATABASE_CONNECTION_STRING;

mongoose
    .connect(connectionString as string)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
const app = express();
app.use(morgan('dev'));
app.use(express.json());

// import productRoutes from './routes/productRoutes';
// import userRoutes from './routes/userRoutes';
// import orderRoutes from './routes/orderRoutes';

// app.use('/api/products', productRoutes);
// app.use('/api/users', user1Routes);
// app.use('/api/orders', orderRoutes);
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
