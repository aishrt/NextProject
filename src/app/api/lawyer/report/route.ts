import Case from "@/models/case.model";
import ClaimFinancialModel from "@/models/claim_financial.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "@/app/api/notifications/add";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Request from "@/models/caseRequests.model";

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
        { status: "rejected" },
        { upsert: true }
      );
    }
    if (status == "accepted") {
      await ClaimFinancialModel.findOneAndUpdate(
        { case_id: findCase?._id },
        { status: status, lawyer: user?._id },
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
      title: `Financial Report ${
        status.charAt(0).toUpperCase() + status.slice(1)
      } by ${user?.name}`,
      description: `The financial report has been ${status} by ${user?.name}`,
      caseId: findCase?._id,
      addedBy: user?._id,
      listenTo: findCase?.expert ?? null,
      type: "lawyerStatus",
      role: "expert",
    }).then((res) => {});

    return NextResponse.json(
      {
        data: {
          message: `Report ${status} successfully`,
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
