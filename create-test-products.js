import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

async function createTestProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_admin');
    console.log('✅ Connected to MongoDB');
    
    // Test products for Men
    const menProducts = [
      {
        title: "Men's Athletic Shirt",
        basePrice: 45,
        baseSku: "MEN-ATH-001",
        category: "Men",
        description: "Comfortable athletic shirt for men",
        images: ["/images/mens-shirt-1.jpg"],
        isActive: true
      },
      {
        title: "Men's Training Pants",
        basePrice: 65,
        baseSku: "MEN-TRAIN-001",
        category: "Men",
        description: "Durable training pants for men",
        images: ["/images/mens-pants-1.jpg"],
        isActive: true
      },
      {
        title: "Men's Sports Jacket",
        basePrice: 85,
        baseSku: "MEN-JACKET-001",
        category: "Men",
        description: "Stylish sports jacket for men",
        images: ["/images/mens-jacket-1.jpg"],
        isActive: true
      },
      {
        title: "Men's Workout Shorts",
        basePrice: 35,
        baseSku: "MEN-SHORTS-001",
        category: "Men",
        description: "Comfortable workout shorts for men",
        images: ["/images/mens-shorts-1.jpg"],
        isActive: true
      },
      {
        title: "Men's Fitness Tank",
        basePrice: 25,
        baseSku: "MEN-TANK-001",
        category: "Men",
        description: "Lightweight fitness tank for men",
        images: ["/images/mens-tank-1.jpg"],
        isActive: true
      },
      {
        title: "Men's Gym Hoodie",
        basePrice: 75,
        baseSku: "MEN-HOODIE-001",
        category: "Men",
        description: "Warm gym hoodie for men",
        images: ["/images/mens-hoodie-1.jpg"],
        isActive: true
      }
    ];
    
    // Test products for Women
    const womenProducts = [
      {
        title: "Women's Yoga Leggings",
        basePrice: 55,
        baseSku: "WOM-LEGGINGS-001",
        category: "Women",
        description: "Comfortable yoga leggings for women",
        images: ["/images/womens-leggings-1.jpg"],
        isActive: true
      },
      {
        title: "Women's Sports Bra",
        basePrice: 40,
        baseSku: "WOM-BRA-001",
        category: "Women",
        description: "Supportive sports bra for women",
        images: ["/images/womens-bra-1.jpg"],
        isActive: true
      },
      {
        title: "Women's Athletic Top",
        basePrice: 50,
        baseSku: "WOM-TOP-001",
        category: "Women",
        description: "Stylish athletic top for women",
        images: ["/images/womens-top-1.jpg"],
        isActive: true
      },
      {
        title: "Women's Training Shorts",
        basePrice: 45,
        baseSku: "WOM-SHORTS-001",
        category: "Women",
        description: "Comfortable training shorts for women",
        images: ["/images/womens-shorts-1.jpg"],
        isActive: true
      },
      {
        title: "Women's Fitness Tank",
        basePrice: 30,
        baseSku: "WOM-TANK-001",
        category: "Women",
        description: "Lightweight fitness tank for women",
        images: ["/images/womens-tank-1.jpg"],
        isActive: true
      },
      {
        title: "Women's Gym Jacket",
        basePrice: 80,
        baseSku: "WOM-JACKET-001",
        category: "Women",
        description: "Stylish gym jacket for women",
        images: ["/images/womens-jacket-1.jpg"],
        isActive: true
      }
    ];
    
    console.log('📦 Creating test products...');
    
    // Create men's products
    for (const productData of menProducts) {
      try {
        const product = new Product(productData);
        await product.save();
        console.log(`✅ Created men's product: ${productData.title}`);
      } catch (error) {
        console.log(`⚠️ Skipped men's product: ${productData.title} (may already exist)`);
      }
    }
    
    // Create women's products
    for (const productData of womenProducts) {
      try {
        const product = new Product(productData);
        await product.save();
        console.log(`✅ Created women's product: ${productData.title}`);
      } catch (error) {
        console.log(`⚠️ Skipped women's product: ${productData.title} (may already exist)`);
      }
    }
    
    // Verify the products
    const allProducts = await Product.find({});
    const menCount = allProducts.filter(p => p.category === 'Men').length;
    const womenCount = allProducts.filter(p => p.category === 'Women').length;
    
    console.log('\n📊 Final Summary:');
    console.log(`Total products: ${allProducts.length}`);
    console.log(`Men's products: ${menCount}`);
    console.log(`Women's products: ${womenCount}`);
    
    if (menCount > 0) {
      console.log('\n👨 Sample Men\'s Products:');
      const menProducts = allProducts.filter(p => p.category === 'Men').slice(0, 3);
      menProducts.forEach(p => console.log(`  - ${p.title} (${p._id})`));
    }
    
    if (womenCount > 0) {
      console.log('\n👩 Sample Women\'s Products:');
      const womenProducts = allProducts.filter(p => p.category === 'Women').slice(0, 3);
      womenProducts.forEach(p => console.log(`  - ${p.title} (${p._id})`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

createTestProducts(); 