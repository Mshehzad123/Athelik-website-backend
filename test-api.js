import fetch from 'node-fetch';

async function testAPI() {
  try {
    console.log("🔍 Testing API endpoint...");
    
    const response = await fetch('http://localhost:5000/api/public/products/public/all');
    const data = await response.json();
    
    console.log("📡 API Response status:", response.status);
    console.log("📦 API Response:", JSON.stringify(data, null, 2));
    
    if (data.success && data.data) {
      console.log(`\n📋 Total products from API: ${data.data.length}`);
      
      // Check for tank products
      const tankProducts = data.data.filter(product => 
        product.subCategory && product.subCategory.toLowerCase() === 'tanks'
      );
      
      console.log(`🏋️ Tank products from API: ${tankProducts.length}`);
      
      if (tankProducts.length > 0) {
        console.log("✅ Tank products found in API:");
        tankProducts.forEach(product => {
          console.log(`   - ${product.name} (${product.subCategory})`);
        });
      } else {
        console.log("❌ No tank products found in API response!");
      }
      
      // Show all products for debugging
      console.log("\n📋 All products from API:");
      data.data.forEach(product => {
        console.log(`   - ${product.name} (${product.subCategory})`);
      });
    }
    
  } catch (error) {
    console.error("❌ Error testing API:", error);
  }
}

testAPI(); 