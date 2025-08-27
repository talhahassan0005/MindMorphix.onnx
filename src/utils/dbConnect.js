import mongoose from 'mongoose';

// Load MongoDB URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

// Validate environment variable
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local\n' +
    'Format for Atlas: mongodb+srv://<Fast>:<fast>@cluster.example.net/yourdb\n' +
    'Format for Local: mongodb://localhost:27017/Fast'
  );
}

/**
 * Global cache for Mongoose connection to prevent
 * multiple connections during development hot-reload
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Establishes connection to MongoDB
 * @returns {Promise<mongoose.Connection>}
 */
async function dbConnect() {
  // Return cached connection if available
  if (cached.conn) {
    console.log('📦 Using existing database connection');
    return cached.conn;
  }

  // Create new connection promise if none exists
  if (!cached.promise) {
    const options = {
      bufferCommands: false,          // Disable command buffering
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 30000,        // Close idle connections after 30s
      maxPoolSize: 10,               // Maximum connection pool size
      family: 4,                     // Use IPv4, skip IPv6
    };

    console.log('🔌 Establishing new database connection');
    
    cached.promise = mongoose.connect(MONGODB_URI, options)
      .then((mongooseInstance) => {
        console.log('✅ Database connected successfully');
        return mongooseInstance;
      })
      .catch((error) => {
        console.error('❌ Database connection failed:', error.message);
        // Convert to more user-friendly error
        throw new Error(
          `Failed to connect to MongoDB: ${error.message}\n` +
          'Please check:\n' +
          '1. Your internet connection\n' +
          '2. MongoDB Atlas IP whitelist settings\n' +
          '3. Database credentials in .env.local'
        );
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on failure to allow retries
    cached.promise = null;
    console.error('💥 Connection attempt failed:', error);
    throw error;
  }

  return cached.conn;
}

// Debugging (enable in development)
if (process.env.NODE_ENV === 'development') {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    console.log(`🗄️ ${collectionName}.${method}`, {
      query,
      doc
    });
  });
}

// Connection events for better monitoring
mongoose.connection.on('connected', () => {
  console.log('🟢 Mongoose default connection open');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 Mongoose default connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🟡 Mongoose default connection disconnected');
});

// Close connection on process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('⏏️ Mongoose default connection disconnected through app termination');
  process.exit(0);
});

export default dbConnect;