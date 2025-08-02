// Test coupon details
import Coupon from "./models/Coupon.js";
import mongoose from "mongoose";

async function checkCouponDetails() {
  try {
    console.log('🔍 Checking coupon details in database...');
    
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/ecommerce_admin");
    console.log('✅ Connected to MongoDB');
    
    // Find the coupon with code "12345"
    const coupon = await Coupon.findOne({ code: "12345" });
    
    if (coupon) {
      console.log('📊 Coupon found:');
      console.log('- Code:', coupon.code);
      console.log('- Type:', coupon.type);
      console.log('- Value:', coupon.value);
      console.log('- Min Amount:', coupon.minAmount);
      console.log('- Max Discount:', coupon.maxDiscount);
      console.log('- Usage Limit:', coupon.usageLimit);
      console.log('- Used Count:', coupon.usedCount);
      console.log('- Expires At:', coupon.expiresAt);
      console.log('- Is Active:', coupon.isActive);
      console.log('- Created At:', coupon.createdAt);
      
      // Check if expired
      const now = new Date();
      console.log('\n⏰ Current time:', now);
      console.log('📅 Expiration time:', coupon.expiresAt);
      console.log('🔍 Is expired?', coupon.expiresAt && now > coupon.expiresAt);
      
      // Check timezone issues
      if (coupon.expiresAt) {
        const timeDiff = coupon.expiresAt.getTime() - now.getTime();
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        console.log('📊 Days until expiration:', daysDiff);
      }
      
    } else {
      console.log('❌ Coupon with code "12345" not found');
    }
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkCouponDetails(); 