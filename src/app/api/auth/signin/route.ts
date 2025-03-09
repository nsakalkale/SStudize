"use server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/mongodb";
import Student from "../../../../models/Student";
import Teacher from "../../../../models/Teacher";

const JWT_SECRET = "RANDOM_SECRET_KEY"; // Hardcoded Secret Key

export async function POST(req: Request) {
  try {
    await connectDB();

    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!["student", "teacher"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const Collection = role === "student" ? Student : Teacher;
    const user = await Collection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id, role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json(
      {
        message: "Login successful",
        token,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
