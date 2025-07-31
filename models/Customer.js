import mongoose from "mongoose";

const customerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  phone: String,
  address: String,
  totalOrders: { 
    type: Number, 
    default: 0 
  },
  totalSpent: { 
    type: Number, 
    default: 0 
  },
  isBanned: { 
    type: Boolean, 
    default: false 
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