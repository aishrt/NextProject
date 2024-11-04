import Case from "@/models/case.model";
import Lawyer from "@/models/lawyer.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "../../notifications/add";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Request from "@/models/caseRequests.model";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const server: any = await getServerSession(authOptions);
    const user = server.user || null;

    let { caseId, lawyerIds } = await req.json();

    let findCase = await Case.findOne({ _id: caseId });
    if (!findCase) {
      return NextResponse.json(
        {
          message: "Case not found",
          success: false,
        },
        { status: 400 }
      );
    }
    let findLawyer = await Lawyer.find({ _id: { $in: lawyerIds } });

    if (findLawyer.length === 0) {
      return NextResponse.json(
        {
          message: "No lawyers found with the provided IDs",
        },
        { status: 400 }
      );
    }

    const foundIds = findLawyer.map((lawyer) => lawyer._id.toString());
    const notFoundIds = lawyerIds.filter(
      (id: string) => !foundIds.includes(id)
    );

    if (notFoundIds.length > 0) {
      return NextResponse.json(
        {
          message:
            "Lawyers with these IDs do not exist: " + notFoundIds.join(", "),
        },
        { status: 400 }
      );
    }

    // try {
    for (const val of lawyerIds) {
      if (val) {
        const request = await Request.findOne({
          lawyer: val,
          caseId,
          //  status: { $in: ["pending", "rejected"] },
        });
        if (request) {
          await Request.findOneAndUpdate(
            { lawyer: val, caseId },
            { status: "pending" },
            { new: true }
          );
        }
        if (!request) {
          await Request.create({ lawyer: val, caseId });
        }
      }
    }

    const cases = await Case.findByIdAndUpdate(
      caseId,
      { requestStatus: "requested" },
      { new: true }
    );
    // } catch (error) {
    //   console.error("Error inserting requests:", error);
    // }

    const notifyData = lawyerIds.map((lawyerId: string) =>
      PushNotifyUser({
        title: "New case request",
        description: `${user?.firstName} send you a new case request`,
        caseId: caseId,
        addedBy: user?._id,
        listenTo: lawyerId,
        role: "lawyer",
        type: "caseRequest",
      }).then((res) => {})
    );

    return NextResponse.json(
      {
        message: "Cases assigned successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
      },
      { status: 400 }
    );
  }
}
