import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Customer from "../models/Customer.js";
import { sendOTPEmail, generateOTP } from "../utils/emailService.js";

// Step 1: Send OTP for email verification during signup
export const sendSignupOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer && existingCustomer.isEmailVerified) {
      return res.status(400).json({ message: "Customer already exists with this email" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    if (existingCustomer) {
      existingCustomer.emailVerificationOTP = otp;
      existingCustomer.emailVerificationOTPExpiry = otpExpiry;
      await existingCustomer.save();
    } else {
      const newCustomer = new Customer({
        email,
        emailVerificationOTP: otp,
        emailVerificationOTPExpiry: otpExpiry,
        isEmailVerified: false
      });
      await newCustomer.save();
    }

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

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(400).json({ message: "Customer not found. Please request OTP first." });
    }

    if (customer.emailVerificationOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (customer.emailVerificationOTPExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    customer.name = `${firstName} ${lastName}`;
    customer.password = hashedPassword;
    customer.dateOfBirth = dateOfBirth;
    customer.marketingOptIn = marketingOptIn;
    customer.isEmailVerified = true;
    customer.emailVerificationOTP = undefined;
    customer.emailVerificationOTPExpiry = undefined;

    await customer.save();

    res.status(201).json({ message: "Signup successful", customer });
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ message: "Error creating customer", error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await User.findOne({ email });
    let isAdminUser = true;

    if (!user) {
      user = await Customer.findOne({ email });
      isAdminUser = false;
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (user.isBanned) {
      return res.status(403).json({ 
        message: "Account has been banned by administrator",
        banReason: user.banReason || "No reason provided"
      });
    }

    if (!user.password) {
      return res.status(401).json({ message: "Please complete your registration first" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: isAdminUser ? user.role : "customer",
        name: user.name || user.firstName || user.email,
        userType: isAdminUser ? "admin" : "customer"
      },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "30d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        name: user.name || user.firstName || user.email,
        role: isAdminUser ? user.role : "customer",
        userType: isAdminUser ? "admin" : "customer",
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Forgot Password (Admin + Customer)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    let user = await User.findOne({ email });
    let isCustomer = false;

    if (!user) {
      user = await Customer.findOne({ email });
      isCustomer = true;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpiry = otpExpiry;
    await user.save();

    const emailSent = await sendOTPEmail(email, otp, "reset");
    
    if (!emailSent) {
      return res.status(500).json({ message: "Failed to send OTP email" });
    }

    res.json({ message: "Password reset OTP sent successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error sending reset OTP", error: err.message });
  }
};

// ✅ Reset Password with OTP (Admin + Customer)
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    let user = await User.findOne({ email });
    let isCustomer = false;

    if (!user) {
      user = await Customer.findOne({ email });
      isCustomer = true;
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.resetPasswordOTP !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.resetPasswordOTPExpiry < new Date()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpiry = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};
