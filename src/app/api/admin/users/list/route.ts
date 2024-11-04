import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/connectDB";
import User from "@/models/user.model";
export async function GET(req: NextRequest) {
  await db.connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ?? "1";
    const search = searchParams.get("search") ?? "";
    // const isDeleted = searchParams.get("isDeleted") ?? false;
    // const isBlock = searchParams.get("isBlock") ?? false;

    const pageSize = 10;
    const pageNumber = parseInt(page, 10);

    const skip = (pageNumber - 1) * pageSize;
    let query: any = { role: "client" };
    if (search) {
      query["$or"] = [
        {
          firstName: { $regex: search, $options: "i" },
        },
        {
          lastName: { $regex: search, $options: "i" },
        },
        {
          email: { $regex: search, $options: "i" },
        },
        {
          lastName: { $regex: search, $options: "i" },
        },
      ];
    }

    const lawyerDocs = await User.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const totalDocs = await User.countDocuments(query);
    return NextResponse.json(
      {
        data: {
          data: lawyerDocs,
          totalEntries: totalDocs,
          currentPage: pageNumber,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching lawyer documents:", error);
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}