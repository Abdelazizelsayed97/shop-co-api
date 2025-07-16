import UserModel from '../models/user_model';
import bcrypt from 'bcryptjs';
import express from 'express';



export const getAllUsers = async (req: express.Request, res: express.Response) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    try {
        const users = await UserModel.find({}).skip((page - 1) * limit).limit(limit);
        res.status(201).json({ page, limit, message: "Operation done successfully", users });
    } catch (error) {
        console.log(`Error fetching users: ${error}`);
        res.status(500).json({ message: 'Error fetching users' });
    }
};

export const getUserById = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    try {
        const user = await UserModel.findById(id);
        res.status(201).json({ message: "Operation done successfully", user });
    } catch (error) {
        res.status(500).json({ message: 'User not found' });
    }
};

export const createUser = async (userData: any) => {
    const newUser = new UserModel(userData);

    const existingUser = await UserModel.findOne({ email: userData.email });
    if (existingUser) {
        throw new Error(`This email already exists try to login instead`);
    }
    newUser.email = userData.email.toLowerCase();
    newUser.role = userData.role || 'USER';
    newUser.isVerified = userData.isVerified || false;
    if (userData.password) {
        const salt = await bcrypt.genSalt(userData.password.length);
        newUser.password = await bcrypt.hash(userData.password, salt);
    }
    return await newUser.save();
};


export const updateUser = async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const name = req.body;
    try {
        const user = await UserModel.findByIdAndUpdate(id, { lastName: name }, {
            new: true,
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            message: 'User updated successfully',
            user,
        });
    } catch (error) {
        console.error(`Error updating user:`, error);
        res.status(500).json({ message: 'Server error while updating user' });
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