import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { UsersCollection } from "@/lib/models/UserModel";
import { ObjectId } from "mongodb";

export async function GET(req: Request) {
  try {
    const decoded: any = verifyToken(req);

    if (!decoded) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const users = await UsersCollection();

    const user = await users.findOne(
      { _id: new ObjectId(decoded.id) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
