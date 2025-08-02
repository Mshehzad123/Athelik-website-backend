// Fix coupon expiration date issue
import Coupon from "./models/Coupon.js";
import mongoose from "mongoose";

async function fixCoupon() {
  try {
    console.log('🔧 Fixing coupon expiration date...');
    
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/ecommerce_admin");
    console.log('✅ Connected to MongoDB');
    
    // Find the coupon with code "12345"
    const coupon = await Coupon.findOne({ code: "12345" });
    
    if (coupon) {
      console.log('📊 Current coupon details:');
      console.log('- Code:', coupon.code);
      console.log('- Expires At:', coupon.expiresAt);
      console.log('- Is Active:', coupon.isActive);
      
      // Set a proper expiration date (1 year from now)
      const newExpiryDate = new Date();
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
      
      // Update the coupon
      coupon.expiresAt = newExpiryDate;
      coupon.isActive = true;
      await coupon.save();
      
      console.log('\n✅ Coupon fixed:');
      console.log('- New Expires At:', newExpiryDate);
      console.log('- Is Active:', coupon.isActive);
      
      // Test the coupon
      const now = new Date();
      console.log('\n⏰ Current time:', now);
      console.log('🔍 Is expired?', coupon.expiresAt && now > coupon.expiresAt);
      
    } else {
      console.log('❌ Coupon with code "12345" not found');
      
      // Create a new working coupon
      const newExpiryDate = new Date();
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
      
      const newCoupon = new Coupon({
        code: "12345",
        type: "percentage",
        value: 3,
        minAmount: 1,
        maxDiscount: 1,
        usageLimit: 1,
        usedCount: 0,
        expiresAt: newExpiryDate,
        isStackable: false,
        applicableProducts: [],
        applicableCategories: [],
        isActive: true
      });
      
      await newCoupon.save();
      console.log('✅ Created new coupon "12345" with proper expiration date');
    }
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixCoupon(); 