import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/connectDB";
import LawyerTypes from "@/models/lawyerTypes.model";


async function connectToDB() {
  await db.connectDB();
}

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const data = await req.json();

    if (!data || typeof data !== "object") {
      return NextResponse.json({ message: "Invalid data received" }, { status: 400 });
    }

    const newLawyerType = await LawyerTypes.create(data);

    return NextResponse.json(
      { data: newLawyerType, message: "New Type created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating lawyer type:", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDB();

    const url = new URL(req.url);
    const pageParam = url.searchParams.get("page");
    console.log(pageParam)
    if (pageParam === 'all') {
      const allData = await LawyerTypes.find().exec();

      return NextResponse.json({
        data: {
          data: allData,
          currentPage: 1, 
          totalEntries: allData.length,
        },
      });
    } else {
      const pageNumber = parseInt(pageParam ?? "1", 10);

      if (isNaN(pageNumber) || pageNumber <= 0) {
        return NextResponse.json({ message: "Invalid page number" }, { status: 400 });
      }

      const totalUsers = await LawyerTypes.countDocuments();
      const totalPages = Math.ceil(totalUsers / 10);
      if (pageNumber > totalPages) {
        return NextResponse.json({ message: "Page number exceeds total pages" }, { status: 400 });
      }

      const start = (pageNumber - 1) * 10;
      const userData = await LawyerTypes.find()
        .limit(10)
        .skip(start)
        .exec();

      return NextResponse.json({
        data: {
          data: userData,
          currentPage: pageNumber,
          totalEntries: totalUsers,
        },
      });
    }
  } catch (error: any) {
    console.error("Error fetching lawyer types:", error);
    return NextResponse.json(
      { message: error.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}


