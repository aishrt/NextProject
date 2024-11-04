import Case from "@/models/case.model";
import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { Cases } from "@/types/Cases";
import PreTasksModel from "@/models/preTasks.model";
import User from "@/models/user.model";
import TaskModel from "@/models/tasks.model";
import Expert from "@/models/expert.model";
import PushNotifyUser from "@/app/api/notifications/add";
import RoomModel from "@/models/room.model";
import MemberModel from "@/models/member.model";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  try {
    // Connect to DB and fetch session info
    db.connectDB();
    const server = await getServerSession(authOptions);
    let user = null;

    if (server && server.user) {
      user = server.user;
    }
    const id = user?._id ?? "";
    const min = 10000000;
    const max = 99999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    // Fetch the admin and expert user details
    const admin = await User.findOne({ role: "admin" });
    const expert = await Expert.findOne();

    const caseData = await req.json();
    let caseId = caseData?.caseId;

    const payload: Cases = {
      ...caseData,
      user: id,
    };

    // create chat room while creating new case===============>>>>>>>>>>>>>>>>>>>>>>>>
    if (caseId) {
      let query: any = {
        case_id: caseId,
        isPersonal: false,
      };
      let FindRoom = await RoomModel.findOne(query);
      let FindPersonalRoom = await RoomModel.findOne({
        case_id: caseId,
        isPersonal: true,
      });

      let roomID = Math.random().toString(36).substring(2, 13);
      let RoomData = FindRoom;
      if (FindRoom) {
        roomID = FindRoom?.room;
      }
      if (!FindRoom) {
        let CreateRoom = await RoomModel.create({
          ...query,
          room: roomID,
          senderId: expert?._id,
        });
        RoomData = CreateRoom;
      }
      let FindMember = await MemberModel.findOne({
        userId: id,
        roomId: RoomData?._id,
      });
      let FindPersonalMember = await MemberModel.findOne({
        userId: id,
        roomId: FindPersonalRoom?._id,
      });
      let FindExpertMember = await MemberModel.findOne({
        userId: expert?._id,
        roomId: RoomData?._id,
      });
      if (!FindMember) {
        await MemberModel.create({
          roomId: RoomData?._id,
          userId: id,
          userRole: "client",
        });
      }
      if (!FindPersonalMember) {
        await MemberModel.create({
          roomId: FindPersonalRoom?._id,
          userId: id,
          userRole: "client",
        });
      }
      if (!FindExpertMember) {
        await MemberModel.create({
          roomId: RoomData?._id,
          userId: expert?._id,
          userRole: "expert",
        });
      }
    }
    // create chat room while creating new case===============>>>>>>>>>>>>>>>>>>>>>>>>

    let data;

    if (caseId) {
      data = await Case.findOneAndUpdate({ _id: caseId }, payload, {
        new: true,
      }).populate({ path: "user", model: User });

      const existingTasks = await TaskModel.find({
        case_id: caseId,
        assignedTo: { userId: expert._id },
      });

      if (
        // existingTasks.length === 0 &&
        data.category &&
        data.caseType &&
        data?.progress == 90
      ) {
        const preTasksTemplates = await PreTasksModel.find({
          role: { $in: ["client", "expert"] },
          category: payload.category,
          caseType: data.caseType,
        });

        if (preTasksTemplates.length > 0) {
          const taskPayload = preTasksTemplates.map((preTask) => ({
            case_id: caseId,
            title: preTask.title,
            assignedBy: { userId: admin._id, role: "admin" },
            assignedTo: {
              userId: preTask?.role == "expert" ? expert._id : user?._id,
              role: preTask?.role,
            },
            description: preTask.description,
            category: preTask.category,
            submissionAt: new Date(
              new Date().setDate(new Date().getDate() + preTask.validFor)
            ),
            validTill: new Date(
              new Date().setDate(new Date().getDate() + preTask.validFor)
            ),
            status: "pending",
            isDocument: preTask.isDocument,
          }));

          // Insert new tasks for the case manager
          await TaskModel.insertMany(taskPayload);
        }
      }

      if (payload?.applyFor === "litigation") {
        const notifyRoles = [
          {
            role: "client",
            listenTo: payload?.user,
            description: `Case successfully moved to litigation`,
          },
          {
            role: "expert",
            listenTo: expert._id,
            description: `${data?.user?.firstName} applied for litigation`,
          },
          {
            role: "lawyer",
            listenTo: data?.isLaywerAssigned ? data?.lawyer : null,
            description: `${data?.user?.firstName} applied for litigation`,
          },
        ];

        notifyRoles.forEach(({ role, listenTo, description }) => {
          PushNotifyUser({
            title: `Litigation applied`,
            description,
            caseId: caseId,
            addedBy: payload?.user,
            listenTo,
            role,
            type: "switchCase",
          }).then((res) => {});
        });
      }

      if (payload?.progress == 90) {
        PushNotifyUser({
          title: "New case created",
          description: "New case created",
          caseId: caseId,
          addedBy: payload?.user,
          // listenTo:expert,
          role: "expert",
          type: "caseCreated",
        }).then((res: any) => {});
      }
    } else {
      payload.referenceId = randomNumber;
      payload.expert = expert._id;
      data = await Case.create(payload);
      let query: any = {
        case_id: data?._id,
      };
      let FindRoom = await RoomModel.findOne(query);
      let FindPersonalRoom = await RoomModel.findOne({
        personalUser: new mongoose.Types.ObjectId(user?._id),
        personalRole: "client",
      });
      let roomID = Math.random().toString(36).substring(2, 13);
      let personalRoomID = Math.random().toString(36).substring(2, 13);

      let RoomData = FindRoom;
      let PersonalRoom = FindPersonalRoom;
      if (FindRoom) {
        roomID = FindPersonalRoom?.room;
      }
      if (FindPersonalRoom) {
        personalRoomID = FindRoom?.room;
      }
      if (!FindRoom) {
        let CreateRoom = await RoomModel.create({
          ...query,
          room: roomID,
          senderId: expert?._id,
          userId: user?._id,
        });
        RoomData = CreateRoom;
      }
      if (!FindPersonalRoom) {
        let roomPersonalID = Math.random().toString(36).substring(2, 13);

        let CreatePersonalRoom = await RoomModel.create({
          ...query,
          room: roomPersonalID,
          isPersonal: true,
          personalUser: id,
          userId: user?._id,

          senderId: expert?._id,
          userName: user?.name || user?.firstName,
          personalRole: "client",
        });
        PersonalRoom = CreatePersonalRoom;
      }
      let FindMember = await MemberModel.findOne({
        userId: id,
        roomId: RoomData?._id,
      });
      let FindExpertMember = await MemberModel.findOne({
        userId: expert?._id,
        roomId: RoomData?._id,
      });
      let FindPersonalMember = await MemberModel.findOne({
        userId: id,
        roomId: PersonalRoom?._id,
      });
      let FindPersonalExpertMember = await MemberModel.findOne({
        userId: expert?._id,
        roomId: PersonalRoom?._id,
      });
      if (!FindMember) {
        await MemberModel.create({
          roomId: RoomData?._id,
          userId: id,
          userRole: "client",
        });
      }
      if (!FindExpertMember) {
        await MemberModel.create({
          roomId: RoomData?._id,
          userId: expert?._id,
          userRole: "expert",
        });
      }
      if (!FindPersonalMember) {
        await MemberModel.create({
          roomId: RoomData?._id,
          userId: id,
          userRole: "client",
        });
      }
      if (!FindPersonalExpertMember) {
        await MemberModel.create({
          roomId: RoomData?._id,
          userId: expert?._id,
          userRole: "expert",
        });
      }
    }

    return NextResponse.json(
      {
        message: "Case created successfully!",
        data,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error?.message ?? "Internal server error" },
      { status: 400 }
    );
  }
}
