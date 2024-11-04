import Case from "@/models/case.model";
import CaseUpdatesModel from "@/models/case.updates.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "@/app/api/notifications/add";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const server = await getServerSession(authOptions);
    const user = server?.user;
    if (!user) {
      return NextResponse.json(
        { message: "Please authenticate!" },
        { status: 403 }
      );
    }

    let {
      title,
      case_id,
      discussionPoint,
      document,
      exchangedDocument,
      user_id,
      isWon,
      description,
      attendees,
      price,
    } = await req.json();
    let ObjectId = new mongoose.Types.ObjectId(case_id);
    let CaseExist = await Case.findOne({ _id: ObjectId });
    if (!CaseExist) {
      return NextResponse.json(
        {
          message: "Case not found",
          success: false,
        },
        { status: 400 }
      );
    }
    let payload = {
      title,
      case_id,
      discussionPoint,
      document,
      exchangedDocument,
      user_id,
      attendees,
      description,
      price,
      isWon,
    };
    let createUpdates = await CaseUpdatesModel.create(payload);
    if (isWon && price) {
      await Case.updateOne(
        { _id: case_id },
        {
          isWon: true,
        }
      );
    }
    const notifyRoles = [
      {
        role: "client",
        listenTo: CaseExist?.user,
      },
      {
        role: "expert",
        listenTo: CaseExist?.expert ?? null,
      },
    ];

    notifyRoles.forEach(({ role, listenTo }) => {
      PushNotifyUser({
        title: `New Case Updates`,
        description: `Case updates added by ${user?.name}`,
        caseId: case_id,
        addedBy: user._id,
        type: "caseUpdates",
        listenTo,
        role,
      }).then((res) => {});
    });

    return NextResponse.json(
      {
        message: "Update created Successfully",
        success: true,
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
