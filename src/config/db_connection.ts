
import mongoose from 'mongoose';


export const connectionString = process.env.DATABASE_CONNECTION_STRING;
mongoose
    .connect(connectionString as string)
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });


