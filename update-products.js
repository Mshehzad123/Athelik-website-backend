import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

async function updateProducts() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ecommerce_admin');
    console.log('✅ Connected to MongoDB');
    
    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products`);
    
    // Update products to have proper collectionType
    let menCount = 0;
    let womenCount = 0;
    
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      
      // Assign collectionType based on index (alternating men/women)
      const collectionType = i % 2 === 0 ? 'men' : 'women';
      
      await Product.findByIdAndUpdate(product._id, {
        collectionType: collectionType
      });
      
      if (collectionType === 'men') {
        menCount++;
      } else {
        womenCount++;
      }
      
      console.log(`✅ Updated: ${product.title} -> ${collectionType}`);
    }
    
    console.log('\n📊 Update Summary:');
    console.log(`Men's products: ${menCount}`);
    console.log(`Women's products: ${womenCount}`);
    console.log(`Total updated: ${products.length}`);
    
    // Verify the updates
    const menProducts = await Product.find({ collectionType: 'men' });
    const womenProducts = await Product.find({ collectionType: 'women' });
    
    console.log('\n✅ Verification:');
    console.log(`Men's products: ${menProducts.length}`);
    console.log(`Women's products: ${womenProducts.length}`);
    
    if (menProducts.length > 0) {
      console.log('\n👨 Sample Men\'s Products:');
      menProducts.slice(0, 3).forEach(p => console.log(`  - ${p.title} (${p._id})`));
    }
    
    if (womenProducts.length > 0) {
      console.log('\n👩 Sample Women\'s Products:');
      womenProducts.slice(0, 3).forEach(p => console.log(`  - ${p.title} (${p._id})`));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n✅ Database connection closed');
  }
}

updateProducts(); 