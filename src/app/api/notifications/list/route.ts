export const dynamic = "force-dynamic";

import NotificationModel from "@/models/notification.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let count: any = req.nextUrl.searchParams.get("count");
    let user_id: any = req.nextUrl.searchParams.get("user_id");
    let role = req.nextUrl.searchParams.get("role");
    let caseId: any = req.nextUrl.searchParams.get("caseId");

    // let isRead = req.nextUrl.searchParams.get("isRead");
    let objectID = new mongoose.Types.ObjectId(user_id);

    let page: string | null = req.nextUrl.searchParams.get("page");
    page = !!page ? page : "1";

    let query: any = {};
    if (caseId) {
      let caseID = new mongoose.Types.ObjectId(caseId);
      query["caseId"] = caseID;
    }

    if (user_id) {
      query["listenTo"] = objectID;
    }

    if (role == "expert") {
      delete query.user_id;
      query["role"] = role;
    }

    if (role == "admin") {
      delete query.user_id;
      query["role"] = "expert";
      query["type"] = { $ne: "reportStatus" };
    }

    const total = await NotificationModel.countDocuments(query);
    const totalPages = Math.ceil(total / 10);
    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;

    let ExtractNotify = await NotificationModel.find(query)
      .populate("caseId")
      .sort({ isRead: 1, createdAt: -1 })
      .limit(10)
      .skip(start <= 0 ? 0 : start * 10);

    const unreadCount = await NotificationModel.find({
      ...query,
      isRead: false,
    }).countDocuments();

    // return NextResponse.json({
    //   data: ExtractNotify,
    //   status: 200,
    // });

    return NextResponse.json({
      message: "Get notifications data",
      data: {
        data: ExtractNotify,
        unread: unreadCount,
        currentPage: pageNumber,
        totalEntries: total,
        count: ExtractNotify.length,
        page: page,
        totalPages: totalPages,
      },
    });
  } catch (error: any) {
    console.log(error, "==============error");
    return NextResponse.json({
      message: error?.message || "Internal server error",
    });
  }
}
