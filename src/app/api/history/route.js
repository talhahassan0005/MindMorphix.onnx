import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

// Dynamic imports to avoid build-time issues
let dbConnect, User, DetectionHistory;

export async function POST(request) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    // Dynamically import database modules
    if (!dbConnect) {
      const dbModule = await import('@/utils/dbConnect');
      dbConnect = dbModule.default;
    }
    if (!DetectionHistory) {
      const historyModule = await import('@/models/DetectionHistory');
      DetectionHistory = historyModule.default;
    }

    const { imageData, result, processingTime, modelInfo } = await request.json();

    // Validate input
    if (!result || !imageData) {
      return NextResponse.json(
        { error: 'Detection result and image data are required' },
        { status: 400 }
      );
    }

    // Check if MongoDB URI is available
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        { error: 'Database connection not configured' },
        { status: 500 }
      );
    }

    await dbConnect();

    // Create new history entry
    const historyEntry = new DetectionHistory({
      userId: decoded.userId,
      imageData: imageData,
      result: {
        primaryDetection: result.primaryDetection,
        confidence: result.confidence,
        allProbabilities: result.allProbabilities,
        inferenceTime: result.inferenceTime
      },
      processingTime: processingTime || 0,
      modelInfo: modelInfo || {},
      timestamp: new Date()
    });

    await historyEntry.save();

    return NextResponse.json({
      success: true,
      historyId: historyEntry._id,
      message: 'Detection history saved successfully'
    });

  } catch (error) {
    console.error('History save error:', error);
    return NextResponse.json(
      { error: 'Failed to save detection history' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    // Dynamically import database modules
    if (!dbConnect) {
      const dbModule = await import('@/utils/dbConnect');
      dbConnect = dbModule.default;
    }
    if (!DetectionHistory) {
      const historyModule = await import('@/models/DetectionHistory');
      DetectionHistory = historyModule.default;
    }

    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;

    // Get user's detection history
    const history = await DetectionHistory.find({ userId: decoded.userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .select('-imageData'); // Exclude large image data from list

    // Get total count for pagination
    const total = await DetectionHistory.countDocuments({ userId: decoded.userId });

    return NextResponse.json({
      success: true,
      history,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('History retrieval error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve detection history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    const { searchParams } = new URL(request.url);
    const historyId = searchParams.get('id');

    if (!historyId) {
      return NextResponse.json(
        { error: 'History ID is required' },
        { status: 400 }
      );
    }

    // Dynamically import database modules
    if (!dbConnect) {
      const dbModule = await import('@/utils/dbConnect');
      dbConnect = dbModule.default;
    }
    if (!DetectionHistory) {
      const historyModule = await import('@/models/DetectionHistory');
      DetectionHistory = historyModule.default;
    }

    await dbConnect();

    // Delete the specific history entry (only if it belongs to the user)
    const deletedHistory = await DetectionHistory.findOneAndDelete({
      _id: historyId,
      userId: decoded.userId
    });

    if (!deletedHistory) {
      return NextResponse.json(
        { error: 'History entry not found or access denied' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'History entry deleted successfully'
    });

  } catch (error) {
    console.error('History deletion error:', error);
    return NextResponse.json(
      { error: 'Failed to delete history entry' },
      { status: 500 }
    );
  }
}
