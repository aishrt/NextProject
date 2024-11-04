import Case from "@/models/case.model";
import ClaimReportModel from "@/models/cer_Report.model";
import ClaimFinancialModel from "@/models/claim_financial.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let status = req.nextUrl.searchParams.get("status");
    let user_id: any = req.nextUrl.searchParams.get("user_id");
    let role: any = req.nextUrl.searchParams.get("role");

    let user = user_id;
    let page: string | null = req.nextUrl.searchParams.get("page");

    page = !!page ? page : "1";
    const totalCase = await ClaimReportModel.countDocuments();
    const totalPages = Math.ceil(totalCase / 10);
    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;

    let query: any = {};
    if (status) {
      if (status == "purchased") {
        query["isPurchased"] = true;
      } else {
        query["status"] = status;
      }
    }
    if (user_id) {
      query["user_id"] = user_id;
    }

    let findReports = await ClaimReportModel.find(query)
      .sort({ createdAt: -1 })

      .populate({ path: "case_id", model: Case })
      .limit(10)
      .skip(start * 10)
      .exec();
    let total = await ClaimReportModel.countDocuments(query);

    return NextResponse.json(
      {
        data: {
          data: findReports,
          currentPage: pageNumber,
          totalEntries: total,
          message: "Reports fetched successfully",
          success: true,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error, "errorrrr");
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
        status: 500,
      },
      { status: 500 }
    );
  }
}
