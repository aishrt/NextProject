import User from "@/models/user.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const { email } = await req.json();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "No users found with this email" },
        { status: 400 }
      );
    }
    if (user) {
    
    }
    return NextResponse.json({ message: "Token created" });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
