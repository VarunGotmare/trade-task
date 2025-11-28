import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { UsersCollection } from "@/lib/models/UserModel";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const users = await UsersCollection();

    const existing = await users.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await users.insertOne({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "User registered successfully",
      userId: newUser.insertedId,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
