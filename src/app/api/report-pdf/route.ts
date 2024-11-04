import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import ClaimReportModel from "@/models/cer_Report.model";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    const server = await getServerSession(authOptions);
    let user = null;
    if (server && server.user) {
      user = server.user;
    }
    const userId = user?._id ?? "";
    let id: string = req.nextUrl.searchParams.get("id")!;
    if (id) {
      const data = await ClaimReportModel.findOne({ _id: id });
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_PDF_URL}/claimPdf`,
        data
      );
      const url = result?.data?.pdf;
      return NextResponse.json({
        message: "Get report data",
        data: url,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
