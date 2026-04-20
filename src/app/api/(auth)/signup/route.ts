import { type NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import UserModel from "@/lib/models/user";
import { generateTokens, hashPassword } from "@/lib/auth/jwt";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) return NextResponse.json({ error: "name, email and password are required." }, { status: 400 });

    if (password.length < 6) return NextResponse.json({ error: "Password must be at least 6 characters log." }, { status: 400 });

    const existingUser = await UserModel.findOne({ email: email })
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists." }, { status: 409 });
    }

    const hashedPassword = await hashPassword(password);

    const user = new UserModel({
      name: name.trim(),
      email: email,
      password: hashedPassword,
      role: role || "viewer",
    })

    await user.save()

    const tokens = generateTokens({
      _id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Return user data and tokens
    const userData = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }

    // Set cookies for tokens
    const cookieStore = await cookies();
    cookieStore.set("accessToken", tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: '/',
    })
    cookieStore.set("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: '/',
    })

    return NextResponse.json(
      {
        user: userData,
        tokens,
        message: "Registration successful",
      },
      { status: 201 },
    )


  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}