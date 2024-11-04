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

    let { id, action } = await req.json();
    let FindRoom = await RoomModel.findOne({ _id: id });
    let previousPinned = FindRoom?.pinnedBy || [];
    let objectID = new mongoose.Types.ObjectId(user?._id);
    console.log(action);
    let updateObj = {};

    if (action === "add") {
      updateObj = { $addToSet: { pinnedBy: { _id: user?._id } } };
    } else if (action === "remove") {
      updateObj = { $pull: { pinnedBy: { _id: user?._id } } };
    }
    let UpdatePinnedChat = await RoomModel.updateOne({ _id: id }, updateObj, {
      new: true,
    });
    return NextResponse.json(
      {
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
