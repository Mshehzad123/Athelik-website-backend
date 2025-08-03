import mongoose from "mongoose";

const bundleSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  products: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product" 
  }],
  originalPrice: Number,
  bundlePrice: { 
    type: Number, 
    required: true 
  },
  bundleType: {
    type: String,
    enum: ['4-products', '6-products'],
    required: true
  },
  category: {
    type: String,
    enum: ['men', 'women'],
    required: true
  },
  startDate: Date,
  endDate: Date,
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

const Bundle = mongoose.model("Bundle", bundleSchema);

export default Bundle; 