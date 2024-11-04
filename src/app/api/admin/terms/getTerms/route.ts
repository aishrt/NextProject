import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Terms from "@/models/terms.model";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let result;
    const type = req.nextUrl.searchParams.get("type")!;
    if (!type) {
      return NextResponse.json(
        { message: "Missing type parameter" },
        { status: 400 }
      );
    }
    if (type === "clientTerms") {
      result = await Terms.findOne({ userType: "Client" });
    }
    if (type === "expertTerms") {
      result = await Terms.findOne({ userType: "Expert" });
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
