
import express from 'express';
import { loginUser, registerUser, verifyEmailOtp, forgotPassword, verifyResetOtp, resetPassword } from '../services/auth_service';

const router = express.Router();


router.post('/register', registerUser);


router.post('/verify-email-otp', verifyEmailOtp);


router.post('/login', loginUser);


router.post('/forgot-password', forgotPassword);


router.post('/verify-reset-otp', verifyResetOtp);


router.post('/reset-password', resetPassword);

export default router;
