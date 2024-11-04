import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/connectDB";
import Member from "@/models/member.model";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const data = await req.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { message: "Invalid data received" },
        { status: 400 }
      );
    }

    const email = await Member.findOne({ email: data.email });
    if (email) {
      return NextResponse.json(
        {
          message: `Email already exists`,
        },
        { status: 400 }
      );
    }

    const newMember = await Member.create(data);

    return NextResponse.json(
      { data: newMember, message: "Member created successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error creating member:", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    const caseId = url.searchParams.get("caseId");

    const pageNumber = parseInt(pageParam ?? "1", 5);
    // if (isNaN(pageNumber) || pageNumber <= 0) {
    //   return NextResponse.json(
    //     { message: "Invalid page number" },
    //     { status: 400 }
    //   );
    // }
    
    const totalUsers = await Member.countDocuments({ caseId });
    const totalPages = Math.ceil(totalUsers / 5);
    // if (pageNumber > totalPages) {
    //   return NextResponse.json(
    //     { message: "Page number exceeds total pages" },
    //     { status: 400 }
    //   );
    // }
    const start = (pageNumber - 1) * 5;
    const userData = await Member.find({ caseId }).limit(5).skip(start).exec();
    return NextResponse.json({
      data: {
        data: userData,
        currentPage: pageNumber,
        totalEntries: totalUsers,
      },
    });
  } catch (error: any) {
    console.error("Error fetching:", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
