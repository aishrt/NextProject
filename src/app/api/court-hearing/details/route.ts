import Case from "@/models/case.model";
import courtHearingModel from "@/models/court.hearing.model";
import User from "@/models/user.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import moment from "moment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let id = req.nextUrl.searchParams.get("id");
    let session = await getServerSession(authOptions);
    let user = session?.user;
    let query: any = {};

    let findData = await courtHearingModel
      .findOne({ _id: id })
      .populate("case_id")
      .populate({ path: "userId", model: User });
    return NextResponse.json(
      {
        data: {
          data: findData,
          success: true,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
