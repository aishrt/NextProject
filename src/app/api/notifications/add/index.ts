import Case from "@/models/case.model";
import Expert from "@/models/expert.model";
import NotificationModel from "@/models/notification.model";
import User from "@/models/user.model";
import db from "@/utils/connectDB";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

const PushNotifyUser = async ({
  title,
  description,
  listenTo,
  addedBy,
  role,
  caseId,
  type,
}: any) => {
  try {
    db.connectDB();
    const paylaod: any = {
      title,
      description,
      listenTo,
      addedBy,
      role,
      caseId,
      type,
    };

    if (!addedBy) {
      return NextResponse.json({
        data: {
          status: 400,
          message: "User id is required",
        },
      });
    }

    let CreateNotify = await NotificationModel.create(paylaod);

    return { success: true, message: "Notification created successfully" };
  } catch (error: any) {
    return { message: "Internal server error", success: false };
  }
};

export default PushNotifyUser;
