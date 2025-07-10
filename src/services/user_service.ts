import UserModel from '../models/user_model';
import bcrypt from 'bcryptjs';

//do the crud operations for the category

export const getAllUsers = async () => {
    return await UserModel.find();
};

export const getUserById = async (id: string) => {
    try {
        return await UserModel.findById(id);
    } catch (error) {
        throw new Error(`User with ID ${id} not found`);
    }
};

export const createUser = async (userData: any) => {
    const newUser = new UserModel(userData);
    // Check if the email already exists
    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error(`This email already exists try to login instead`);
    }
    // Save the new user
    newUser.email = userData.email.toLowerCase(); // Ensure email is stored in lowercase
    newUser.role = userData.role || 'USER'; // Default role to 'USER'
    newUser.isVerified = userData.isVerified || false; // Default verification status to false
    if (userData.password) {
        // Hash the password before saving
        const salt = await bcrypt.genSalt(userData.password.length);
        newUser.password = await bcrypt.hash(userData.password, salt);
    }
    return await newUser.save();
};

export const updateUser = async (id: string, userData: any) => {
    try {
        return await UserModel.findByIdAndUpdate(id, userData, { new: true });
    } catch (error) {
        throw new Error(`Error updating user with ID ${id}`);
    }
};

export const deleteUser = async (id: string) => {
    try {
        return await UserModel.findByIdAndDelete(id);
    } catch (error) {
        throw new Error(`Error deleting user with ID ${id}`);
    }
};
export const getUserByEmail = async (email: string) => {
    try {
        return await UserModel.findOne({ email });
    } catch (error) {
        throw new Error(`Error finding user with email ${email}`);
    }
};