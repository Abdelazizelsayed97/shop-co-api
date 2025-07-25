import { timeStamp } from "console";
import mongoose from "mongoose";
const ProductModel = mongoose.model(
    "products",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 500,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "Category",
            required: true,

        },
        stock: {
            type: Number,
            default: 0,
        },
        imageUrl: {
            type: String,
            trim: true,
        },
        brand: {
            type: String,
            trim: true,
            maxlength: 50,
        },
        rating: {
            type: Number,
            min: 0,
            max: 5,
            default: 0,
        },
    },
        {
            timestamps: true
        }
    )
);
export default ProductModel;

