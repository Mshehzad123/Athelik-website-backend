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
    
    const tankProducts = await Product.find({ subCategory: "Tanks" });
    console.log(`📦 Found ${tankProducts.length} tank products:`);
    
    tankProducts.forEach((product, index) => {
      console.log(`${index + 1}. ${product.title} - ${product.subCategory} - ${product.category}`);
    });
    
    const allProducts = await Product.find({});
    console.log(`\n📊 Total products in database: ${allProducts.length}`);
    
    const menProducts = await Product.find({ category: "Men" });
    console.log(`👨 Men products: ${menProducts.length}`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking products:", error);
    process.exit(1);
  }
}

checkTankProducts(); 