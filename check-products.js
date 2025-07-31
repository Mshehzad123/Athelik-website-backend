import mongoose from "mongoose";
import Product from "./models/Product.js";

// Connect to database
mongoose.connect("mongodb://localhost:27017/ecommerce_admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function checkProducts() {
  try {
    const products = await Product.find({});
    console.log(`Found ${products.length} products in database:`);
    
    products.forEach((product, index) => {
      console.log(`\nProduct ${index + 1}:`);
      console.log(`- Title: ${product.title}`);
      console.log(`- SKU: ${product.baseSku}`);
      console.log(`- Active: ${product.isActive}`);
      console.log(`- Images: ${product.images.join(', ')}`);
      console.log(`- Category: ${product.category}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("Error checking products:", error);
    process.exit(1);
  }
}

checkProducts(); 