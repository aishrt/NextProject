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

    const inProgress = await Case.find({ status: "pending" }).countDocuments();
    const preLitigation = await Case.find({
      caseType: "preLitigation",
    }).countDocuments();

    const litigation = await Case.find({
      caseType: "litigation",
    }).countDocuments();

    const resolved = await Case.find({
      status: "resolved",
    }).countDocuments();

    const notResolved = await Case.find({
      status: { $in: ["reject", "notResolved"] },
    }).countDocuments();

    const submitted = await Case.find({}).countDocuments();

    const activeCase = await Case.findOne({})
      .sort({ createdAt: -1 })
      .populate("user");

    const litigationLawyer = await Case.find({
      caseType: "litigation",
      isLaywerAssigned: true,
    }).countDocuments();

    const preLitigationLawyer = await Case.find({
      caseType: "preLitigation",
      isLaywerAssigned: true,
    }).countDocuments();

    const prelitigationSuccess = await Case.find({
      caseType: "preLitigation",
      status: "resolved",
    }).countDocuments();

    const litigationSuccess = await Case.find({
      caseType: "litigation",
      status: "resolved",
    }).countDocuments();

    const prelitigationFailed = await Case.find({
      caseType: "preLitigation",
      status: { $in: ["notResolved", "reject"] },
    }).countDocuments();

    const litigationFailed = await Case.find({
      caseType: "litigation",
      status: { $in: ["notResolved", "reject"] },
    }).countDocuments();

    const courtHearing = await courtHearingModel
      .findOne({})
      .sort({ createdAt: -1 })
      .populate("case_id");

    const evalReports = await ClaimReportModel.find({})
      .sort({ createdAt: -1 })
      .populate("case_id");

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

    const litigationType = [litigationSuccess, litigationFailed];

    const preLitigationType = [prelitigationSuccess, prelitigationFailed];

    return NextResponse.json(
      {
        message: "Dashboard data get successfully",
        data: {
          inProgress,
          preLitigation,
          litigation,
          resolved,
          notResolved,
          submitted,
          activeCase,
          litigationLawyer,
          preLitigationLawyer,
          courtHearing,
          evalReports,
          documents,
          statusType,
          litigationType,
          preLitigationType,
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
