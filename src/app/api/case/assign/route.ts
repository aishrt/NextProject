import Case from "@/models/case.model";
import Lawyer from "@/models/lawyer.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "../../notifications/add";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import PreTasksModel from "@/models/preTasks.model";
import TaskModel from "@/models/tasks.model";
import User from "@/models/user.model";
import RoomModel from "@/models/room.model";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();
    const server: any = await getServerSession(authOptions);
    let user = null;
    if (server && server.user) {
      user = server.user;
    }
    let { case_id, lawyer_id, details } = await req.json();

    let findCase = await Case.findOne({ _id: case_id });
    if (!findCase) {
      return NextResponse.json(
        {
          message: "Case not found",
          success: false,
        },
        { status: 400 }
      );
    }
    let findLawyer = await Lawyer.findOne({ _id: lawyer_id });
    if (!findLawyer) {
      return NextResponse.json(
        {
          message: "Lawyer not found",
        },
        { status: 400 }
      );
    }
    let FindRoom = await RoomModel.findOne({
      isPersonal: true,
      personalRole: "lawyer",
      personalUser: lawyer_id,
    });
    if (!FindRoom) {
      let roomID = Math.random().toString(36).substring(2, 13);

      await RoomModel.create({
        isPersonal: true,
        case_id,
        room: roomID,
        userId: user?._id,
        lawyerId: findLawyer?._id,
        personalRole: "lawyer",
        userName: findLawyer?.firstName || findLawyer?.name,
        personalUser: lawyer_id,
      });
      await RoomModel.updateOne(
        { case_id, isPersonal: false },
        {
          lawyerId: findLawyer?._id,
        }
      );
    }
    let payload: any = { isLawyerAssigned: true, lawyer: lawyer_id };
    if (details) {
      payload["lawyer_details"] = details;
    }
    let AssignLaywer = await Case.updateOne(
      { _id: case_id },
      { isLaywerAssigned: true, lawyer: lawyer_id, lawyer_details: details },
      { upsert: true }
    );
    const preTasksTemplates = await PreTasksModel.find({
      role: "lawyer",
      category: findCase?.category,
      caseType: findCase?.caseType,
    });
    const admin = await User.findOne({ role: "admin" });
    if (preTasksTemplates?.length > 0) {
      let taskPayload = preTasksTemplates?.map((itm: any) => ({
        case_id: findCase?._id,
        title: itm.title,
        assignedBy: { userId: admin._id, role: "admin" },
        assignedTo: {
          userId: lawyer_id,
          role: "lawyer",
        },
        description: itm.description,
        category: itm.category,
        submissionAt: new Date(
          new Date().setDate(new Date().getDate() + itm.validFor)
        ),
        validTill: new Date(
          new Date().setDate(new Date().getDate() + itm.validFor)
        ),
        status: "pending",
        isDocument: itm.isDocument,
      }));
      let AddTasks = await TaskModel.insertMany(taskPayload);
    }

    const notifications = [
      {
        title: "Lawyer Assigned",
        description: "A lawyer has been assigned to your case",
        listenTo: findCase?.user,
        role: "client",
        type: "lawyerAssigned",
      },
      {
        title: "New case assigned",
        description: "A new case has been assigned to you",
        listenTo: lawyer_id,
        role: "lawyer",
        type: "caseAssigned",
      },
    ];

    notifications.forEach(({ title, description, listenTo, role, type }) => {
      PushNotifyUser({
        title,
        description,
        caseId: findCase?._id,
        addedBy: user?._id,
        listenTo,
        role,
        type,
      }).then((res) => {});
    });

    return NextResponse.json(
      {
        message: "Lawyer assigned successfully",
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
      },
      { status: 400 }
    );
  }
}
