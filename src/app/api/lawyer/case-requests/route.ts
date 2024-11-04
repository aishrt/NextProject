import Case from "@/models/case.model";
import Lawyer from "@/models/lawyer.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "../../notifications/add";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Request from "@/models/caseRequests.model";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    const server: any = await getServerSession(authOptions);
    const user = server.user || null;

    let page: string | null = req.nextUrl.searchParams.get("page");

    page = !!page ? page : "1";
    const query = {
      lawyer: user?._id,
      status: {$in:["pending" , "counterOffer"]},
    };
    const totalCase = await Request.countDocuments(query);
    const totalPages = Math.ceil(totalCase / 10);

    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;

    let findRequest = await Request.find(query)
      .populate("caseId")
      .sort({ createdAt: -1 })
      .limit(10)
      .skip(start * 10);
    let total = await Request.countDocuments(query);

    return NextResponse.json(
      {
        message: "Requests fetched successfully",
        data: {
          data: findRequest,
          currentPage: pageNumber,
          totalEntries: total,
        },
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
