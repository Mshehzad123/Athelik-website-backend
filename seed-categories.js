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
      // Men's Categories
      {
        name: "T-Shirts",
        description: "Comfortable and stylish t-shirts for men",
        image: "/uploads/image-1753953903845-461782230.jpeg",
        carouselImage: "/uploads/image-1753953903845-461782230.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 1,
        displaySection: "men",
        sectionOrder: 1
      },
      {
        name: "Shorts",
        description: "Comfortable shorts for sports and casual wear",
        image: "/uploads/image-1753953941777-669249731.jpeg",
        carouselImage: "/uploads/image-1753953941777-669249731.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 2,
        displaySection: "men",
        sectionOrder: 2
      },
      {
        name: "Hoodies",
        description: "Warm and comfortable hoodies for men",
        image: "/uploads/image-1753954023102-407874072.jpeg",
        carouselImage: "/uploads/image-1753954023102-407874072.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 3,
        displaySection: "men",
        sectionOrder: 3
      },
      {
        name: "Trousers",
        description: "Comfortable trousers for men",
        image: "/uploads/image-1753954047209-106662341.jpeg",
        carouselImage: "/uploads/image-1753954047209-106662341.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 4,
        displaySection: "men",
        sectionOrder: 4
      },
      // Women's Categories
      {
        name: "Leggings",
        description: "Comfortable and stylish leggings for women",
        image: "/uploads/image-1753954093474-415346334.jpeg",
        carouselImage: "/uploads/image-1753954093474-415346334.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 5,
        displaySection: "women",
        sectionOrder: 1
      },
      {
        name: "Tops",
        description: "Stylish tops for women",
        image: "/uploads/image-1753953903845-461782230.jpeg",
        carouselImage: "/uploads/image-1753953903845-461782230.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 6,
        displaySection: "women",
        sectionOrder: 2
      },
      {
        name: "Dresses",
        description: "Elegant dresses for women",
        image: "/uploads/image-1753953941777-669249731.jpeg",
        carouselImage: "/uploads/image-1753953941777-669249731.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 7,
        displaySection: "women",
        sectionOrder: 3
      },
      {
        name: "Skirts",
        description: "Comfortable skirts for women",
        image: "/uploads/image-1753954023102-407874072.jpeg",
        carouselImage: "/uploads/image-1753954023102-407874072.jpeg",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 8,
        displaySection: "women",
        sectionOrder: 4
      }
    ];

    const createdCategories = await Category.insertMany(sampleCategories);
    console.log('✅ Created categories:', createdCategories.length);

    const carouselCategories = await Category.find({ showInCarousel: true }).sort({ carouselOrder: 1 });
    console.log('\n🎠 Carousel Categories:');
    carouselCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (Order: ${cat.carouselOrder}, Section: ${cat.displaySection})`);
    });

    const menCategories = await Category.find({ displaySection: 'men', isActive: true }).sort({ sectionOrder: 1 });
    console.log('\n👨 Men Categories:');
    menCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (Order: ${cat.sectionOrder})`);
    });

    const womenCategories = await Category.find({ displaySection: 'women', isActive: true }).sort({ sectionOrder: 1 });
    console.log('\n👩 Women Categories:');
    womenCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.name} (Order: ${cat.sectionOrder})`);
    });

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedCategories(); 