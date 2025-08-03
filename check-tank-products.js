import mongoose from "mongoose";
import Product from "./models/Product.js";

// Connect to database
mongoose.connect("mongodb://localhost:27017/ecommerce_admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkTankProducts() {
  try {
    console.log("🔍 Checking for tank products in database...");
    
    // Get all products
    const allProducts = await Product.find({});
    console.log(`📦 Total products in database: ${allProducts.length}`);
    
    // Get tank products specifically
    const tankProducts = await Product.find({ subCategory: "Tanks" });
    console.log(`🏋️ Tank products found: ${tankProducts.length}`);
    
    if (tankProducts.length > 0) {
      console.log("✅ Tank products found:");
      tankProducts.forEach(product => {
        console.log(`   - ${product.title} (${product.subCategory})`);
      });
    } else {
      console.log("❌ No tank products found in database!");
    }
    
    // Show all products for debugging
    console.log("\n📋 All products in database:");
    allProducts.forEach(product => {
      console.log(`   - ${product.title} (${product.subCategory})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking database:", error);
    process.exit(1);
  }
}

checkTankProducts(); 