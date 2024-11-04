// pages/api/cases/documents/[id]/status.ts

import CaseDocument from "@/models/documents.model";
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";
import PushNotifyUser from "@/app/api/notifications/add";

export async function PUT(req: NextRequest, { params }: any) {
  try {
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
    const { status, reason } = await req.json();

    const validStatuses = [
      "requested",
      "suggestion",
      "accepted",
      "rejected",
      "edit_request",
    ];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: "Invalid status value" },
        { status: 400 }
      );
    }

    const document = await CaseDocument.findById(documentId);
    if (!document) {
      return NextResponse.json(
        { message: "Document not found" },
        { status: 404 }
      );
    }

    // if (user.role !== 'expert') {
    //     return NextResponse.json({ message: 'Permission denied' }, { status: 403 });
    // }

    document.status = status;
    if (status == "suggestion") {
      document.reason = reason;
    }
    await document.save();

    PushNotifyUser({
      title: `Document ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `Document ${status} by ${user?.firstName}`,
      caseId: document?.case_id,
      addedBy: user._id,
      type: "docStatus",
      listenTo: document?.uploadedBy?.user,
      role: document?.uploadedBy?.role,
    }).then((res) => {});

    return NextResponse.json(
      { message: "Document status updated successfully", data: document },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating document status:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
