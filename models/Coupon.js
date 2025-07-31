import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true 
  },
  type: { 
    type: String, 
    enum: ["flat", "percentage"], 
    required: true 
  },
  value: { 
    type: Number, 
    required: true 
  },
  minAmount: Number,
  maxDiscount: Number,
  usageLimit: Number,
  usedCount: { 
    type: Number, 
    default: 0 
  },
  expiresAt: Date,
  isStackable: { 
    type: Boolean, 
    default: false 
  },
  applicableProducts: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product" 
  }],
  applicableCategories: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category" 
  }],
  isActive: { 
    type: Boolean, 
    default: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
}, {
  timestamps: true
});

const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon; 