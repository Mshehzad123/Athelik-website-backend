import fetch from 'node-fetch';

async function testServer() {
  try {
    console.log("🔍 Testing backend server...");
    
    // Test health endpoint
    const healthResponse = await fetch('http://localhost:5000/api/health');
    console.log("📡 Health check status:", healthResponse.status);
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Server is running:", healthData);
      
      // Test products endpoint
      console.log("\n🔍 Testing products endpoint...");
      const productsResponse = await fetch('http://localhost:5000/api/public/products/public/all');
      console.log("📡 Products API status:", productsResponse.status);
      
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        console.log(`📦 Products API returned ${productsData.data.length} products`);
        
        // Check for tank products
        const tankProducts = productsData.data.filter(product => 
          product.subCategory && product.subCategory.toLowerCase() === 'tanks'
        );
        
        console.log(`🏋️ Tank products from server API: ${tankProducts.length}`);
        
        if (tankProducts.length > 0) {
          console.log("✅ Tank products found in server API:");
          tankProducts.forEach(product => {
            console.log(`   - ${product.name} (${product.subCategory})`);
          });
        } else {
          console.log("❌ No tank products found in server API!");
        }
      } else {
        console.log("❌ Products API failed:", productsResponse.status);
      }
    } else {
      console.log("❌ Server health check failed:", healthResponse.status);
    }
    
  } catch (error) {
    console.error("❌ Error testing server:", error.message);
  }
}

testServer(); 