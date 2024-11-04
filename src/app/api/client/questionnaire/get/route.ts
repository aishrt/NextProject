import Case from "@/models/case.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import moment from "moment";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    const server = await getServerSession(authOptions);
    let user = null;
    if (server && server.user) {
      user = server.user;
    }
    const userId = user?._id ?? "";
    
    let caseId: string = req.nextUrl.searchParams.get("caseId")!;
    let page: string | null = req.nextUrl.searchParams.get("page");

    page = !!page ? page : "1";
    const totalCase = await Case.countDocuments();
    const totalPages = Math.ceil(totalCase / 10);
    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;
    if (caseId) {
      const data = await Case.findOne({ _id: caseId })
        .limit(10)
        .skip(start * 10);
      return NextResponse.json({
        message: "Get case data",
        data,
      });
    } 
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
