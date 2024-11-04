import Expert from "@/models/expert.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let getExpert = await Expert.findOne({});
    return NextResponse.json(
      {
        success: true,
        data: getExpert,
        status: 200,
        message: "Expert data fetched",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
