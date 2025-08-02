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
        image: "/uploads/image-1753953903845-461782230.jpeg",
        carouselImage: "/uploads/image-1753953903845-461782230.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 1
      },
      {
        name: "T-SHIRTS",
        description: "Premium quality t-shirts for everyday wear",
        image: "/uploads/image-1753953941777-669249731.jpeg",
        carouselImage: "/uploads/image-1753953941777-669249731.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 2
      },
      {
        name: "NEW ARRIVAL",
        description: "Latest arrivals and trending styles",
        image: "/uploads/image-1753954023102-407874072.jpeg",
        carouselImage: "/uploads/image-1753954023102-407874072.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 3
      },
      {
        name: "SHORTS",
        description: "Comfortable shorts for sports and casual wear",
        image: "/uploads/image-1753954047209-106662341.jpeg",
        carouselImage: "/uploads/image-1753954047209-106662341.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 4
      },
      {
        name: "YOGA WEAR",
        description: "Flexible and breathable yoga clothing",
        image: "/uploads/image-1753954093474-415346334.jpeg",
        carouselImage: "/uploads/image-1753954093474-415346334.jpeg",
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