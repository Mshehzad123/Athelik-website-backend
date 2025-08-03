import mongoose from "mongoose";
import Product from "./models/Product.js";

// Use the same connection string as backend server
const MONGO_URI = "mongodb://localhost:27017/ecommerce_admin";

// Connect to database
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function testBackendDB() {
  try {
    console.log("🔍 Testing backend database connection...");
    console.log("📡 Using connection string:", MONGO_URI);
    
    // Get all products
    const allProducts = await Product.find({});
    console.log(`📦 Total products in backend DB: ${allProducts.length}`);
    
    // Get tank products specifically
    const tankProducts = await Product.find({ subCategory: "Tanks" });
    console.log(`🏋️ Tank products in backend DB: ${tankProducts.length}`);
    
    if (tankProducts.length > 0) {
      console.log("✅ Tank products found in backend DB:");
      tankProducts.forEach(product => {
        console.log(`   - ${product.title} (${product.subCategory}) - Active: ${product.isActive}`);
      });
    } else {
      console.log("❌ No tank products found in backend DB!");
    }
    
    // Show all products for debugging
    console.log("\n📋 All products in backend DB:");
    allProducts.forEach(product => {
      console.log(`   - ${product.title} (${product.subCategory}) - Active: ${product.isActive}`);
    });
    
    // Check if products are active
    const activeProducts = await Product.find({ isActive: true });
    console.log(`\n✅ Active products in backend DB: ${activeProducts.length}`);
    
    const inactiveProducts = await Product.find({ isActive: false });
    console.log(`❌ Inactive products in backend DB: ${inactiveProducts.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error testing backend DB:", error);
    process.exit(1);
  }
}

testBackendDB(); 