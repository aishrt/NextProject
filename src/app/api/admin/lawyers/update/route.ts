import Lawyer from "@/models/lawyer.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
      db.connectDB();
    let data = await req.json();
    let FindUser = await Lawyer.findById(data?.id);
    if (!FindUser) {
      return NextResponse.json(
        { message: "Lawyer not found", success: false },
        { status: 400 }
      );
    }
    let UpdateUser = await Lawyer.findByIdAndUpdate(data?.id, data);
    return NextResponse.json(
      {
        data: {
          message: "Lawyer updated successfully",
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
