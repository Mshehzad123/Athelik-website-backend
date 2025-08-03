import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

async function checkProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_admin');
    console.log('✅ Connected to MongoDB');
    
    const products = await Product.find({}, 'title collectionType basePrice _id');
    console.log('\n📦 Products with collectionType:');
    console.log('='.repeat(80));
    
    const menProducts = [];
    const womenProducts = [];
    const otherProducts = [];
    
    products.forEach(p => {
      console.log(`${p.title} - ${p.collectionType} - $${p.basePrice} - ID: ${p._id}`);
      
      if (p.collectionType === 'men') {
        menProducts.push(p);
      } else if (p.collectionType === 'women') {
        womenProducts.push(p);
      } else {
        otherProducts.push(p);
      }
    });
    
    console.log('\n📊 Summary:');
    console.log(`Men's products: ${menProducts.length}`);
    console.log(`Women's products: ${womenProducts.length}`);
    console.log(`Other products: ${otherProducts.length}`);
    console.log(`Total products: ${products.length}`);
    
    if (menProducts.length > 0) {
      console.log('\n👨 Men\'s Products (first 6):');
      menProducts.slice(0, 6).forEach(p => console.log(`  - ${p.title} (${p._id})`));
    }
    
    if (womenProducts.length > 0) {
      console.log('\n👩 Women\'s Products (first 6):');
      womenProducts.slice(0, 6).forEach(p => console.log(`  - ${p.title} (${p._id})`));
    }
    
    if (otherProducts.length > 0) {
      console.log('\n🔍 Other Products:');
      otherProducts.forEach(p => console.log(`  - ${p.title} (${p.collectionType})`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

checkProducts(); 