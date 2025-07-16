import mongoose from 'mongoose';

const CategoryModel = mongoose.model(
    'Category',
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            minlength: 2,
            maxlength: 50,
        },
        slug: {
            type: String,
            lowercase: true,
        },
    }, { timestamps: true })
);

export default CategoryModel;       