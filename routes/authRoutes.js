import express from "express";
import { signup, login, sendSignupOTP, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// OTP and Signup routes
router.post("/send-signup-otp", sendSignupOTP);
router.post("/signup", signup);

// Login route
router.post("/login", login);

// Forgot password routes
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
