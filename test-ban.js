// Test script to verify ban functionality
import mongoose from 'mongoose';
import User from './models/User.js';

const MONGO_URI = 'mongodb://localhost:27017/ecommerce_admin';

async function testBanFunctionality() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find a user to ban
    const user = await User.findOne({ email: { $exists: true } });
    if (!user) {
      console.log('❌ No users found to test with');
      return;
    }

    console.log('👤 Found user:', user.email);
    console.log('🚫 Current ban status:', user.isBanned);

    // Ban the user
    user.isBanned = true;
    user.banReason = "Test ban";
    await user.save();

    console.log('✅ User banned successfully');
    console.log('🚫 New ban status:', user.isBanned);
    console.log('📝 Ban reason:', user.banReason);

    // Test login with banned user
    console.log('\n🧪 Testing login with banned user...');
    
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user.email,
        password: 'test123' // You might need to set a password first
      })
    });

    const loginData = await loginResponse.json();
    console.log('📡 Login response status:', loginResponse.status);
    console.log('📡 Login response:', loginData);

    // Unban the user
    user.isBanned = false;
    user.banReason = undefined;
    await user.save();

    console.log('\n✅ User unbanned successfully');
    console.log('🚫 Final ban status:', user.isBanned);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testBanFunctionality(); 