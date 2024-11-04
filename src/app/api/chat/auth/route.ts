import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import SocketUserModel from "@/models/socketsUser.model";
import User from "@/models/user.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    let body = await req.json();
    const userID = body?.token;
    let userRole: any = "";
    const objectID = new mongoose.Types.ObjectId(userID);
    const FindUser = await User.findOne({ _id: userID });
    const FindExpert = await Expert.findOne({ _id: objectID });
    const FindLawyer = await Lawyer.findOne({ _id: objectID });

    if (FindExpert?._id || FindLawyer?._id || FindUser?._id) {
      userRole = FindUser?.role || FindLawyer?.role || FindExpert?.role;
      return NextResponse.json({
        success: true,
        message: "User Authanticated successfully",
        data: { userRole },
      });
    } else {
      return NextResponse.json({
        message: "User not found",
        success: false,
      });
    }
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
