// Test script to verify carousel functionality
import mongoose from 'mongoose';
import Category from './models/Category.js';

const MONGO_URI = 'mongodb://localhost:27017/ecommerce_admin';

async function testCarouselFunctionality() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Create test categories for carousel
    const testCategories = [
      {
        name: "LEGGINGS",
        description: "Comfortable and stylish leggings",
        image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop",
        carouselImage: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=600&fit=crop",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 1
      },
      {
        name: "T-SHIRTS",
        description: "Premium cotton t-shirts",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop",
        carouselImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 2
      },
      {
        name: "NEW ARRIVAL",
        description: "Latest arrivals in our collection",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        carouselImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 3
      },
      {
        name: "SHORTS",
        description: "Comfortable athletic shorts",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
        carouselImage: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 4
      },
      {
        name: "YOGA WEAR",
        description: "Perfect for your yoga sessions",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop",
        carouselImage: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=600&fit=crop",
        isActive: true,
        showInCarousel: true,
        carouselOrder: 5
      }
    ];

    console.log('🎯 Creating test categories for carousel...');
    
    for (const categoryData of testCategories) {
      const existingCategory = await Category.findOne({ name: categoryData.name });
      
      if (existingCategory) {
        console.log(`📝 Updating existing category: ${categoryData.name}`);
        await Category.findByIdAndUpdate(existingCategory._id, categoryData);
      } else {
        console.log(`➕ Creating new category: ${categoryData.name}`);
        const category = new Category(categoryData);
        await category.save();
      }
    }

    // Test carousel API
    console.log('\n🧪 Testing carousel API...');
    
    const carouselResponse = await fetch('http://localhost:5000/api/categories/public/carousel');
    console.log('📡 Carousel API response status:', carouselResponse.status);
    
    if (carouselResponse.ok) {
      const carouselData = await carouselResponse.json();
      console.log('✅ Carousel categories:', carouselData.data.length);
      carouselData.data.forEach(cat => {
        console.log(`  - ${cat.name} (Order: ${cat.carouselOrder})`);
      });
    } else {
      console.log('❌ Carousel API failed');
    }

    // Test admin categories API
    console.log('\n🧪 Testing admin categories API...');
    
    const adminResponse = await fetch('http://localhost:5000/api/categories', {
      headers: {
        'Authorization': 'Bearer test-token',
        'Content-Type': 'application/json'
      }
    });
    console.log('📡 Admin API response status:', adminResponse.status);
    
    if (adminResponse.ok) {
      const adminData = await adminResponse.json();
      console.log('✅ Admin categories:', adminData.data.length);
    } else {
      console.log('❌ Admin API failed (expected - needs auth)');
    }

    console.log('\n🎉 Carousel test completed!');
    console.log('📋 Next steps:');
    console.log('1. Go to admin dashboard → Categories');
    console.log('2. Add/edit categories with carousel images');
    console.log('3. Toggle "Show in Carousel" for categories');
    console.log('4. Check main website carousel');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

testCarouselFunctionality(); 