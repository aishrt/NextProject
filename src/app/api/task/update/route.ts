import { NextRequest, NextResponse } from "next/server";
import db from "@/utils/connectDB";
import TaskModel from "@/models/tasks.model";
import CaseDocument from "@/models/documents.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { uploadFile } from "@/utils/upload";
import PushNotifyUser from "../../notifications/add";
import User from "@/models/user.model";
import Expert from "@/models/expert.model";
import Lawyer from "@/models/lawyer.model";

export async function POST(req: NextRequest) {
  try {
    db.connectDB();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    // Extract form data using req.formData()
    const formData = await req.formData();

    // Get the fields from the formData
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const task_id = formData.get("task_id") as string;
    const case_id = formData.get("case_id") as string;
    const category = formData.get("category") as string;

    const document = formData.get("document") as File; // This is the file

    let findTask = await TaskModel.findOne({ _id: task_id });
    // .populate({
    //   path: "assignedTo.userId",
    //   select: "firstName",
    //   model: User,
    // });

    if (!findTask) {
      return NextResponse.json({
        data: {
          status: 400,
          message: "Task not found",
          success: false,
        },
      });
    }

    let modelToPopulate;
    if (findTask.assignedTo.role === "client") {
      modelToPopulate = User;
    } else if (findTask.assignedTo.role === "expert") {
      modelToPopulate = Expert;
    } else {
      modelToPopulate = Lawyer;
    }

    findTask.populate({
      path: "assignedTo.userId",
      model:
        findTask?.assignedTo.role == "client"
          ? User
          : findTask?.assignedTo.role == "expert"
          ? Expert
          : Lawyer,
    });
    // Populate userId
    findTask = await TaskModel.populate(findTask, {
      path: "assignedTo.userId",
      model: modelToPopulate,
    });

    await TaskModel.updateOne(
      { _id: task_id },
      { $set: { status: "completed" } },
      { upsert: true }
    );

    if (document) {
      const filePath = await uploadFile(document);
      // Create the document entry in the database
      await CaseDocument.create({
        case_id,
        task_id,
        category,
        uploadedBy: {
          user: user?._id,
          role: user?.role,
        },
        document: filePath, // Save the file path or file URL in the database
        title,
        description,
        status: user?.role == "expert" ? "accepted" : "requested",
      });
    }
    const role = findTask?.assignedTo.role;
    PushNotifyUser({
      title: `Task completed by ${
        role == "lawyer"
          ? findTask?.assignedTo?.userId?.name
          : findTask?.assignedTo?.userId?.firstName
      }`,
      description: `A task has been completed by ${findTask?.assignedTo?.userId?.firstName}`,
      caseId: findTask?.case_id,
      addedBy: findTask?.assignedTo?.userId,
      listenTo: findTask?.assignedBy?.userId,
      role: findTask?.assignedBy?.role,
      type: "taskComplete",
    }).then((res: any) => {});

    return NextResponse.json({
      data: {
        status: 200,
        message: "Task updated successfully",
        success: true,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      status: 500,
      message: error?.message || "Internal server error",
    });
  }
}
