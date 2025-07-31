import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: false 
  },
  role: { 
    type: String, 
    enum: ["admin", "manager", "viewer"], 
    default: "viewer" 
  },
  name: String,
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  marketingOptIn: { type: Boolean, default: false },
  emailVerificationOTP: String,
  emailVerificationOTPExpiry: Date,
  isEmailVerified: { type: Boolean, default: false },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);

export default User;
