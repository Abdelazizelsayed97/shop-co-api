import mongoose, { Document, Model, Schema } from 'mongoose';
import { IUser } from './user_model';

export interface IAddress extends Document {
    user: IUser['_id'];
    street: string;
    city: string;
    state: string;
    zipCode: string;
    isDefault: boolean;
}

const addressSchema = new Schema<IAddress>({
    user: {
        type: String,
        ref: 'User',
        required: true,
    },
    street: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
    state: {
        type: String,
        required: true,
        trim: true,
    },
    zipCode: {
        type: String,
        required: true,
        trim: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

const AddressModel: Model<IAddress> = mongoose.model<IAddress>('Address', addressSchema);

export default AddressModel;