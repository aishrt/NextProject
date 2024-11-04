import Case from "@/models/case.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const { case_id } = await req.json();
    let findCase = await Case.findOne({ _id: case_id });
    if (!findCase) {
      return NextResponse.json({
        data: {
          status: 400,
          message: "Case not found",
        },
      });
    }
    let UpdateCase = await Case.updateOne(
      { _id: case_id },
      { isEvalReport: true },
      { new: true }
    );

    return NextResponse.json({
      data: {
        message: "Report sent Successfully",
        status: 200,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error?.message || "Internal server error",
    });
  }
}
