#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 MindMorphix Database Setup\n');

// Generate secure secrets
const jwtSecret = crypto.randomBytes(64).toString('hex');
const sessionSecret = crypto.randomBytes(32).toString('hex');
const nextAuthSecret = crypto.randomBytes(32).toString('hex');

// Environment variables template
const envContent = `# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mindmorphix

# JWT Secret for authentication
JWT_SECRET=${jwtSecret}

# Session Secret
SESSION_SECRET=${sessionSecret}

# Gemini API Key (optional - for AI assistant)
GEMINI_API_KEY=your-gemini-api-key-here

# Environment
NODE_ENV=development

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=${nextAuthSecret}
`;

// Check if .env.local already exists
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists. Skipping creation.');
  console.log('   If you need to update it, please edit it manually.\n');
} else {
  // Create .env.local file
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with secure secrets\n');
}

console.log('📋 Next Steps:');
console.log('1. Install MongoDB (if not already installed)');
console.log('   - Windows: Download from https://www.mongodb.com/try/download/community');
console.log('   - macOS: brew install mongodb-community');
console.log('   - Linux: Follow MongoDB installation guide');
console.log('');
console.log('2. Start MongoDB service');
console.log('   - Windows: MongoDB runs as a service automatically');
console.log('   - macOS: brew services start mongodb-community');
console.log('   - Linux: sudo systemctl start mongod');
console.log('');
console.log('3. Install project dependencies');
console.log('   npm install');
console.log('');
console.log('4. Start the development server');
console.log('   npm run dev');
console.log('');
console.log('5. Test the application');
console.log('   - Visit http://localhost:3000/Detection');
console.log('   - Try uploading an MRI image');
console.log('   - Register/login to save detection history');
console.log('');
console.log('📖 For detailed setup instructions, see DATABASE_SETUP.md');
console.log('');
console.log('🔧 Alternative: Use MongoDB Atlas (cloud database)');
console.log('   - Visit https://www.mongodb.com/atlas');
console.log('   - Create a free account and cluster');
console.log('   - Update MONGODB_URI in .env.local with your connection string');
