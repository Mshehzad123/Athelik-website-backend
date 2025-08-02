import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: false 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: false 
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  dateOfBirth: Date,
  marketingOptIn: { 
    type: Boolean, 
    default: false 
  },
  emailVerificationOTP: String,
  emailVerificationOTPExpiry: Date,
  isEmailVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: String,
  totalOrders: {
    type: Number,
    default: 0
  },
  totalSpent: {
    type: Number,
    default: 0
  },
  notes: String,
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
});

const Customer = mongoose.model("Customer", customerSchema);

export default Customer; 