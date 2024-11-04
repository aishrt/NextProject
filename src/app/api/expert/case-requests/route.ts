import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Request from "@/models/caseRequests.model";
import Case from "@/models/case.model";
import Lawyer from "@/models/lawyer.model";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    const server: any = await getServerSession(authOptions);
    const user = server.user || null;
    const referenceId = req.nextUrl.searchParams.get("referenceId");
    const lawyer = req.nextUrl.searchParams.get("lawyer");
    const status = req.nextUrl.searchParams.get("status");

    let page: string | null = req.nextUrl.searchParams.get("page");

    page = !!page ? page : "1";
    const query: any = {
      status: { $nin: ["Not applicable"] },
    };

    if (referenceId) {
      const foundCases = await Case.find({
        referenceId: Number(referenceId),
      });
      query.caseId = foundCases.map((val) => val?._id);
    }

    if (lawyer) {
      const foundLawyers = await Lawyer.find({
        name: new RegExp(lawyer, "i"),
      });
      query.lawyer = foundLawyers.map((lawyer) => lawyer._id);
    }

    if (status) {
      query.status = status;
    }

    const totalCase = await Request.countDocuments(query);

    const totalPages = Math.ceil(totalCase / 10);

    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;

    let findRequest = await Request.find(query)
      .populate("caseId")
      .populate("lawyer")
      .sort({ createdAt: -1 })
      .limit(10)
      .skip(start <= 0 ? 0 : start * 10);

    return NextResponse.json(
      {
        message: "Requests fetched successfully",
        data: {
          data: findRequest,
          currentPage: pageNumber,
          totalEntries: totalCase,
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
