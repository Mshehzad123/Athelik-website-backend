import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api';

// Test bundle creation
async function testBundleCreation() {
  try {
    console.log('🧪 Testing bundle creation...');
    
    const bundleData = {
      name: "Test Bundle",
      description: "A test bundle for testing purposes",
      bundlePrice: 99.99,
      originalPrice: 149.98,
      products: [], // You'll need to add actual product IDs here
      isActive: true
    };

    const response = await fetch(`${API_BASE_URL}/bundles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
      },
      body: JSON.stringify(bundleData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Bundle created successfully:', result);
      return result.data._id;
    } else {
      const error = await response.json();
      console.error('❌ Bundle creation failed:', error);
    }
  } catch (error) {
    console.error('❌ Error testing bundle creation:', error);
  }
}

// Test bundle discount calculation
async function testBundleDiscountCalculation() {
  try {
    console.log('🧪 Testing bundle discount calculation...');
    
    const cartItems = [
      {
        productId: "PRODUCT_ID_1", // Replace with actual product ID
        price: 29.99,
        quantity: 1
      },
      {
        productId: "PRODUCT_ID_2", // Replace with actual product ID
        price: 49.99,
        quantity: 1
      }
    ];

    const response = await fetch(`${API_BASE_URL}/bundles/public/calculate-discount`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ cartItems })
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Bundle discount calculation successful:', result);
    } else {
      const error = await response.json();
      console.error('❌ Bundle discount calculation failed:', error);
    }
  } catch (error) {
    console.error('❌ Error testing bundle discount calculation:', error);
  }
}

// Test getting active bundles
async function testGetActiveBundles() {
  try {
    console.log('🧪 Testing get active bundles...');
    
    const response = await fetch(`${API_BASE_URL}/bundles/public/active`);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Get active bundles successful:', result);
    } else {
      const error = await response.json();
      console.error('❌ Get active bundles failed:', error);
    }
  } catch (error) {
    console.error('❌ Error testing get active bundles:', error);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting bundle API tests...\n');
  
  await testGetActiveBundles();
  console.log('');
  
  await testBundleDiscountCalculation();
  console.log('');
  
  // Uncomment the line below to test bundle creation (requires authentication)
  // await testBundleCreation();
  
  console.log('🏁 Bundle API tests completed!');
}

runTests().catch(console.error); 