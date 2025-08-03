import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

async function checkCategories() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_admin');
    console.log('✅ Connected to MongoDB');
    
    const products = await Product.find({}, 'title category collectionType basePrice _id');
    console.log('\n📦 Products with Categories:');
    console.log('='.repeat(80));
    
    const categories = new Set();
    const collectionTypes = new Set();
    
    products.forEach(p => {
      console.log(`${p.title} - Category: ${p.category} - CollectionType: ${p.collectionType} - $${p.basePrice} - ID: ${p._id}`);
      categories.add(p.category);
      collectionTypes.add(p.collectionType);
    });
    
    console.log('\n📊 Summary:');
    console.log(`Total products: ${products.length}`);
    console.log(`Categories found: ${Array.from(categories).join(', ')}`);
    console.log(`CollectionTypes found: ${Array.from(collectionTypes).join(', ')}`);
    
    // Group by category
    const categoryGroups = {};
    products.forEach(p => {
      if (!categoryGroups[p.category]) {
        categoryGroups[p.category] = [];
      }
      categoryGroups[p.category].push(p);
    });
    
    console.log('\n📋 Products by Category:');
    Object.keys(categoryGroups).forEach(category => {
      console.log(`\n${category} (${categoryGroups[category].length} products):`);
      categoryGroups[category].forEach(p => {
        console.log(`  - ${p.title} (${p._id})`);
      });
    });
    
    // Check if we have men/women categories
    const menProducts = products.filter(p => p.category.toLowerCase().includes('men'));
    const womenProducts = products.filter(p => p.category.toLowerCase().includes('women'));
    
    console.log('\n👨 Men\'s Products:', menProducts.length);
    menProducts.forEach(p => console.log(`  - ${p.title} (${p._id})`));
    
    console.log('\n👩 Women\'s Products:', womenProducts.length);
    womenProducts.forEach(p => console.log(`  - ${p.title} (${p._id})`));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

checkCategories(); 