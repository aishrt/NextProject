import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import NotificationModel from "@/models/notification.model";

export async function PUT(req: NextRequest) {
  try {
    db.connectDB();
    const { ids } = await req.json();
    const read = await NotificationModel.updateMany(
      { _id: { $in: ids } },
      { $set: { isRead: true } }
    );
    return NextResponse.json({
      data: {
        status: 200,
        message: "Notification readed Successfully",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const { ids } = await req.json();
    const result = await NotificationModel.deleteMany({ _id: { $in: ids } });
    return NextResponse.json({
      data: {
        status: 200,
        message: "Notification deleted Successfully",
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
