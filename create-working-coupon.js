// Create a working coupon without expiration issues
import Coupon from "./models/Coupon.js";
import mongoose from "mongoose";

async function createWorkingCoupon() {
  try {
    console.log('🔧 Creating working coupon...');
    
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/ecommerce_admin");
    console.log('✅ Connected to MongoDB');
    
    // Delete existing coupon with code "12345"
    await Coupon.deleteOne({ code: "12345" });
    console.log('🗑️ Deleted existing coupon "12345"');
    
    // Create new working coupon without expiration date
    const workingCoupon = new Coupon({
      code: "12345",
      type: "percentage",
      value: 10, // 10% off
      minAmount: 1,
      maxDiscount: 50,
      usageLimit: 100,
      usedCount: 0,
      expiresAt: null, // No expiration date
      isStackable: false,
      applicableProducts: [],
      applicableCategories: [],
      isActive: true
    });
    
    await workingCoupon.save();
    console.log('✅ Created working coupon "12345":');
    console.log('- Code: 12345');
    console.log('- Type: percentage');
    console.log('- Value: 10%');
    console.log('- No expiration date');
    console.log('- Is Active: true');
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createWorkingCoupon(); 