import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || 'fallback-secret-for-build';

export async function POST(req) {
  try {
    // Check if MongoDB URI is available
    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
      return NextResponse.json({ 
        success: false,
        message: 'Database not configured. Please set MONGODB_URI environment variable.',
      }, { status: 503 });
    }

    // Only import and connect if URI is available
    const dbConnect = (await import("@/utils/dbConnect")).default;
    const User = (await import("@/models/User")).default;
    
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }
    
    // Compare the entered password with the hashed password stored in the database
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return NextResponse.json({ success: false, message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT Token if passwords match
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "2h" });

    // Create response with token
    const response = NextResponse.json({ 
      success: true, 
      message: "Login successful", 
      user: { id: user._id, email: user.email, name: user.name }
    });

    // Set Token in HTTP-only Cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7200, // 2 hours
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
