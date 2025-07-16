import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
    product: Schema.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    user: Schema.Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});

const CartSchema: Schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Each user has only one cart
    },
    items: [CartItemSchema],
}, { timestamps: true });

const CartModel = mongoose.model<ICart>('Cart', CartSchema);

export default CartModel;
