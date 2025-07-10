import mongoose from 'mongoose';
import { token } from 'morgan';

mongoose.model(
    'User', new mongoose.Schema({
        firstName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 25,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 25,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        token: {
            type: String,
            default: null,

        },
        isVerified: {
            type: Boolean,
            required: true,
            default: false,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        phone: {
            type: String,
            trim: true,
            minlength: 10,
            maxlength: 15,
            required: true
        },
        address: {
            type: String,
            trim: true,
            maxlength: 100,
            required: true
        },
        city: {
            type: String,
            trim: true,
            maxlength: 50,
            required: true
        },
        role: {
            type: String,
            enum: ['USER', 'ADMIN'],
            default: 'USER',
        },
        image: {
            type: String,
            trim: true,

        },
    })
);
export default mongoose.model('User');