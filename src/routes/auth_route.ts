// src/routes/auth.routes.ts
import express from 'express';
import { loginUser, registerUser, verifyEmailOtp, forgotPassword, verifyResetOtp, resetPassword } from '../services/auth_service';

const router = express.Router();

// Register new user
router.post('/register', registerUser);

// Verify email OTP
router.post('/verify-email-otp', verifyEmailOtp);

// Login user
router.post('/login', loginUser);

// Forgot password (request OTP)
router.post('/forgot-password', forgotPassword);

// Verify reset password OTP
router.post('/verify-reset-otp', verifyResetOtp);

// Reset password (after OTP verification)
router.post('/reset-password', resetPassword);

export default router;
