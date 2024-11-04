import CaseDocument from "@/models/documents.model";
import { authOptions } from "@/server/auth";
import db from "@/utils/connectDB";
import { uploadFile } from "@/utils/upload";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "@/app/api/notifications/add";
import Case from "@/models/case.model";

export async function POST(req: NextRequest) {
  try {
    await db.connectDB();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized user" },
        { status: 401 }
      );
    }
    const formData = await req.formData();

    const case_id = formData.get("case_id");
    const task_id = formData.get("task_id");
    const document: any = formData.get("document");
    const title = formData.get("title");
    const description = formData.get("description");
    const category = formData.get("category");

    if (!case_id || !document || !title) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let status =
      user.role === "client" || user.role === "lawyer"
        ? "requested"
        : "accepted";

    let fileUrl;
    if (document) {
      try {
        fileUrl = await uploadFile(document!); // Assuming uploadFile accepts File and returns the uploaded file URL
        console.log(document, fileUrl);
      } catch (uploadError) {
        console.error("Error uploading file:", uploadError);
        return NextResponse.json(
          { message: "Failed to upload document" },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { message: "Invalid document file" },
        { status: 400 }
      );
    }
    const findCase = await Case.findOne({ _id: case_id });

    const newDocument = new CaseDocument({
      case_id,
      task_id,
      role: user.role,
      document: fileUrl,
      title,
      description,
      status,
      category,
      uploadedBy: {
        user: user._id,
        role: user.role,
      },
    });

    const savedDocument = await newDocument.save();

    const notifications = [];
    const addedByRole = user?.role;

    if (addedByRole === "client") {
      notifications.push(
        {
          listenTo: findCase?.expert ?? null,
          role: "expert",
        },
        {
          listenTo: findCase?.lawyer ?? null,
          role: "lawyer",
        }
      );
    } else if (addedByRole === "expert") {
      notifications.push(
        {
          listenTo: findCase?.user ?? null,
          role: "client",
        },
        {
          listenTo: findCase?.lawyer ?? null,
          role: "lawyer",
        }
      );
    } else if (addedByRole === "lawyer") {
      notifications.push(
        {
          listenTo: findCase?.expert ?? null,
          role: "expert",
        },
        {
          listenTo: findCase?.user ?? null,
          role: "client",
        }
      );
    }

    notifications.forEach(({ listenTo, role }) => {
      PushNotifyUser({
        title: `New Document Added`,
        description: `New document added by ${
          addedByRole === "lawyer" ? user?.name : user?.firstName
        }`,
        caseId: case_id,
        addedBy: user._id,
        type: "addDocument",
        listenTo,
        role,
      }).then((res) => {});
    });

    return NextResponse.json(
      { message: "Document added successfully", data: savedDocument },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding document:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
