import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import PrivacyPolicy from "@/models/privacyPolicy.model";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let result;
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type")!;    
    if (!type) {
      return NextResponse.json(
        { message: "Missing type parameter" },
        { status: 400 }
      );
    }
    if (type === "clientPrivacyPolicy") {
      result = await PrivacyPolicy.findOne({ userType: "Client" });
    }
    if (type === "expertPrivacyPolicy") {
      result = await PrivacyPolicy.findOne({ userType: "Expert" });
    }
    return NextResponse.json(
      {
        message: "Data retrieved Successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
