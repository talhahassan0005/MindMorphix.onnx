const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    console.log('Please add your MongoDB Atlas connection string to .env.local');
    return;
  }

  console.log('🔍 Testing MongoDB connection...');
  console.log('URI:', uri.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

  try {
    const client = new MongoClient(uri);
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    const db = client.db();
    const collections = await db.listCollections().toArray();
    console.log('📊 Available collections:', collections.map(c => c.name));
    
    await client.close();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Check your MongoDB Atlas connection string');
    console.log('2. Ensure your IP is whitelisted in MongoDB Atlas');
    console.log('3. Verify username and password are correct');
  }
}

testConnection();
