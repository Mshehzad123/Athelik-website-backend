import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ecommerce_admin";

async function resetUsers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    // Delete all existing users
    await User.deleteMany({});
    console.log("🗑️ All users deleted");

    // Create default users
    const defaultUsers = [
      { email: "admin@example.com", password: "admin123", role: "admin", name: "Admin User" },
      { email: "manager@example.com", password: "manager123", role: "manager", name: "Manager User" },
      { email: "viewer@example.com", password: "viewer123", role: "viewer", name: "Viewer User" },
    ];

    for (const userData of defaultUsers) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
        isEmailVerified: true, // Set email as verified for default users
      });
      await user.save();
      console.log(`✅ Created user: ${userData.email}`);
    }

    console.log("🎉 Default users created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting users:", error);
    process.exit(1);
  }
}

resetUsers(); 