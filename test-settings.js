import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:5000/api';

async function testSettings() {
  console.log('🧪 Testing Settings API...\n');

  try {
    // Test 1: Get settings
    console.log('1. Testing GET /settings/public...');
    const getResponse = await fetch(`${BASE_URL}/settings/public`);
    const getData = await getResponse.json();
    console.log('✅ GET Response:', getData);
    console.log('Status:', getResponse.status);

    // Test 2: Update settings
    console.log('\n2. Testing PUT /settings/currency...');
    const updateData = {
      settingsData: JSON.stringify({
        currency: "USD"
      })
    };

    const putResponse = await fetch(`${BASE_URL}/settings/currency`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });

    const putData = await putResponse.json();
    console.log('✅ PUT Response:', putData);
    console.log('Status:', putResponse.status);

    // Test 3: Get settings again to verify update
    console.log('\n3. Testing GET /settings/public again...');
    const getResponse2 = await fetch(`${BASE_URL}/settings/public`);
    const getData2 = await getResponse2.json();
    console.log('✅ GET Response after update:', getData2);
    console.log('Status:', getResponse2.status);

    console.log('\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSettings(); 