import Case from "@/models/case.model";
import ClaimReportModel from "@/models/cer_Report.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "@/app/api/notifications/add";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();

    const server = await getServerSession(authOptions);
    let user = null;

    if (server && server.user) {
      user = server.user?._id;
    }

    const {
      questions,
      winning_percentage,
      // court_amount,
      // percentage_change,
      description,
      case_id,
    } = await req.json();
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

    const payload = {
      questions,
      winning_percentage: Number(winning_percentage),
      // court_amount: Number(court_amount),
      // percentage_change: Number(percentage_change),
      description,
      case_id,
      user_id: findCase?.user,
    };
    const findReport = await ClaimReportModel.findOne({ case_id });
    if (findReport) {
      await ClaimReportModel.findOneAndUpdate({ case_id }, payload, {
        new: true,
      });
    } else {
      await ClaimReportModel.create(payload);

      PushNotifyUser({
        title: `Case Evaluation Report Created`,
        description: `A case evaluation report has been successfully created.`,
        type: "evaluation",
        caseId: case_id,
        addedBy: user,
        listenTo: findCase?.user,
        role: "client",
      }).then((res: any) => {});
    }
    return NextResponse.json({
      data: {
        message: "Report added Successfully",
        status: 200,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error?.message || "Internal server error",
    });
  }
}
