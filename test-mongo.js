import mongoose from "mongoose";

console.log("🔍 Testing MongoDB connection...");

mongoose.connect("mongodb://localhost:27017/ecommerce_admin")
  .then(() => {
    console.log("✅ MongoDB Connected");
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }); 