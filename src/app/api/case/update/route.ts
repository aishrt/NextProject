import Case from "@/models/case.model";
import User from "@/models/user.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "../../notifications/add";
import { getServerSession } from "next-auth";

import { authOptions } from "@/server/auth";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const server: any = await getServerSession(authOptions);
    let user = null;
    if (server && server.user) {
      user = server.user;
    }
    let { case_id, isAccepted } = await req.json();

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
      {
        isAccepted,
        caseType: isAccepted == "true" ? "litigation" : "preLitigation",
      },
      { upsert: true, new: true }
    );
    PushNotifyUser({
      title: `Case Offer ${isAccepted ? "Accepted" : "Rejected"} by Client`,
      description: `Case Offer ${
        isAccepted ? "Accepted" : "Rejected"
      } by Client`,
      role: "expert",
      caseId: findCase?._id,
      addedBy: user?._id,
      type: "caseOffer",
    }).then((res: any) => {});
    return NextResponse.json({
      data: {
        status: 200,
        message: "Case offer updated Successfully",
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      message: error?.message || "Internal Server error",
      status: 400,
    });
  }
}
