// Test authentication and coupon access
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

async function testAuth() {
  try {
    console.log('🧪 Testing authentication...');
    
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/ecommerce_admin");
    console.log('✅ Connected to MongoDB');
    
    // Test 1: Create a test admin token
    console.log('\n📡 Test 1: Creating admin token');
    const adminToken = jwt.sign(
      { 
        userId: "test-admin-id", 
        email: "admin@example.com", 
        role: "admin" 
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    console.log('✅ Admin token created:', adminToken.substring(0, 50) + '...');
    
    // Test 2: Test coupon API with admin token
    console.log('\n📡 Test 2: Testing coupon API with admin token');
    try {
      const response = await fetch('http://localhost:5000/api/coupons', {
        headers: {
          'Authorization': `Bearer ${adminToken}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Coupons fetched:', data);
      } else {
        const error = await response.json();
        console.log('❌ Error:', error);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }
    
    // Test 3: Check if server is running
    console.log('\n📡 Test 3: Check server health');
    try {
      const response = await fetch('http://localhost:5000/api/health');
      console.log('Status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Server is running:', data);
      } else {
        console.log('❌ Server not responding properly');
      }
    } catch (error) {
      console.log('❌ Server not running:', error.message);
    }
    
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuth(); 