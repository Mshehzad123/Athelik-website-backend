// Test coupon API endpoints

async function testCouponAPI() {
  try {
    console.log('🧪 Testing coupon API endpoints...');
    
    // Test 1: Get coupons without auth (should fail)
    console.log('\n📡 Test 1: Get coupons without authentication');
    try {
      const response = await fetch('http://localhost:5000/api/coupons');
      console.log('Status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Response:', data);
      } else {
        const error = await response.json();
        console.log('❌ Expected error:', error);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }

    // Test 2: Validate coupon (public endpoint)
    console.log('\n📡 Test 2: Validate coupon (public endpoint)');
    try {
      const response = await fetch('http://localhost:5000/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: 'WELCOME10',
          cartTotal: 100,
          items: []
        })
      });
      console.log('Status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Response:', data);
      } else {
        const error = await response.json();
        console.log('❌ Error:', error);
      }
    } catch (error) {
      console.log('❌ Network error:', error.message);
    }

    // Test 3: Check if server is running
    console.log('\n📡 Test 3: Check server health');
    try {
      const response = await fetch('http://localhost:5000/api/health');
      console.log('Status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Server is running:', data);
      } else {
        console.log('❌ Server not responding properly');
      }
    } catch (error) {
      console.log('❌ Server not running:', error.message);
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCouponAPI(); 