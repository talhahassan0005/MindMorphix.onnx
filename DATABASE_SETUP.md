# Database Setup Guide

## MongoDB Configuration

### Option 1: Local MongoDB Installation

1. **Install MongoDB Community Edition:**
   - **Windows:** Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - **macOS:** `brew install mongodb-community`
   - **Linux:** Follow [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/)

2. **Start MongoDB Service:**
   - **Windows:** MongoDB runs as a service automatically
   - **macOS:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

3. **Create Environment File:**
   Create a `.env.local` file in the project root with:
   ```
   MONGODB_URI=mongodb://localhost:27017/mindmorphix
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   SESSION_SECRET=your-session-secret-key-change-this-in-production
   GEMINI_API_KEY=your-gemini-api-key-here
   NODE_ENV=development
   ```

### Option 2: MongoDB Atlas (Cloud Database)

1. **Create MongoDB Atlas Account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Sign up for a free account

2. **Create a Cluster:**
   - Choose "Free" tier
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Set Up Database Access:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Create a username and password
   - Select "Read and write to any database"

4. **Set Up Network Access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address

5. **Get Connection String:**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string

6. **Update Environment File:**
   Replace the MONGODB_URI in `.env.local` with your Atlas connection string:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mindmorphix?retryWrites=true&w=majority
   ```

### Option 3: Docker MongoDB

1. **Install Docker:**
   - Download from [Docker Desktop](https://www.docker.com/products/docker-desktop)

2. **Run MongoDB Container:**
   ```bash
   docker run -d --name mongodb -p 27017:27017 mongo:latest
   ```

3. **Use Local Connection String:**
   ```
   MONGODB_URI=mongodb://localhost:27017/mindmorphix
   ```

## Environment Variables

Create a `.env.local` file in the project root with these variables:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/mindmorphix

# JWT Secret for authentication (generate a random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Session Secret (generate a random string)
SESSION_SECRET=your-session-secret-key-change-this-in-production

# Gemini API Key (optional - for AI assistant)
GEMINI_API_KEY=your-gemini-api-key-here

# Environment
NODE_ENV=development

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-change-this-in-production
```

## Generate Secure Secrets

You can generate secure secrets using these commands:

```bash
# Generate JWT Secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Generate Session Secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Verify Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start the Development Server:**
   ```bash
   npm run dev
   ```

3. **Test Database Connection:**
   - Go to `/Detection` page
   - Try to register/login
   - Check if history is saved

## Troubleshooting

### Common Issues:

1. **"Database not configured" Error:**
   - Ensure `.env.local` file exists in project root
   - Check MONGODB_URI is correct
   - Restart the development server

2. **"Connection refused" Error:**
   - Ensure MongoDB is running
   - Check if port 27017 is available
   - Verify firewall settings

3. **"Authentication failed" Error:**
   - Check username/password in connection string
   - Ensure database user has correct permissions

4. **"Network timeout" Error:**
   - Check internet connection (for Atlas)
   - Verify IP whitelist (for Atlas)
   - Check firewall settings

### Testing Database Connection:

You can test the database connection by visiting:
- `/api/dbConnect` - Should return "Database connected successfully"
- `/api/register` - Should allow user registration
- `/api/auth` - Should allow login/logout

## Production Deployment

For production deployment:

1. **Use Environment Variables:**
   - Set environment variables in your hosting platform
   - Never commit `.env.local` to version control

2. **Use Strong Secrets:**
   - Generate new, strong secrets for production
   - Use different secrets for each environment

3. **Secure MongoDB:**
   - Use MongoDB Atlas or secure MongoDB instance
   - Enable authentication
   - Restrict network access

4. **Update Connection String:**
   - Use production MongoDB URI
   - Include authentication credentials
   - Add SSL/TLS configuration
