import fetch from 'node-fetch';

async function testCarouselAPI() {
  try {
    console.log("🔍 Testing carousel API...");
    
    const response = await fetch('http://localhost:5000/api/categories/public/carousel');
    const data = await response.json();
    
    console.log("📡 Carousel API Response status:", response.status);
    console.log("📦 Carousel API Response:", JSON.stringify(data, null, 2));
    
    if (data.success && data.data) {
      console.log(`\n📋 Total categories from carousel API: ${data.data.length}`);
      
      // Check for men and women categories
      const menCategories = data.data.filter(category => 
        category.displaySection && category.displaySection.toLowerCase() === 'men'
      );
      
      const womenCategories = data.data.filter(category => 
        category.displaySection && category.displaySection.toLowerCase() === 'women'
      );
      
      console.log(`👨 Men categories from carousel API: ${menCategories.length}`);
      menCategories.forEach(category => {
        console.log(`   - ${category.name} (displaySection: ${category.displaySection})`);
      });
      
      console.log(`👩 Women categories from carousel API: ${womenCategories.length}`);
      womenCategories.forEach(category => {
        console.log(`   - ${category.name} (displaySection: ${category.displaySection})`);
      });
      
      // Show all categories for debugging
      console.log("\n📋 All categories from carousel API:");
      data.data.forEach(category => {
        console.log(`   - ${category.name} (displaySection: ${category.displaySection})`);
      });
    }
    
  } catch (error) {
    console.error("❌ Error testing carousel API:", error);
  }
}

testCarouselAPI(); 