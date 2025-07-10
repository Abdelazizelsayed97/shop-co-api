import mongoose from 'mongoose';

mongoose.model(
    'Category',
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
    })
);

export default mongoose.model('Category');