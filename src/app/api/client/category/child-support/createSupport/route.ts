import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import Child from "@/models/childSupport.model";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const server = await getServerSession(authOptions);
    let user = null;
    let data;
    if (server && server.user) {
      user = server.user;
    }
    const id = user?._id ?? "";

    if (id) {
      const data = await req.json();
      console.log(data, "daataa ++++++");
      const existing = await Child.findOne({ caseId: data.caseId });
      if (existing) {
        const result = await Child.findOneAndUpdate(
          { caseId: data.caseId },
          data,
          {
            new: true,
          }
        );
        return NextResponse.json(
          {
            message: "Data updated successfully !",
            data: result,
          },
          { status: 200 }
        );
      } else {
        data.user = id;
        data.caseId = new mongoose.Types.ObjectId(data.caseId);
        const result = await Child.create(data);
        return NextResponse.json(
          {
            message: "Child category created succesfully !",
            data: result,
          },
          { status: 200 }
        );
      }
    } else {
      return NextResponse.json(
        {
          message: "Authentication required ",
        },
        { status: 400 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
