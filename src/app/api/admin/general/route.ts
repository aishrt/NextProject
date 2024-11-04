import GeneralModel from "@/models/general.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  db.connectDB();
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    // if (user?.role != "admin") {
    //   return NextResponse.json(
    //     {
    //       message: "You are not allowed to access this.",
    //       success: false,
    //     },
    //     { status: 500 }
    //   );
    // }

    let GetSettings = await GeneralModel.findOne({}).limit(1);

    return NextResponse.json(
      {
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
