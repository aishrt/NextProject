import Case from "@/models/case.model";
import CaseUpdatesModel from "@/models/case.updates.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let case_id: any = req.nextUrl.searchParams.get("case_id");
    let page = req.nextUrl.searchParams.get("page");
    let search = req.nextUrl.searchParams.get("search") || "";
    let date = req.nextUrl.searchParams.get("date");
    let time = req.nextUrl.searchParams.get("time");
    const ObjectId = new mongoose.Types.ObjectId(case_id);

    page = !!page ? page : "1";
    const totalUpdates = await CaseUpdatesModel.countDocuments();
    const totalPages = Math.ceil(totalUpdates / 10);
    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;

    let query: any = { case_id: ObjectId };
    if (search) {
      query.$or = [
        {
          title: { $regex: search, $options: "i" },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
        {
          attendees: {
            $regex: search,
            $options: "i",
          },
        },
        {
          discussionPoint: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }
    if (date) {
      query["createdAt"] = {
        $gte: new Date(date),
      };
    }
    let pipeline: any = [
      {
        $match: {
          case_id: ObjectId,
        },
      },
      {
        $match: {
          $or: [
            {
              title: { $regex: search, $options: "i" },
            },
            {
              description: {
                $regex: search,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: "cases",
          localField: "case_id",
          foreignField: "_id",
          as: "case_id",
        },
      },
      {
        $unwind: {
          path: "$case_id",
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ];

    let GetUpdates = await CaseUpdatesModel.aggregate(pipeline).exec();
    // .sort({ createdAt: -1 })
    // // .populate({ path: "case_id", model: Case })
    // .limit(10)
    // .skip(start <= 0 ? 0 : start * 10)
    // .exec();
    let total = await CaseUpdatesModel.countDocuments(query);

    return NextResponse.json({
      data: {
        data: GetUpdates,
        currentPage: pageNumber,
        totalEntries: total,
        message: "Updates fetched successfully",
        success: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
