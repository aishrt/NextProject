import Case from "@/models/case.model";
import TaskModel from "@/models/tasks.model";
import db from "@/utils/connectDB";
import moment from "moment";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "../../notifications/add";
import { cleanDigitSectionValue } from "@mui/x-date-pickers/internals/hooks/useField/useField.utils";
import Lawyer from "@/models/lawyer.model";
import Expert from "@/models/expert.model";

export async function POST(req: NextRequest) {
  try {
    await db.connectDB();

    // Parse request data
    const {
      title,
      description,
      isDocument,
      submissionAt,
      validTill,
      case_id,
      category,
      assignedBy,
      assignedTo,
      task_id,
    } = await req.json();

    // Validate input
    if (
      !case_id ||
      !title ||
      !description ||
      !category ||
      !submissionAt ||
      !validTill ||
      !assignedBy ||
      !assignedTo
    ) {
      return NextResponse.json(
        {
          data: {
            status: 400,
            message: "Required fields are missing",
          },
        },
        { status: 400 }
      );
    }

    // Find case to ensure it exists
    const findCase = await Case.findById(case_id);
    if (!findCase) {
      return NextResponse.json(
        {
          data: {
            status: 400,
            message: "Case not found",
          },
        },
        { status: 400 }
      );
    }

    let taskData: any = {
      title,
      description,
      isDocument: Boolean(isDocument),
      submissionAt: moment(submissionAt, "DD/MM/YYYY"),
      validTill: moment(validTill, "DD/MM/YYYY"),
      case_id,
      category,
      assignedBy,
      assignedTo,
    };

    // Create new task

    const newTask = await TaskModel.create(taskData);
    let payload = {
      title,
      listenTo: assignedTo.role === "client" ? findCase.user : "",
      addedBy: assignedBy.userId,
      role: assignedTo.role,
      caseId: findCase._id,
    };
    if (assignedTo?.role == "lawyer") {
      payload["listenTo"] = findCase?.lawyer;
    }
    const GetExpert = await Expert.findOne({});

    if (assignedTo?.role == "expert") {
      payload["listenTo"] = GetExpert?._id;
    }
    PushNotifyUser({
      ...payload,
      description: "A new task created for you",
      type: "taskAdd",
    })
      .then((res: any) => {})
      .catch((err: any) => {});

    return NextResponse.json({
      data: {
        status: 200,
        message: "Task created successfully",
        success: true,
      },
    });
  } catch (error: any) {
    console.log(error, "======error");
    return NextResponse.json(
      {
        data: {
          message: error?.message || "Internal server error",
          code: 400,
        },
      },
      { status: 400 }
    );
  }
}
