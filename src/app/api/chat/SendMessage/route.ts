import Case from "@/models/case.model";
import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import MemberModel from "@/models/member.model";
import MessagesModel from "@/models/messages.model";
import RoomModel from "@/models/room.model";
import SocketUserModel from "@/models/socketsUser.model";
import User from "@/models/user.model";
import { sendMeetingSechduleEmail } from "@/service/email";
import db from "@/utils/connectDB";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    let { message, media, link, case_id, userId, userRole }: any = data;
    const GetModel = (key: any) => {
      if (key == "client") {
        return "User";
      }
      if (key == "lawyer") {
        return "Lawyer";
      }
      if (key == "expert") {
        return "Expert";
      }
    };
    let query: any = { case_id };
    if (data?.room) {
      delete query.case_id;
      query["_id"] = data?.room;
    }

    const FindRoom = await RoomModel.findOne(query);
    if (!FindRoom) {
      return NextResponse.json(
        {
          success: false,
          reconnect: true,
        },
        { status: 400 }
      );
    } else {
      let msgPayload: any = {
        message: message,
        case_id,
        userId: userId,
        roomId: FindRoom?._id,
      };
      if (message?.meeting) {
        msgPayload[
          "message"
        ].text = `Your meeting is schedule for the date of ${message?.meeting}`;
        let caseDetails = await Case.findOne({ _id: case_id }).populate("user");

        await sendMeetingSechduleEmail(
          caseDetails?.user?.email,
          message?.meeting,
          caseDetails?.referenceId
        );
      }
      let FindMember = await MemberModel.findOne({
        userId: userId,
        roomId: FindRoom?._id,
      });
      msgPayload["memberId"] = FindMember?._id;
      if (!FindMember) {
        let CreateMember = await MemberModel.create({
          roomId: FindRoom?._id,
          userId: userId,
          userRole: userRole,
        });
        msgPayload["memberId"] = CreateMember?._id;
      }

      let senderDetails = await MemberModel.findOne({
        userId: userId,
      }).populate({ path: "userId", model: GetModel(userRole) });
      await MessagesModel.create(msgPayload);
      NextResponse.json(
        {
          data: msgPayload,
          success: true,
          room: FindRoom?.room,
          senderDetails,
        },
        { status: 200 }
      );
      let UpdateLastMessage = await RoomModel.updateOne(
        { _id: FindRoom?._id },
        {
          lastMessage: message,
          senderId: userId,
          senderRole: userRole,
        }
      );
      let updateObj: any = {};
      updateObj = { $addToSet: { seenBy: { _id: data?.userId } } };
      let UpdateMessages = await MessagesModel.updateMany(
        { case_id: data?.case_id },
        updateObj
      );
      return NextResponse.json(
        {
          data: msgPayload,
          success: true,
          room: FindRoom?.room,
          senderDetails,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal server error ",
      },
      { status: 500 }
    );
  }
}
