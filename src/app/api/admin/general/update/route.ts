import GeneralModel from "@/models/general.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  db.connectDB();
  try {
    let { price, file } = await req.json();
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (user?.role == "client") {
      return NextResponse.json(
        {
          message: "You are not allowed to made these changes.",
          success: false,
        },
        { status: 500 }
      );
    }
    let findSettings = await GeneralModel.findOne();
    if (findSettings) {
      let GetSettings = await GeneralModel.updateOne(
        {},
        { price: Number(price), file, addedBy: user?._id }
      );

      return NextResponse.json(
        {
          data: {
            data: GetSettings,
            success: true,
          },
        },
        { status: 200 }
      );
    }
    let GetSettings = await GeneralModel.create(
      { price: Number(price), file, addedBy: user?._id }
    );

    return NextResponse.json(
      {
        message: "Created", 
        data: {
          data: GetSettings,
          success: true,
        },
      },
      { status: 200 }
    );
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
