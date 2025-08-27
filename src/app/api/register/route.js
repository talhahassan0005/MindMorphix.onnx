import { NextResponse } from 'next/server';
import bcrypt from "bcryptjs";

// Use dbConnect inside the function
export async function POST(request) {
  try {
    // Check if MongoDB URI is available
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({ 
        error: 'Database not configured. Please set MONGODB_URI environment variable.',
      }, { status: 503 });
    }

    // Only import and connect if URI is available
    const dbConnect = (await import("@/utils/dbConnect")).default;
    const User = (await import("@/models/User")).default;
    
    await dbConnect();  // ✅ Ensure DB is connected

    const body = await request.json();
    console.log("Registration request body:", body);
    
    const { name, email, password } = body;

    // ✅ Input validation
    if (!name || !email || !password) {
      console.log("Missing fields:", { name: !!name, email: !!email, password: !!password });
      return NextResponse.json({
        error: "All fields are required",
      }, { status: 400 });
    }

    // ✅ Basic email format check
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: "Invalid email format",
      }, { status: 400 });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        error: "User with this email already exists",
      }, { status: 409 });
    }

    // ✅ Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // ✅ Create user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Registration error:", error);
    return NextResponse.json({
      error: "Internal server error",
    }, { status: 500 });
  }
}
