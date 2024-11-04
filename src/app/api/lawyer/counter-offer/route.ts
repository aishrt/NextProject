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
    let { counterAmount,requestId } = await req.json();

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

    await Request.findOneAndUpdate(
      { _id: requestId },
      { status: "counterOffer",counterAmount },
      { upsert: true }
    );

    
    PushNotifyUser({
      title: `Couter Offer Request By ${user?.name}`,
      description: `Couter offer request by ${user?.name}`,
      caseId: findCase?._id,
      addedBy: user?._id,
      listenTo: findCase?.expert ?? null,
      type: "counterOffer",
      role: "expert",
    }).then((res) => {});

    return NextResponse.json(
      {
        data: {
          message: `Request sent successfully`,
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
