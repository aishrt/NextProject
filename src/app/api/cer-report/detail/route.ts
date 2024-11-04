import ClaimReportModel from "@/models/cer_Report.model";
import User from "@/models/user.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let id: any = req.nextUrl.searchParams.get("case_id");

    let GetReports = await ClaimReportModel.findOne({
      case_id: id,
    }).populate("case_id");
    return NextResponse.json({
      data: {
        currentPage: 1,
        totalEntries: GetReports?.length,
        data: GetReports,
        status: 200,
        message: "Reports fetched Successfully",
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error?.message || "Internal Server Error",
      status: 400,
    });
  }
}
