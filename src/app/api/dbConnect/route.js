import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check if MongoDB URI is available
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({ 
        status: 'warning',
        message: 'MongoDB URI not configured. Please set MONGODB_URI environment variable.',
        connected: false 
      });
    }

    // Only attempt connection if URI is available
    const { MongoClient } = await import('mongodb');
    const client = new MongoClient(mongoUri);
    
    await client.connect();
    await client.db().admin().ping();
    await client.close();

    return NextResponse.json({ 
      status: 'success',
      message: 'Database connected successfully',
      connected: true 
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return NextResponse.json({ 
      status: 'error',
      message: 'Failed to connect to database',
      error: error.message,
      connected: false 
    }, { status: 500 });
  }
}
