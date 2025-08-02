import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api';

// Test shipping API endpoints
async function testShippingAPI() {
  console.log('🚀 Testing Shipping API...\n');

  try {
    // Test 1: Create a shipping rule
    console.log('1. Creating shipping rule...');
    const createResponse = await fetch(`${API_BASE_URL}/shipping`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
      },
      body: JSON.stringify({
        name: 'US Standard Shipping',
        region: 'US',
        minWeight: 0,
        maxWeight: 10,
        minOrderAmount: 0,
        maxOrderAmount: 1000,
        shippingCost: 9.99,
        freeShippingAt: 50,
        deliveryDays: 3,
        isActive: true,
        priority: 1
      })
    });

    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log('✅ Shipping rule created:', createData.data.name);
    } else {
      console.log('❌ Failed to create shipping rule:', createResponse.status);
    }

    // Test 2: Get all shipping rules
    console.log('\n2. Getting shipping rules...');
    const getResponse = await fetch(`${API_BASE_URL}/shipping`, {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // Replace with actual token
      }
    });

    if (getResponse.ok) {
      const getData = await getResponse.json();
      console.log('✅ Found', getData.data.length, 'shipping rules');
    } else {
      console.log('❌ Failed to get shipping rules:', getResponse.status);
    }

    // Test 3: Calculate shipping (public endpoint)
    console.log('\n3. Calculating shipping for $30 order...');
    const calculateResponse = await fetch(`${API_BASE_URL}/shipping/public/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subtotal: 30,
        region: 'US'
      })
    });

    if (calculateResponse.ok) {
      const calculateData = await calculateResponse.json();
      console.log('✅ Shipping calculation:', {
        shippingCost: calculateData.shippingCost,
        isFreeShipping: calculateData.isFreeShipping,
        remainingForFreeShipping: calculateData.remainingForFreeShipping
      });
    } else {
      console.log('❌ Failed to calculate shipping:', calculateResponse.status);
    }

    // Test 4: Calculate shipping for free shipping threshold
    console.log('\n4. Calculating shipping for $60 order (should be free)...');
    const calculateFreeResponse = await fetch(`${API_BASE_URL}/shipping/public/calculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subtotal: 60,
        region: 'US'
      })
    });

    if (calculateFreeResponse.ok) {
      const calculateFreeData = await calculateFreeResponse.json();
      console.log('✅ Free shipping calculation:', {
        shippingCost: calculateFreeData.shippingCost,
        isFreeShipping: calculateFreeData.isFreeShipping,
        remainingForFreeShipping: calculateFreeData.remainingForFreeShipping
      });
    } else {
      console.log('❌ Failed to calculate free shipping:', calculateFreeResponse.status);
    }

    // Test 5: Get active shipping rules (public endpoint)
    console.log('\n5. Getting active shipping rules...');
    const activeResponse = await fetch(`${API_BASE_URL}/shipping/public/active`);

    if (activeResponse.ok) {
      const activeData = await activeResponse.json();
      console.log('✅ Found', activeData.data.length, 'active shipping rules');
    } else {
      console.log('❌ Failed to get active shipping rules:', activeResponse.status);
    }

  } catch (error) {
    console.error('❌ Error testing shipping API:', error.message);
  }
}

// Run the test
testShippingAPI(); 