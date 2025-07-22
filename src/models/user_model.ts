import mongoose, { Document, Model } from 'mongoose';
import ProductModel from './product_model';

export interface IUser extends Document {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    city: string;
    role: 'USER' | 'ADMIN';
    image: string;
    isVerified: boolean;
    token: string | null;
    verificationToken: string | null;
    verificationExpires: Date | null;
    isDeleted: boolean;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    otp?: string;
    otpExpires?: Date;
    resetPasswordAllowed?: boolean;
    cartItems?: Array<typeof ProductModel>;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
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
        match: [
            /^\S+@\S+\.\S+$/,
            'Invalid email format',
        ],
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        match: [
            /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
            'Invalid phone number',
        ],
    },
    address: {
        type: String,
        trim: true,
        maxlength: 100,
        default: '',
    },
    city: {
        type: String,
        trim: true,
        maxlength: 50,
        default: '',
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
    },
    image: {
        type: String,
        trim: true,
        default: '',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
        default: null,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    verificationExpires: {
        type: Date,
        default: null,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date,
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
        },

    ],
    resetPasswordAllowed: { type: Boolean, default: false },

    resetPasswordToken: String,
    resetPasswordExpires: Date,
}, { timestamps: true });

userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    const bcrypt = await import('bcrypt');
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    const bcrypt = await import('bcrypt');
    return await bcrypt.compare(candidatePassword, this.password);
};

// userSchema.set('toJSON', {
//     transform(_, ret) {
//         delete ret.password;
//         delete ret.__v??;
//         return ret;
//     },
// });

const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);
export default UserModel;