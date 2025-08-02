// Update users with proper roles
import User from "./models/User.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

async function updateUsers() {
  try {
    console.log('🔧 Updating users with proper roles...');
    
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/ecommerce_admin");
    console.log('✅ Connected to MongoDB');
    
    // Update or create admin user
    let adminUser = await User.findOne({ email: "admin@example.com" });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      adminUser = new User({
        email: "admin@example.com",
        password: hashedPassword,
        name: "Admin User",
        role: "admin",
        isActive: true,
        isEmailVerified: true
      });
      await adminUser.save();
      console.log('✅ Created admin user');
    } else {
      adminUser.role = "admin";
      adminUser.name = "Admin User";
      adminUser.isActive = true;
      await adminUser.save();
      console.log('✅ Updated admin user');
    }
    
    // Update or create manager user
    let managerUser = await User.findOne({ email: "manager@example.com" });
    if (!managerUser) {
      const hashedPassword = await bcrypt.hash("manager123", 10);
      managerUser = new User({
        email: "manager@example.com",
        password: hashedPassword,
        name: "Manager User",
        role: "manager",
        isActive: true,
        isEmailVerified: true
      });
      await managerUser.save();
      console.log('✅ Created manager user');
    } else {
      managerUser.role = "manager";
      managerUser.name = "Manager User";
      managerUser.isActive = true;
      await managerUser.save();
      console.log('✅ Updated manager user');
    }
    
    // Update or create viewer user
    let viewerUser = await User.findOne({ email: "viewer@example.com" });
    if (!viewerUser) {
      const hashedPassword = await bcrypt.hash("viewer123", 10);
      viewerUser = new User({
        email: "viewer@example.com",
        password: hashedPassword,
        name: "Viewer User",
        role: "viewer",
        isActive: true,
        isEmailVerified: true
      });
      await viewerUser.save();
      console.log('✅ Created viewer user');
    } else {
      viewerUser.role = "viewer";
      viewerUser.name = "Viewer User";
      viewerUser.isActive = true;
      await viewerUser.save();
      console.log('✅ Updated viewer user');
    }
    
    // Display all users
    const allUsers = await User.find({}, { password: 0 });
    console.log('\n📊 Current users:');
    allUsers.forEach(user => {
      console.log(`- ${user.name} (${user.email}) - Role: ${user.role} - Status: ${user.isActive ? 'Active' : 'Inactive'}`);
    });
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateUsers(); 