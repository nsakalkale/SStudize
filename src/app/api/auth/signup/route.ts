"use server";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/mongodb";
import Student from "../../../../models/Student";
import Teacher from "../../../../models/Teacher";

export async function POST(req: Request) {
  try {
    await connectDB();

    if (!req.headers.get("content-type")?.includes("application/json")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const { firstName, lastName, email, password, role } = await req.json();

    console.log("Received Data:", { firstName, lastName, email, role });

    if (!firstName || !lastName || !email || !password || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (!["student", "teacher"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const Collection = role === "student" ? Student : Teacher;
    const existingUser = await Collection.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        {
          error: `${
            role.charAt(0).toUpperCase() + role.slice(1)
          } already exists`,
        },
        { status: 400 }
      );
    }

    console.log("Creating New User...");

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new Collection({
      firstName: firstName, // Ensure field names match your schema
      lastName: lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log("User Created:", newUser);

    const token = jwt.sign(
      { id: newUser._id, role: role },
      "RANDOM_SECRET_KEY",
      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json(
      {
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} created`,
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
