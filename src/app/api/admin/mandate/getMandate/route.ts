import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import Mandate from "@/models/mandate.model";


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
    if (type === "clientMandate") {
      result = await Mandate.findOne({ userType: "Client" });
    }
    if (type === "expertMandate") {
      result = await Mandate.findOne({ userType: "Expert" });
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
