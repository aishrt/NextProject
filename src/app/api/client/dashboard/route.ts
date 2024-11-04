import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Case from "@/models/case.model";
import courtHearingModel from "@/models/court.hearing.model";
import ClaimReportModel from "@/models/cer_Report.model";
import CaseDocument from "@/models/documents.model";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    const server: any = await getServerSession(authOptions);
    const user = server.user || null;

    const activeCases = await Case.find({
      user: user?._id,
      status: "active",
    }).countDocuments();

    const inProgress = await Case.find({
      user: user?._id,
      status: "pending",
    }).countDocuments();

    const litigation = await Case.find({
      user: user?._id,
      caseType: "litigation",
    }).countDocuments();

    const preLitigation = await Case.find({
      user: user?._id,
      caseType: "preLitigation",
    }).countDocuments();

    const resolved = await Case.find({
      user: user?._id,
      status: "resolved",
    }).countDocuments();

    const notResolved = await Case.find({
      user: user?._id,
      status: { $in: ["reject", "notResolved"] },
    }).countDocuments();

    const submitted = await Case.find({ user: user?._id }).countDocuments();

    const caseProgress = await Case.find({ user: user?._id }).sort({
      createdAt: -1,
    });

    const documents = await CaseDocument.find({ role: { $nin: ["expert"] } })
      .sort({ createdAt: -1 })
      .populate("case_id");

    const statusType = [
      inProgress,
      preLitigation,
      litigation,
      resolved,
      notResolved,
      submitted,
    ];

    return NextResponse.json(
      {
        message: "Dashboard data get successfully",
        data: {
          activeCases,
          inProgress,
          resolved,
          notResolved,
          submitted,
          litigation,
          preLitigation,
          statusType,
          caseProgress,
          documents,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error?.message || "Internal server error",
      },
      { status: 400 }
    );
  }
}
