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
    const type = req.nextUrl.searchParams.get("type");
    const category = req.nextUrl.searchParams.get("category");
    const page: any = req.nextUrl.searchParams.get("page") || 1;

    // Fetch the user's session to determine their role
    const session = await getServerSession(authOptions);
    const user = session?.user;
    if (!user) {
      return NextResponse.json(
        { message: "Please authenticate!" },
        { status: 403 }
      );
    }

    const { id: case_id } = params;
    let query: any = { case_id };
    if (status) {
      query.status = status;
    }

    if (type) {
      if (type == "claim") {
        query["role"] = "client";
      }
      if (type == "legal") {
        query["role"] = "expert";
      }
      if (type == "lawyer") {
        query["role"] = "lawyer";
      }

      if (type == "all") {
        query["$or"] = [
          { role: { $regex: "lawyer", $options: "i" } },
          { role: { $regex: "client", $options: "i" } },
        ];
      }
    }
    if (category) {
      query["category"] = category;
    }
    const totalCount = await CaseDocument.countDocuments(query);
    const totalPages = Math.ceil(totalCount / 10);

    let pageNumber = parseInt(page);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const skip = (pageNumber - 1) * 10;
    // Find documents by case_id and populate task_id and case_id
    const documents = await CaseDocument.find(query)
      .populate({
        path: "task_id",
        select: "title description",
      })
      .populate({
        path: "case_id",
        select: "referenceId",
      })
      .sort({ createdAt: -1 })
      .skip(skip < 0 ? 0 : skip)
      .limit(10)
      .exec();

    // Check and include user details based on the role of the uploadedBy.user field
    const enrichedDocuments = await Promise.all(
      documents.map(async (doc) => {
        let userDetails = null;
        const uploadedByRole = doc.uploadedBy?.role;

        if (uploadedByRole === "client") {
          userDetails = await User.findById(doc.uploadedBy.user);
        } else if (uploadedByRole === "lawyer") {
          userDetails = await Lawyer.findById(doc.uploadedBy.user);
        } else if (uploadedByRole === "expert") {
          userDetails = await Expert.findById(doc.uploadedBy.user);
        }

        // Attach user details to the document
        return {
          ...doc.toObject(),
          user_details: userDetails
            ? {
                _id: userDetails._id,
                name:
                  userDetails.firstName ||
                  userDetails.lastName ||
                  userDetails.name,
                email: userDetails.email,
                role: userDetails.role,
              }
            : null,
        };
      })
    );

    if (enrichedDocuments.length === 0) {
      return NextResponse.json(
        { message: "No documents found for this case", data: [] },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        data: {
          data: enrichedDocuments,
          totalEntries: totalCount,
          currentPage: pageNumber,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
