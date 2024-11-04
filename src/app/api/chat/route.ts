import Case from "@/models/case.model";
import RoomModel from "@/models/room.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;
    const query: any = {};
    if (user?.role == "client") {
      query["user"] = user?._id;
    }
    if (user?.role == "lawyer") {
      query["lawyer"] = user?._id;
    }
    let CasesArr: any = [];
    let GetCases = await Case.find(query);
    GetCases?.map((itm: any) => {
      CasesArr.push({ case_id: itm?._id });
    });
    let role: any = user?.role == "client" ? "userId" : "lawyerId";
    let pipe = {
      $or: CasesArr,
    };
    let findRoom = await RoomModel.aggregate([
      {
        $match: {
          [user?.role == "client" ? "userId" : "lawyerId"]: user?._id,
        },
      },
      {
        $match: {
          isPersonal: false,
        },
      },
      {
        $lookup: {
          from: "cases",
          localField: "case_id",
          foreignField: "_id",
          as: "case_id",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "senderId",
          foreignField: "_id",
          as: "client",
        },
      },
      {
        $lookup: {
          from: "experts",
          localField: "senderId",
          foreignField: "_id",
          as: "expert",
        },
      },
      {
        $lookup: {
          from: "lawyers",
          localField: "senderId",
          foreignField: "_id",
          as: "lawyer",
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },

      {
        $unwind: {
          path: "$case_id",
        },
      },
      {
        $addFields: {
          isPinnedByUser: {
            $cond: {
              if: { $in: [user?._id, "$pinnedBy._id"] },
              then: 1,
              else: 0,
            },
          },
        },
      },
      {
        $sort: {
          isPinnedByUser: -1,
        },
      },
    ]);
    if (user?.role == "expert") {
      let findRoom = await RoomModel.aggregate([
        {
          $lookup: {
            from: "cases",
            localField: "case_id",
            foreignField: "_id",
            as: "case_id",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "client",
          },
        },
        {
          $lookup: {
            from: "experts",
            localField: "senderId",
            foreignField: "_id",
            as: "expert",
          },
        },
        {
          $lookup: {
            from: "lawyers",
            localField: "senderId",
            foreignField: "_id",
            as: "lawyer",
          },
        },
        {
          $lookup: {
            from: "lawyers",
            localField: "receiverId",
            foreignField: "_id",
            as: "lawyerSender",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "receiverId",
            foreignField: "_id",
            as: "clientSender",
          },
        },
        {
          $sort: {
            updatedAt: -1,
          },
        },
        {
          $unwind: {
            path: "$case_id",
          },
        },
      ]);
      return NextResponse.json(
        {
          data: {
            success: true,
            data: findRoom || [],
          },
        },
        { status: 200 }
      );
    }
    if (user?.role == "client") {
      let PersonalRoom = await RoomModel.findOne({
        isPersonal: true,
        personalUser: user?._id,
        personalRole: user?.role,
      }).sort({ pinnedBy: -1 });
      let data = [...findRoom, PersonalRoom];

      return NextResponse.json(
        {
          data: {
            success: true,
            data: data[0] != null ? data : [],
          },
        },
        { status: 200 }
      );
    }
    if (user?.role == "lawyer") {
      let PersonalRoom = await RoomModel.findOne({
        isPersonal: true,
        personalUser: user?._id,
        personalRole: user?.role,
      });
      let data = [...findRoom, PersonalRoom];

      return NextResponse.json(
        {
          data: {
            success: true,
            data: data[0] != null ? data : [],
          },
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        data: {
          success: true,
          data: findRoom || [],
        },
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
