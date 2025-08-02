// Migrate website signups from User to Customer model
import User from "./models/User.js";
import Customer from "./models/Customer.js";
import mongoose from "mongoose";

async function migrateCustomers() {
  try {
    console.log('🔧 Migrating website signups to Customer model...');
    
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/ecommerce_admin");
    console.log('✅ Connected to MongoDB');
    
    // Find all users with role "viewer" (website signups)
    const websiteUsers = await User.find({ role: "viewer" });
    console.log(`📊 Found ${websiteUsers.length} website signups to migrate`);
    
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const user of websiteUsers) {
      try {
        // Check if customer already exists
        const existingCustomer = await Customer.findOne({ email: user.email });
        
        if (existingCustomer) {
          console.log(`⏭️ Customer already exists for ${user.email}, skipping...`);
          skippedCount++;
          continue;
        }
        
        // Create new customer
        const customer = new Customer({
          name: user.name || user.firstName || "No Name",
          email: user.email,
          password: user.password,
          phone: user.phone,
          address: user.address,
          dateOfBirth: user.dateOfBirth,
          marketingOptIn: user.marketingOptIn || false,
          emailVerificationOTP: user.emailVerificationOTP,
          emailVerificationOTPExpiry: user.emailVerificationOTPExpiry,
          isEmailVerified: user.isEmailVerified || false,
          isActive: user.isActive !== undefined ? user.isActive : true,
          isBanned: user.isBanned || false,
          banReason: user.banReason,
          totalOrders: 0,
          totalSpent: 0,
          notes: "Migrated from User model",
          createdAt: user.createdAt
        });
        
        await customer.save();
        console.log(`✅ Migrated: ${user.email}`);
        migratedCount++;
        
        // Delete the user after successful migration
        await User.findByIdAndDelete(user._id);
        console.log(`🗑️ Deleted user: ${user.email}`);
        
      } catch (error) {
        console.error(`❌ Error migrating ${user.email}:`, error.message);
      }
    }
    
    console.log('\n📊 Migration Summary:');
    console.log(`- Total website users found: ${websiteUsers.length}`);
    console.log(`- Successfully migrated: ${migratedCount}`);
    console.log(`- Skipped (already exists): ${skippedCount}`);
    
    // Display current users (admin users only)
    const adminUsers = await User.find({}, { password: 0 });
    console.log('\n👥 Current Admin Users:');
    adminUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role}`);
    });
    
    // Display current customers
    const customers = await Customer.find({}, { password: 0 });
    console.log('\n👤 Current Customers:');
    customers.forEach(customer => {
      console.log(`- ${customer.name} (${customer.email}) - Status: ${customer.isActive ? 'Active' : 'Inactive'}`);
    });
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

migrateCustomers(); 