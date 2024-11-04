import User from "@/models/user.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let page: any = req.nextUrl.searchParams.get("page");
    page = !!page ? +page : 1;

    const totalCategories = await User.countDocuments();
    const totalPages = Math.ceil(totalCategories / 10);
    if (page > totalPages) {
      page = totalPages;
    }
    const start = page - 1;

    const categories = await User.find()
      .limit(10)
      .skip(start * 10);
    return NextResponse.json({
      message: "Get User data",
      data: {
        data: categories,
        currentPage: page,
        totalEntries: totalCategories,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
