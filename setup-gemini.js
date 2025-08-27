const fs = require('fs');
const path = require('path');

console.log('🔧 Gemini API Setup Helper\n');

const envPath = path.join(__dirname, '.env.local');

// Check if .env.local exists
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local file not found!');
  console.log('Please create a .env.local file with your environment variables.');
  process.exit(1);
}

// Read current .env.local
let envContent = fs.readFileSync(envPath, 'utf8');

// Check if GEMINI_API_KEY is already set
if (envContent.includes('GEMINI_API_KEY=your-gemini-api-key-here')) {
  console.log('⚠️  GEMINI_API_KEY is set to placeholder value');
  console.log('\n📋 To get a Gemini API key:');
  console.log('1. Go to https://aistudio.google.com/');
  console.log('2. Sign in with your Google account');
  console.log('3. Click "Create API Key"');
  console.log('4. Copy the generated API key');
  console.log('\n🔑 Then update your .env.local file:');
  console.log('GEMINI_API_KEY=your-actual-api-key-here');
  console.log('\n💡 Replace "your-actual-api-key-here" with your real API key');
} else if (envContent.includes('GEMINI_API_KEY=')) {
  console.log('✅ GEMINI_API_KEY is configured');
  console.log('If you\'re still having issues, make sure the API key is valid');
} else {
  console.log('❌ GEMINI_API_KEY not found in .env.local');
  console.log('\n📋 Add this line to your .env.local file:');
  console.log('GEMINI_API_KEY=your-actual-api-key-here');
}

console.log('\n🔍 Current .env.local contents:');
console.log('---');
console.log(envContent);
console.log('---');
