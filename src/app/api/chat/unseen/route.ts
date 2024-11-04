import Case from "@/models/case.model";
import MessagesModel from "@/models/messages.model";
import RoomModel from "@/models/room.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user: any = session?.user;
    console.log(user);
    let query: any = {};

    if (user?.role == "client") {
      query["user"] = user?._id;
    }
    if (user?.role == "lawyer") {
      query["lawyer"] = user?._id;
    }
    if (user?.role == "expert") {
      query = {};
    }
    let GetCases = await Case.find(query);
    const CasesArr = GetCases?.map((itm: any) => itm?._id);
    let pipeline: any = [
      {
        $match: {
          seenBy: {
            $nin: [{ _id: user?._id?.toString() }],
          },
          case_id: {
            $in: CasesArr,
          },
        },
      },
      { $group: { _id: null, total: { $sum: 1 } } },
      { $project: { _id: 0, total: 1 } },
    ];
    if (user?.role == "expert") {
      pipeline = [
        {
          $match: {
            seenBy: {
              $nin: [{ _id: user?._id?.toString() }],
            },
          },
        },
        { $group: { _id: null, total: { $sum: 1 } } },
        { $project: { _id: 0, total: 1 } },
      ];
    }
    let GetCount = await MessagesModel.aggregate(pipeline);
    return NextResponse.json(
      {
        data: {
          count: GetCount && GetCount[0] ? GetCount : 0,
        },
        message: "Chat is pinned successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
