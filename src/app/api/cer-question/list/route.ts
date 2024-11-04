import CerQuestions from "@/models/cerQuestion.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let page: any = req.nextUrl.searchParams.get("page");
    page = !!page ? +page : 1;

    const totalQuestions = await CerQuestions.countDocuments();
    // const totalPages = Math.ceil(totalQuestions / 10);
    // if (page > totalPages) {
    //   page = totalPages;
    // }
    const start = page - 1;

    const Questions = await CerQuestions.find()
    //   .limit(10)
    //   .skip(start * 10);
    return NextResponse.json({
      message: "Get Questions data",
      data: {
        data: Questions,
        // currentPage: page,
        totalEntries: totalQuestions,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
