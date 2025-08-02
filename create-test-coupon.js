// Create a test coupon with proper expiration date
import Coupon from "./models/Coupon.js";
import mongoose from "mongoose";

async function createTestCoupon() {
  try {
    console.log('🔧 Creating test coupon...');
    
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/ecommerce_admin");
    console.log('✅ Connected to MongoDB');
    
    // Set expiration date to 1 year from now
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
    
    // Create new test coupon
    const testCoupon = new Coupon({
      code: "TEST123",
      type: "percentage",
      value: 10, // 10% off
      minAmount: 1,
      maxDiscount: 50,
      usageLimit: 100,
      usedCount: 0,
      expiresAt: expiresAt,
      isStackable: false,
      applicableProducts: [],
      applicableCategories: [],
      isActive: true
    });
    
    await testCoupon.save();
    console.log('✅ Test coupon created successfully:');
    console.log('- Code: TEST123');
    console.log('- Type: percentage');
    console.log('- Value: 10%');
    console.log('- Expires At:', expiresAt);
    console.log('- Is Active: true');
    
    // Also update the existing coupon "12345" to have a proper expiration date
    const existingCoupon = await Coupon.findOne({ code: "12345" });
    if (existingCoupon) {
      existingCoupon.expiresAt = expiresAt;
      await existingCoupon.save();
      console.log('\n✅ Updated coupon "12345" with new expiration date:', expiresAt);
    }
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTestCoupon(); 