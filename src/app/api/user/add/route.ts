import User from "@/models/user.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const { firstName, lastName, email, phoneNumber, role } = await req.json();
    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { message: "Already exists user" },
        { status: 400 }
      );
    }
    await User.create({
      firstName,
      lastName,
      email,
      phoneNumber,
      role,
      password: "123@Expert",
    });
    return NextResponse.json({ message: "User created" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
