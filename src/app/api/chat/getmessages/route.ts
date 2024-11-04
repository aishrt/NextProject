import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import MemberModel from "@/models/member.model";
import MessagesModel from "@/models/messages.model";
import RoomModel from "@/models/room.model";
import SocketUserModel from "@/models/socketsUser.model";
import User from "@/models/user.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let data = await req.json();
    const GetModel = (key: any) => {
      if (key == "user") {
        return User;
      }
      if (key == "lawyer") {
        return Lawyer;
      }
      if (key == "expert") {
        return Expert;
      }
    };
    if (!data?.case_id && !data?.room) {
      return NextResponse.json(
        {
          data: {
            data: [],
            // Users,
            // room: RoomID?.room,
          },
          message: "Messages fetched successfully",
          success: true,
        },
        { status: 200 }
      );
    }
    let query: any = {};
    if (data?.case_id) {
      query["case_id"] = new mongoose.Types.ObjectId(data?.case_id);
    }
    if (data?.room) {
      delete query.case_id;
      query["roomId"] = new mongoose.Types.ObjectId(data?.room);
    }
    if (data?.search) {
      query["$or"] = [
        { "message.text": { $regex: data?.search, $options: "i" } },
      ];
    }

    let GetMessages = await MessagesModel.find(query)
      // .populate({
      //   path: "case_id",
      //   model: "cases",
      // })
      .populate("roomId")
      .exec();
    let arr = [];
    let searchquery: any = { case_id: data?.case_id };
    if (data?.room) {
      delete searchquery.case_id;
      searchquery["room"] = data?.room;
    }
    let RoomID = await RoomModel.findOne(searchquery);
    const GetSenderUser = await MemberModel.find({
      roomId: RoomID?._id,
    });
    let updateObj: any = {};
    updateObj = { $addToSet: { seenBy: { _id: data?.userId } } };
    let UpdateMessages = await MessagesModel.updateMany(searchquery, updateObj);
    let Users = await MemberModel.aggregate([
      {
        $match: {
          roomId: new mongoose.Types.ObjectId(data?.room),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $lookup: {
          from: "experts",
          localField: "userId",
          foreignField: "_id",
          as: "expert",
        },
      },
      {
        $lookup: {
          from: "lawyers",
          localField: "userId",
          foreignField: "_id",
          as: "lawyer",
        },
      },
      // {
      //   $project: {
      //     user: {
      //       $cond: {
      //         if: { $eq: ["$userRole", "client"] },
      //         then: { $arrayElemAt: ["$client", 0] },
      //         else: {
      //           $cond: {
      //             if: { $eq: ["$userRole", "expert"] },
      //             then: { $arrayElemAt: ["$expert", 0] },
      //             else: { $arrayElemAt: ["$lawyer", 0] },
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    ]);
    return NextResponse.json(
      {
        data: {
          data: GetMessages,
          Users,
          room: RoomID?.room,
        },
        message: "Messages fetched successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error, "===========error join");
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
        success: false,
      },
      { status: 500 }
    );
  }
}
