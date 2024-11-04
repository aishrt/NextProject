import Case from "@/models/case.model";
import ClaimFinancialModel from "@/models/claim_financial.model";
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
    let role;

    if (server && server.user) {
      user = server.user?._id;
      role = server.user?.role;
    }

    const {
      case_id,
      minimum_amount,
      platform_commission,
      platform_commission_description,
      minimum_settle_amount_description,
      managerSignature,
      clientSignature,
      checked,
      clientAmount,
      platformAmount,
      lawyerAmount,
      lawyer_description,
      lawyerCommission,
      remainingPlatformAmount,

      lawyerManagerSignature,
      lawyerSignature,
      verifyReport,
    } = await req.json();
    const Findcase = await Case.findOne({ _id: case_id });
    if (!Findcase) {
      return NextResponse.json({
        data: {
          satus: 400,
          message: "Case not found",
        },
      });
    }

    const payload = {
      case_id: case_id,
      minimum_amount: minimum_amount && parseInt(minimum_amount),
      platform_commission: platform_commission && parseInt(platform_commission),
      platform_commission_description,
      minimum_settle_amount_description,
      user_id: Findcase?.user,
      managerSignature,
      clientSignature,
      checked,
      clientAmount,
      platformAmount,
      lawyerAmount,
      lawyer_description,
      lawyerCommission,
      remainingPlatformAmount,
      lawyerManagerSignature,
      lawyerSignature,
      verifyReport,
    };
    if (role == "expert" && managerSignature) {
      let UpdateCase = await Case.updateOne(
        { _id: case_id },
        { isFinancialReport: true },
        { new: true }
      );
      PushNotifyUser({
        title: `Case Financial Report Created`,
        description: `A case financial report has been successfully created`,
        type: "financial",
        caseId: case_id,
        addedBy: user,
        listenTo: Findcase?.user,
        role: "client",
      }).then((res: any) => {});
    }

    if (role == "expert" && lawyerManagerSignature) {
      let UpdateCase = await Case.updateOne(
        { _id: case_id },
        { lawyerFinancialReport: true },
        { new: true }
      );
    }

    const findFinancial = await ClaimFinancialModel.findOne({ case_id });
    if (findFinancial) {
      await ClaimFinancialModel.findOneAndUpdate({ case_id }, payload, {
        new: true,
      });
    } else {
      await ClaimFinancialModel.create(payload);
    }
    return NextResponse.json({
      data: {
        status: 200,
        message: "Report Created Successfully",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
