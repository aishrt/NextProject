import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import MemberModel from "@/models/member.model";
import RoomModel from "@/models/room.model";
import SocketUserModel from "@/models/socketsUser.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let data = await req.json();

    let query: any = {
      case_id: data?.case_id,
    };
    if (data?.roomId) {
      delete query.case_id;
      query["_id"] = new mongoose.Types.ObjectId(data?.roomId);
    }

    let FindRoom = await RoomModel.findOne(query);
    let roomID = Math.random().toString(36).substring(2, 13);
    let RoomData = FindRoom;
    if (FindRoom) {
      roomID = FindRoom?.room;
    }
    if (!FindRoom) {
      let CreateRoom = await RoomModel.create({
        ...query,
        room: roomID,
        senderId: data?.userId,
      });
      RoomData = CreateRoom;
    }
    let FindMember = await MemberModel.findOne({
      userId: data?.userId,
      roomId: RoomData?._id,
    });
    if (!FindMember) {
      await MemberModel.create({
        roomId: RoomData?._id,
        userId: data?.userId,
        userRole: data?.userRole,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Handshake created succesfully",
      data: {
        roomID,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
