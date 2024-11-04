import Case from "@/models/case.model";
import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";
import TaskModel from "@/models/tasks.model";
import User from "@/models/user.model";
import { sendTaskReminderEmail } from "@/service/email";
import db from "@/utils/connectDB";
import moment from "moment";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "../../notifications/add";

export async function GET(req: NextRequest) {
  try {
    let task_id: any = req.nextUrl.searchParams.get("task_id");
    const Objectid = new mongoose.Types.ObjectId(task_id);
    let FindTask = await TaskModel.findOne({ _id: Objectid }).populate({
      path: "case_id",
      model: Case,
    });
    let EmailTo = FindTask?.assignedTo?.userId;
    let role = FindTask?.assignedTo?.role;

    if (role == "expert") {
      let GetExpert = await Expert.findOne({ _id: EmailTo });
      await sendTaskReminderEmail(
        GetExpert?.email,
        FindTask?.validTill,
        FindTask?.case_id?.referenceId
      )
        .then((res: any) => {
          console.log(res);
        })
        .catch((err: any) => {
          console.log(err, "=eeeerrorr");
        });
    }
    if (role == "client") {
      let GetClient = await User.findOne({ _id: EmailTo });

      await sendTaskReminderEmail(
        GetClient?.email,
        FindTask?.validTill,
        FindTask?.case_id?.referenceId
      );
    }
    if (role == "lawyer") {
      let GetLawyer = await Lawyer.findOne({ _id: EmailTo });
      await sendTaskReminderEmail(
        GetLawyer?.email,
        FindTask?.validTill,
        FindTask?.case_id?.referenceId
      );
    }
    // Send reminder notification to user===>>>>>>>
    // let payload = {
    //   title: `This is a gental reminder for you. Your task for case #${
    //     FindTask?.case_id?.referenceId
    //   } is pending. Please complete it before ${moment(
    //     FindTask?.validTill
    //   ).format("DD-MMM-YYYY")}. Thank You`,
    //   listenTo: FindTask?.assignedTo?.userId,
    //   addedBy: FindTask?.assignedBy?.userId,
    //   role: FindTask?.assignedTo?.role,
    //   caseId: FindTask.case_id?._id,
    // };
    // PushNotifyUser({
    //   ...payload,
    //   description: "A new task has been successfully added",
    //   type: "taskAdd",
    // });

    return NextResponse.json(
      {
        message: "Email sent successfully",
        status: 200,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error, "=========error");
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}
