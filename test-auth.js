const fetch = require('node-fetch');

async function testAuth() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing Authentication System...\n');

  // Test 1: Register a new user
  console.log('1. Testing Registration...');
  try {
    const registerResponse = await fetch(`${baseUrl}/api/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (registerResponse.ok) {
      console.log('✅ Registration successful');
    } else {
      const error = await registerResponse.json();
      console.log('❌ Registration failed:', error.error);
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }

  // Test 2: Login
  console.log('\n2. Testing Login...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    if (loginResponse.ok) {
      console.log('✅ Login successful');
      const cookies = loginResponse.headers.get('set-cookie');
      if (cookies) {
        console.log('✅ Auth cookie set');
      }
    } else {
      const error = await loginResponse.json();
      console.log('❌ Login failed:', error.error);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }

  // Test 3: Check auth status
  console.log('\n3. Testing Auth Status...');
  try {
    const statusResponse = await fetch(`${baseUrl}/api/auth`, {
      method: 'GET',
      headers: { 'Cookie': 'auth-token=test' }
    });

    if (statusResponse.ok) {
      console.log('✅ Auth status check successful');
    } else {
      console.log('❌ Auth status check failed (expected for invalid token)');
    }
  } catch (error) {
    console.log('❌ Auth status error:', error.message);
  }

  console.log('\n🎉 Authentication tests completed!');
}

testAuth();
