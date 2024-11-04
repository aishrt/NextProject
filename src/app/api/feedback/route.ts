import Case from "@/models/case.model";
import feedBackModel from "@/models/feedback.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    let data = await req.json();
    let findCase = await Case.findOne({ _id: data?.case_id });
    if (!findCase) {
      return NextResponse.json(
        {
          data: {
            success: false,
            message: "Case not found",
          },
        },
        { status: 400 }
      );
    }

    let createFeedback = await feedBackModel.create({
      lawyerFeedback: data?.lawyerFeedback,
      case_id: data?.case_id,
      lawyerRating: data?.lawyerRating,
      platformRating: data?.platformRating,
    });
    return NextResponse.json(
      {
        data: {
          success: true,
          message: "Feedback sent successfully",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({
      message: error?.message || "Internal server error",
    });
  }
}

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let query: any = {};
    let case_id = req.nextUrl.searchParams.get("case_id");
    const page: any = req.nextUrl.searchParams.get("page");
    const totalCount = await feedBackModel.countDocuments(query);
    const totalPages = Math.ceil(totalCount / 10);
    if (case_id) {
      query["case_id"] = case_id;
    }
    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const skip = (pageNumber - 1) * 10;

    let data = await feedBackModel
      .find(query)
      .populate("case_id")
      .skip(skip < 0 ? 0 : skip)
      .limit(10)
      .exec();
    return NextResponse.json(
      {
        data: {
          data,
          success: true,
          message: "Feedback fetched successfully",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({
      message: error?.message || "Internal server error",
    });
  }
}
