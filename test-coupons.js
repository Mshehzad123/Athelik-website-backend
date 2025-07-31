// Test script to add sample coupons
import mongoose from 'mongoose';
import Coupon from './models/Coupon.js';

const MONGO_URI = 'mongodb://localhost:27017/ecommerce_admin';

async function addSampleCoupons() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Sample coupons data
    const sampleCoupons = [
      {
        code: "WELCOME10",
        type: "percentage",
        value: 10,
        minAmount: 50,
        maxDiscount: 25,
        usageLimit: 100,
        usedCount: 25,
        expiresAt: new Date('2025-12-31'),
        isStackable: false,
        isActive: true
      },
      {
        code: "SAVE20",
        type: "flat",
        value: 20,
        minAmount: 100,
        usageLimit: 50,
        usedCount: 5,
        expiresAt: new Date('2025-08-30'),
        isStackable: true,
        isActive: true
      },
      {
        code: "FREESHIP",
        type: "flat",
        value: 20, // Free shipping value
        minAmount: 200,
        usageLimit: 200,
        usedCount: 12,
        expiresAt: new Date('2025-10-15'),
        isStackable: false,
        isActive: true
      },
      {
        code: "SUMMER25",
        type: "percentage",
        value: 25,
        minAmount: 75,
        maxDiscount: 50,
        usageLimit: 75,
        usedCount: 8,
        expiresAt: new Date('2025-09-30'),
        isStackable: false,
        isActive: true
      },
      {
        code: "NEWCUSTOMER",
        type: "flat",
        value: 15,
        minAmount: 30,
        usageLimit: 1000,
        usedCount: 150,
        expiresAt: new Date('2025-12-31'),
        isStackable: false,
        isActive: true
      }
    ];

    console.log('🎯 Adding sample coupons...');
    
    for (const couponData of sampleCoupons) {
      const existingCoupon = await Coupon.findOne({ code: couponData.code });
      
      if (existingCoupon) {
        console.log(`📝 Updating existing coupon: ${couponData.code}`);
        await Coupon.findByIdAndUpdate(existingCoupon._id, couponData);
      } else {
        console.log(`➕ Creating new coupon: ${couponData.code}`);
        const coupon = new Coupon(couponData);
        await coupon.save();
      }
    }

    // Test coupon validation
    console.log('\n🧪 Testing coupon validation...');
    
    const testResponse = await fetch('http://localhost:5000/api/coupons/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: 'WELCOME10',
        cartTotal: 100,
        items: [
          { productId: 'test-product-1', categoryId: 'test-category-1' }
        ]
      })
    });

    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Coupon validation test successful!');
      console.log('📋 Test response:', testData);
    } else {
      console.log('❌ Coupon validation test failed');
    }

    console.log('\n🎉 Sample coupons added successfully!');
    console.log('📋 Available coupons:');
    const allCoupons = await Coupon.find();
    allCoupons.forEach(coupon => {
      console.log(`  - ${coupon.code}: ${coupon.type === 'percentage' ? `${coupon.value}% off` : `$${coupon.value} off`} (${coupon.isActive ? 'Active' : 'Inactive'})`);
    });

    console.log('\n📋 Next steps:');
    console.log('1. Go to admin dashboard → Coupons');
    console.log('2. View and manage the sample coupons');
    console.log('3. Go to checkout page and test coupon codes');
    console.log('4. Try codes: WELCOME10, SAVE20, FREESHIP, SUMMER25, NEWCUSTOMER');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

addSampleCoupons(); 