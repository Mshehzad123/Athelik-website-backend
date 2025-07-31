import mongoose from 'mongoose';
import Category from './models/Category.js';

const MONGO_URI = 'mongodb://localhost:27017/ecommerce_admin';

async function seedCategories() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    await Category.deleteMany({});
    console.log('🗑️ Cleared existing categories');

    const sampleCategories = [
      {
        name: "LEGGINGS",
        description: "Comfortable and stylish leggings for all activities",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop",
        carouselImage: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 1
      },
      {
        name: "T-SHIRTS",
        description: "Premium quality t-shirts for everyday wear",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop",
        carouselImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 2
      },
      {
        name: "NEW ARRIVAL",
        description: "Latest arrivals and trending styles",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        carouselImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 3
      },
      {
        name: "SHORTS",
        description: "Comfortable shorts for sports and casual wear",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
        carouselImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 4
      },
      {
        name: "YOGA WEAR",
        description: "Flexible and breathable yoga clothing",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop",
        carouselImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 5
      }
    ];

    const createdCategories = await Category.insertMany(sampleCategories);
    console.log('✅ Created categories:', createdCategories.length);

    const carouselCategories = await Category.find({ showInCarousel: true }).sort({ carouselOrder: 1 });
    console.log('\n🎠 Carousel Categories:');
    carouselCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (Order: ${cat.carouselOrder})`);
    });

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedCategories(); 