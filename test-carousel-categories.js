import mongoose from "mongoose";
import Category from "./models/Category.js";

const MONGO_URI = "mongodb://localhost:27017/ecommerce_admin";

async function testCarouselCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");

    const categories = await Category.find({
      isActive: true,
      showInCarousel: true
    }).sort({ carouselOrder: 1, createdAt: -1 });

    console.log(`\n🎠 Found ${categories.length} carousel categories:`);
    
    categories.forEach((category, index) => {
      console.log(`\n${index + 1}. ${category.name}`);
      console.log(`   ID: ${category._id}`);
      console.log(`   Image: ${category.image || 'NOT SET'}`);
      console.log(`   Carousel Image: ${category.carouselImage || 'NOT SET'}`);
      console.log(`   Show in Carousel: ${category.showInCarousel}`);
      console.log(`   Carousel Order: ${category.carouselOrder}`);
    });

    if (categories.length === 0) {
      console.log("\n⚠️ No carousel categories found!");
      console.log("You need to create categories and set showInCarousel: true");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await mongoose.disconnect();
    console.log("\n✅ Disconnected from MongoDB");
  }
}

testCarouselCategories(); 