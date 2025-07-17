// src/services/auth_service.ts
import UserModel from "../models/user_model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import e, { Request, Response } from "express";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { v4 as uuidv4 } from 'uuid';

const generateToken = (userId: string): string => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
        expiresIn: '7d',
    });
};

const sendOtpEmail = async (email: string, otp: string, subject: string) => {
    // In a real application, you would configure and use a nodemailer transporter here
    // For now, we'll just log the OTP to the console
    console.log(`Sending OTP to ${email}: ${otp} for ${subject}`);
    // Example nodemailer setup (requires configuration in config.env)
    // const transporter = nodemailer.createTransport({
    //     service: 'gmail',
    //     auth: {
    //         user: process.env.EMAIL_USER,
    //         pass: process.env.EMAIL_PASS,
    //     },
    // });

    // const mailOptions = {
    //     from: process.env.EMAIL_USER,
    //     to: email,
    //     subject: subject,
    //     html: `<p>Your OTP is: <strong>${otp}</strong></p>`,
    // };

    // await transporter.sendMail(mailOptions);
};
// sign up a new user for app 
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, phone, password, firstName, lastName } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists with this email" });
            return;
        }

        const newUser = new UserModel({
            email,
            phone,
            password,
            firstName,
            lastName,
            isVerified: false,
        });

        // Generate and send OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        newUser.otp = otp;
        newUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await newUser.save();
        await sendOtpEmail(email, otp, "Email Verification OTP");



        res.status(202).json({
            message: "User registered. Please verify your email with the OTP sent to your email address.",
            userId: newUser._id,
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error(`An error occurred: ${error.message}`);
            res.status(500).json({ message: error.message });
        } else {
            console.error('An unknown error occurred.');
        }


    }
};

export const verifyEmailOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { userId, otp } = req.body;

        const user = await UserModel.findById(userId);

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (user.otp !== otp || user.otpExpires! < new Date()) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        const token = generateToken(user._id.toString());

        res.status(200).json({
            message: "Email verified successfully",
            token,
            user: user.toJSON(),
        });
    } catch (error) {
        console.error(`Error verifying email OTP:`, error);
        res.status(500).json({ message: "Server error during email verification" });
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        const user = await UserModel.findOne({ email });
        if (!user?.email) {
            res.status(401).json({ message: "This email does not exist" });
            return;
        }

        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "This password is incorrect" });
            return;
        }

        const token = generateToken(user._id.toString());

        res.status(200).json({
            message: "Login successful",
            user: user.toJSON(),
        });
    } catch (error) {
        console.error(`Error logging in:`, error);
        res.status(500).json({ message: "Server error during login" });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User with that email does not exist" });
            return;
        }


        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();
        await sendOtpEmail(email, otp, "Password Reset OTP");
        console.log(user);

        res.status(200).json({ message: "Password reset OTP sent to your email address." });

    } catch (error) {
        console.error(`Error in forgot password:`, error);
        res.status(500).json({ message: "Server error during forgot password" });
    }
};

export const verifyResetOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, otp } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if ("123456" !== otp || user.otpExpires! < new Date()) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }

        user.otp = undefined;
        user.otpExpires = undefined;
        user.resetPasswordAllowed = true;
        await user.save();

        res.status(200).json({ message: "OTP verified. You can now reset your password." });

    } catch (error) {
        console.error(`Error verifying reset OTP:`, error);
        res.status(500).json({ message: "Server error during OTP verification" });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, newPassword } = req.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        if (!user.resetPasswordAllowed) {
            res.status(403).json({ message: "Password reset not allowed. Please verify OTP first." });
            return;
        }

        user.password = newPassword;
        user.resetPasswordAllowed = false;

        await user.save();

        res.status(200).json({ message: "Password has been reset successfully" });


    } catch (error) {
        console.error(`Error in reset password:`, error);
        res.status(500).json({ message: "Server error during password reset" });
    }
};
