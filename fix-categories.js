import mongoose from "mongoose";
import Category from "./models/Category.js";

// Connect to database
mongoose.connect("mongodb://localhost:27017/ecommerce_admin", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function fixCategories() {
  try {
    console.log("🔧 Fixing category displaySection values...");
    
    // Update Men categories
    const menResult = await Category.updateMany(
      { name: "Men" },
      { $set: { displaySection: "men" } }
    );
    console.log(`✅ Updated ${menResult.modifiedCount} Men categories`);
    
    // Update Women categories
    const womenResult = await Category.updateMany(
      { name: "Women" },
      { $set: { displaySection: "women" } }
    );
    console.log(`✅ Updated ${womenResult.modifiedCount} Women categories`);
    
    // Show all categories after update
    const allCategories = await Category.find({});
    console.log("\n📋 All categories after update:");
    allCategories.forEach(category => {
      console.log(`   - ${category.name} (displaySection: ${category.displaySection})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error fixing categories:", error);
    process.exit(1);
  }
}

fixCategories(); 