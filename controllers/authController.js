import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendOTPEmail, generateOTP } from "../utils/emailService.js";

// Step 1: Send OTP for email verification during signup
export const sendSignupOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isEmailVerified) {
      return res.status(400).json({ message: "User already exists with this email" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // If user exists but not verified, update OTP
    if (existingUser) {
      existingUser.emailVerificationOTP = otp;
      existingUser.emailVerificationOTPExpiry = otpExpiry;
      await existingUser.save();
    } else {
      // Create new user with OTP
      const newUser = new User({
        email,
        emailVerificationOTP: otp,
        emailVerificationOTPExpiry: otpExpiry,
        isEmailVerified: false
      });
      await newUser.save();
    }

    // Send OTP email (with better error handling)
    try {
      const emailSent = await sendOTPEmail(email, otp, "verification");
      if (!emailSent) {
        console.log(`📧 OTP for ${email}: ${otp} (Email not sent, but OTP generated)`);
      }
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      console.log(`📧 OTP for ${email}: ${otp} (Email failed, check console)`);
    }

    res.json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ message: "Error sending OTP", error: err.message });
  }
};

// Step 2: Complete signup with OTP verification
export const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, dateOfBirth, marketingOptIn, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found. Please request OTP first." });
    }

    // Verify OTP
    if (user.emailVerificationOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.emailVerificationOTPExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user with complete information
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = hashedPassword;
    user.dateOfBirth = dateOfBirth;
    user.marketingOptIn = marketingOptIn;
    user.isEmailVerified = true;
    user.emailVerificationOTP = undefined;
    user.emailVerificationOTPExpiry = undefined;

    await user.save();

    res.status(201).json({ message: "Signup successful", user });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Error creating user", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ 
        message: "Account has been banned by administrator",
        banReason: user.banReason || "No reason provided"
      });
    }

    // Check if password exists (for OTP users who haven't set password yet)
    if (!user.password) {
      return res.status(401).json({ message: "Please complete your registration first" });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role,
        name: user.name || user.firstName || user.email
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" } // 30 days token
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        name: user.name || user.firstName || user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Forgot Password - Send OTP
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const emailSent = await sendOTPEmail(email, otp, "reset");
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.json({ message: "Password reset OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sending reset OTP", error: err.message });
  }
};

// Reset Password with OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify OTP
    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if OTP is expired
    if (user.resetPasswordOTPExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and clear OTP
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};
