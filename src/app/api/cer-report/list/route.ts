import ClaimReportModel from "@/models/cer_Report.model";
import User from "@/models/user.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let id: any = req.nextUrl.searchParams.get("user_id");
    let page: any = req.nextUrl.searchParams.get("page");
    const ObjectId = new mongoose.Types.ObjectId(id);

    let FIndUser = await User.findOne({ _id: id });
    if (!FIndUser) {
      return NextResponse.json({
        data: {
          message: "User not found",
          status: 400,
        },
      });
    }
    const totalCase = await ClaimReportModel.countDocuments();
    const totalPages = Math.ceil(totalCase / 10);
    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;
    let GetReports = await ClaimReportModel.find({
      user_id: id,
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
