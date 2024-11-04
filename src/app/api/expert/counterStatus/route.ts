import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "@/app/api/notifications/add";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Request from "@/models/caseRequests.model";
import Case from "@/models/case.model";
import ClaimFinancialModel from "@/models/claim_financial.model";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();

    const server: any = await getServerSession(authOptions);
    const user = server?.user || null;
    let { status, requestId } = await req.json();

    if (!requestId) {
      return NextResponse.json(
        { message: "Request Id not provided" },
        { status: 400 }
      );
    }

    let findReq = await Request.findById(requestId);

    if (!findReq) {
      return NextResponse.json(
        { message: "Request not found !!" },
        { status: 400 }
      );
    }
    let findCase = await Case.findById(findReq?.caseId);

    if (!findCase) {
      return NextResponse.json(
        { message: "Case not found !!" },
        { status: 400 }
      );
    }

    const data = await ClaimFinancialModel.findOne({
      case_id: findReq?.caseId,
    });

    let findReqStatus = await Request.find({ caseId: findReq?.caseId });

    if (findReqStatus.some((request) => request.status === "accepted")) {
      return NextResponse.json(
        { message: "Request already accepted!" },
        { status: 400 }
      );
    }

    const findRequests = findReqStatus.filter(
      (val: any) => val?._id.toString() !== requestId.toString()
    );

    if (status == "rejected") {
      await Request.findOneAndUpdate(
        { _id: requestId },
        { status: "pending" },
        { upsert: true }
      );
    }

    const amount =
      (Number(data?.platformAmount) * Number(findReq?.counterAmount)) / 100;
    const totalAmt = Number(data?.platformAmount) - amount;

    if (status == "accepted") {
      const payload = {
        lawyerCommission: findReq?.counterAmount,
        lawyerAmount: amount,
        remainingPlatformAmount: totalAmt,
        status: status,
      };
      await ClaimFinancialModel.findOneAndUpdate(
        { case_id: findCase?._id },
        payload,
        { upsert: true }
      );

      await Case.findOneAndUpdate(
        { _id: findCase?._id },
        {
          lawyer: user?._id,
          requestStatus: status,
          isLaywerAssigned: true,
          status: "active",
        },
        { upsert: true }
      );

      await Request.findOneAndUpdate(
        { _id: requestId },
        { status: "accepted" },
        { upsert: true }
      );

      for (const val of findRequests) {
        if (val) {
          await Request.findOneAndUpdate(
            { _id: val?._id },
            { status: "Not applicable" },
            { new: true }
          );
        }
      }
    }

    PushNotifyUser({
      title: `Counter amount ${status} by ${user?.firstName}`,
      description: `Counter amount ${status} by ${user?.firstName}`,
      caseId: findReq?.caseId,
      addedBy: user?._id,
      listenTo: findReq?.lawyer,
      type: "counterStatus",
      role: "lawyer",
    }).then((res) => {});

    return NextResponse.json(
      {
        data: {
          message: `Counter offer ${status} successfuly !`,
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
