import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    let { id } = await req.json();
    let getLawyer = await Lawyer.findOne({ _id: id });
    return NextResponse.json(
      {
        success: true,
        data: getLawyer,
        status: 200,
        message: "Lawyer data fetched",
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
