const fetch = require('node-fetch');

async function debugAuth() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🔍 Debugging Authentication System...\n');

  // Test 1: Check if server is running
  console.log('1. Testing server connection...');
  try {
    const response = await fetch(`${baseUrl}`);
    if (response.ok) {
      console.log('✅ Server is running');
    } else {
      console.log('❌ Server responded with status:', response.status);
    }
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return;
  }

  // Test 2: Test registration
  console.log('\n2. Testing registration...');
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

    console.log('Registration status:', registerResponse.status);
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);

    if (registerResponse.ok) {
      console.log('✅ Registration successful');
    } else {
      console.log('❌ Registration failed:', registerData.error);
    }
  } catch (error) {
    console.log('❌ Registration error:', error.message);
  }

  // Test 3: Test login
  console.log('\n3. Testing login...');
  try {
    const loginResponse = await fetch(`${baseUrl}/api/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    });

    console.log('Login status:', loginResponse.status);
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);

    if (loginResponse.ok) {
      console.log('✅ Login successful');
      console.log('✅ User data:', loginData.user);
    } else {
      console.log('❌ Login failed:', loginData.error);
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
  }

  // Test 4: Test auth status check
  console.log('\n4. Testing auth status check...');
  try {
    const statusResponse = await fetch(`${baseUrl}/api/auth`, {
      method: 'GET'
    });

    console.log('Status check status:', statusResponse.status);
    const statusData = await statusResponse.json();
    console.log('Status check response:', statusData);

    if (statusResponse.ok) {
      console.log('✅ Auth status check successful');
    } else {
      console.log('❌ Auth status check failed (expected for no token):', statusData.error);
    }
  } catch (error) {
    console.log('❌ Auth status check error:', error.message);
  }

  console.log('\n🎉 Debug completed!');
}

debugAuth();
