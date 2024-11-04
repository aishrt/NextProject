import Case from "@/models/case.model";
import courtHearingModel from "@/models/court.hearing.model";
import Expert from "@/models/expert.model";
import User from "@/models/user.model";
import { authOptions } from "@/server/auth";
import { sendCourtHearingReminderEmail } from "@/service/email";
import db from "@/utils/connectDB";
import moment from "moment";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import schedule from "node-schedule";
import PushNotifyUser from "../notifications/add";
export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    let case_id = req.nextUrl.searchParams.get("case_id");
    let session = await getServerSession(authOptions);
    let user = session?.user;
    let query: any = {};
    if (user?.role == "lawyer") {
      query["addedBy"] = user?._id;
      delete query.case_id;
    }
    if (user?.role == "client") {
      query = {
        userId: user?._id,
      };
    }
    if (case_id) {
      query = {
        case_id: case_id,
      };
    }
    let findData = await courtHearingModel
      .find(query)
      .populate("case_id")
      .populate({ path: "userId", model: User });

    return NextResponse.json(
      {
        data: {
          data: findData,
          success: true,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let body = await req.json();
    let session = await getServerSession(authOptions);
    let findCase = await Case.findOne({ _id: body?.case_id });
    let user = session?.user;
    let {
      reminderTitle,
      reminderTime,
      reminderDate,
      reminderDescription,
      title,
      description,
      objective,
      document,
      date,
      time,
      case_id,
      address,
      role,
      reminder,
      isWon,
    } = body;
    let spiltedTime = reminderTime.slice(0, -2);
    let formatedDate = new Date(`${reminder} ${spiltedTime}`);
    let expertDetail = await Expert.findOne({});
    let UserDetail = await Case.findOne({ _id: case_id }).populate("user");

    // const SetTimer = schedule.scheduleJob("10", () => {
    //   console.log("job is running after 10 sec");
    // });
    let CreateDoc = await courtHearingModel.create({
      reminderTitle,
      reminderTime,
      reminderDate: moment(reminderDate, "DD/MM/YYYY"),
      reminderDescription,
      title,
      address,
      description,
      document,
      role,
      objective,
      date: moment(date, "DD/MM/YYYY"),
      time,
      case_id,
      isWon,

      addedBy: user?._id,
      reminder: formatedDate,
      userId: findCase?.user,
    });
    if (isWon == true) {
      await Case.updateOne({ _id: case_id }, { $set: { isWon: true } });
    }
    let timer = schedule.scheduleJob(formatedDate, () => {
      let payload = {
        email: "",
        date: moment(reminderDate).format("DD-MMM-YYYY"),
        time: time,
        address: address,
      };
      if (role == "expert") {
        payload.email = expertDetail?.email;
        sendCourtHearingReminderEmail(payload);
      }
      if (role == "client") {
        payload.email = UserDetail?.user?.email;
        sendCourtHearingReminderEmail(payload);
      }
      if (role == "all") {
        sendCourtHearingReminderEmail({
          ...payload,
          email: expertDetail?.email,
        });
        sendCourtHearingReminderEmail({
          ...payload,
          email: UserDetail?.user?.email,
        });
      }
    });
    let payload = {
      title,
      listenTo: UserDetail?.user?._id,
      addedBy: user?._id,
      role: "client",
      caseId: findCase._id,
    };
    PushNotifyUser({
      ...payload,
      description: "Court hearing is scheduled for your case",
      type: "courtHearing",
    })
      .then((res: any) => {})
      .catch((err: any) => {});
    return NextResponse.json(
      {
        data: {
          success: true,
          data: CreateDoc,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
