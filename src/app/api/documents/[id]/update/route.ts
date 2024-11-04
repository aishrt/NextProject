// pages/api/cases/documents/[id]/upload.ts

import CaseDocument from "@/models/documents.model";
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import { uploadFile } from "@/utils/upload";
import PushNotifyUser from "@/app/api/notifications/add";

export async function PUT(req: NextRequest, { params }: any) {
  try {
    // Connect to the database
    await db.connectDB();

    const server = await getServerSession(authOptions);
    const user = server?.user;
    if (!user) {
      return NextResponse.json(
        { message: "Please authenticate!" },
        { status: 403 }
      );
    }

    const { id: documentId } = params;
    const formData = await req.formData();
    const file: any = formData.get("document");

    // Fetch the document by ID
    const document = await CaseDocument.findById(documentId);
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // Check if the user is the uploader
    if (document.uploadedBy.user.toString() != user._id.toString()) {
      return NextResponse.json(
        { message: "Permission denied" },
        { status: 403 }
      );
    }

    // If a file exists, upload it and update the document
    if (file) {
      const documentUrl = await uploadFile(file); // Assumes uploadFile returns the URL
      document.document = documentUrl;
      document.status = "requested";
      await document.save();

      PushNotifyUser({
        title: `Document uploaded`,
        description: `Document uploaded by ${
          user?.role == "lawyer" ? user?.name : user?.firstName
        }`,
        caseId: document?.case_id,
        addedBy: document?.uploadedBy?.user,
        type: "docStatus",
        listenTo: null,
        role: "expert",
      }).then((res) => {});

      return NextResponse.json(
        { message: "Document uploaded successfully", data: document },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
