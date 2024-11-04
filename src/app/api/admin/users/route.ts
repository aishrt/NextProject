import User from "@/models/user.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    let data: any = await req.json();
    let FindUser = await User.findById(data?.id);
    if (!FindUser) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 400 }
      );
    }
    let UpdateUser = await User.updateOne({ _id: data?.id }, data);
    return NextResponse.json(
      {
        data: {
          message: "User updated successfully",
          success: true,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
