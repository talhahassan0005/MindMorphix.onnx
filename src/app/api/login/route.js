import { getIronSession } from "iron-session";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // bcrypt for hashing password
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET;
const SESSION_SECRET = process.env.SESSION_SECRET;

// ✅ Session Options
const sessionOptions = {
  password: SESSION_SECRET || 'fallback-secret-for-build',
  cookieName: "userSession",  // Changed from vendorSession to userSession
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "Strict",
  },
};

export async function POST(req) {
  try {
    // Check if required environment variables are available
    if (!SECRET_KEY || !SESSION_SECRET) {
      return NextResponse.json({ 
        success: false, 
        message: "Server configuration incomplete. Please check environment variables." 
      }, { status: 503 });
    }

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

    // ✅ Generate JWT Token if passwords match
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "2h" });
    console.log("🔹 Generated Token:", token);

    // ✅ Create session
    let res = NextResponse.json({ success: true, message: "Login successful", token });

    const session = await getIronSession(req, res, sessionOptions);
    session.user = { id: user._id, email: user.email, role: user.role };  // Changed from vendor to user
    await session.save();

    // ✅ Set Token in HTTP-only Cookies
    res.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7200, // 2 hours
    });

    return res;
  } catch (error) {
    console.error("❌ Login Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
