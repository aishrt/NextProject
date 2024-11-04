import Category from "@/models/category.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let page: string | null = req.nextUrl.searchParams.get("page");
    page = !!page ? page : "1";
    const totalCategories = await Category.countDocuments();
    const totalPages = Math.ceil(totalCategories / 10);
    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;
    const categories = await Category.find()
      .limit(10)
      .skip(start * 10);
    return NextResponse.json({
      message: "Get category data",
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
