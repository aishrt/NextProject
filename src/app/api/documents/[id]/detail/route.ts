import CaseDocument from "@/models/documents.model";
import User from "@/models/user.model"; // Assuming you have a User model
import Lawyer from "@/models/lawyer.model"; // Assuming you have a Lawyer model
import Expert from "@/models/expert.model"; // Assuming you have an Expert model
import db from "@/utils/connectDB";
import { getServerSession } from "next-auth";
import { authOptions } from "@/server/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: any) {
  try {
    // Connect to the database
    await db.connectDB();
    const status = req.nextUrl.searchParams.get("status");
    // Fetch the user's session to determine their role
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { message: "Please authenticate!" },
        { status: 403 }
      );
    }

    const { id: id } = params;

    const documents = await CaseDocument.findOne({ _id: id })
      .populate({
        path: "task_id",
        select: "title description",
      })
      .populate({
        path: "case_id",
        select: "referenceId",
      });
    let useDetails = {};
    if (documents?.uploadedBy?.role == "client") {
      let userData = await User.findOne({ _id: documents?.uploadedBy?.user });
      useDetails = userData;
    }
    if (documents?.uploadedBy?.role == "expert") {
      let userData = await Expert.findOne({ _id: documents?.uploadedBy?.user });
      useDetails = userData;
    }
    if (documents?.uploadedBy?.role == "lawyer") {
      let userData = await Lawyer.findOne({ _id: documents?.uploadedBy?.user });
      useDetails = userData;
    }
    return NextResponse.json({
      data: { documents, userDetails: useDetails },
      success: true,
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
