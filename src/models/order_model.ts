import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
    street: string;
    city: string;
    state: string;
    zipCode: string;
}

const orderSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: 1
        }
    }],
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    shippingAddress: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true
    }
}, {
    timestamps: true
});

const OrderModel: mongoose.Model<IOrder> = mongoose.model<IOrder>('Order', orderSchema);

export default OrderModel;
