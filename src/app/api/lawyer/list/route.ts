import Lawyer from "@/models/lawyer.model";
import db from "@/utils/connectDB";
import { count } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let page: string | null = req.nextUrl.searchParams.get("page");
    let count: string | null = req.nextUrl.searchParams.get("count");
    page = !!page ? page : "1";
    const totalCase = await Lawyer.countDocuments();
    const totalPages = Math.ceil(totalCase / 10);
    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;
    const countInt = count ? parseInt(count) : 10;
    let GetLawyer = await Lawyer.find({})
      // .populate("legalExpertise")
      .limit(countInt)
      .skip(start * 10)
      .exec();
    return NextResponse.json(
      {
        message: "Lawyers fetched successfully",
        data: GetLawyer,
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
