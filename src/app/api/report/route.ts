import Case from "@/models/case.model";
import ClaimReportModel from "@/models/cer_Report.model";
import ClaimFinancialModel from "@/models/claim_financial.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "@/app/api/notifications/add";
import { Cases } from "@/types/Cases";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    let { status, report_id, reportType } = await req.json();
    // if (reportType == "evaluation") {
    // let ReportID = new mongoose.Types.ObjectId(report_id);
    let CaseDetails = await ClaimReportModel.findById(report_id).populate({
      path: "user_id",
      select: "firstName",
    });

    if (!CaseDetails) {
      return NextResponse.json(
        { message: "Report not found !!" },
        { status: 400 }
      );
    }
    await ClaimReportModel.updateOne(
      { _id: report_id },
      { status: status },
      { upsert: true }
    );

    let findCase = await Case.findOneAndUpdate(
      { _id: CaseDetails?.case_id },
      {
        evalReportStatus: status,
        status: status == "accept" ? "active" : status,
      },
      { upsert: true }
    );
    if (!findCase) {
      return NextResponse.json(
        { message: "Case not found !!" },
        { status: 400 }
      );
    }
    const notifications = [
      {
        title: `Financial Report ${
          status.charAt(0).toUpperCase() + status.slice(1)
        }ed by ${CaseDetails?.user_id?.firstName}`,
        description: `The financial report has been ${status}ed by ${CaseDetails?.user_id?.firstName}`,
        listenTo: findCase?.expert ?? null,
        role: "expert",
      },
      {
        title: `Financial Report ${
          status.charAt(0).toUpperCase() + status.slice(1)
        }ed`,
        description: `The financial report has been ${status}ed`,
        listenTo: CaseDetails?.user_id,
        role: "client",
      },
    ];

    notifications.forEach(({ title, description, listenTo, role }) => {
      PushNotifyUser({
        title,
        description,
        caseId: CaseDetails?.case_id,
        addedBy: CaseDetails?.user_id,
        listenTo,
        type: "reportStatus",
        role,
      }).then((res) => {});
    });

    // }
    // if (reportType == "financial") {
    //   let updateReport = await ClaimFinancialModel.updateOne(
    //     { _id: report_id },
    //     { status: status },
    //     { upsert: true, new: true }
    //   );
    //   let findCase = await Case.updateOne(
    //     { _id: report_id },
    //     { financialReportStatus: status },
    //     { upsert: true, new: true }
    //   );
    // }
    return NextResponse.json(
      {
        data: {
          message: "Report updated successfully",
          status: 200,
          success: true,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
        status: 500,
      },
      { status: 500 }
    );
  }
}
