import Expert from "@/models/expert.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    let data = await req.json();
    let FindManager = await Expert.findById(data?.id);
    if (!FindManager) {
      return NextResponse.json(
        { message: "Expert not found", success: false },
        { status: 400 }
      );
    }
    let UpdateExpert = await Expert.findByIdAndUpdate(data?.id, data);
    return NextResponse.json(
      {
        data: {
          message: "Expert updated successfully",
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
