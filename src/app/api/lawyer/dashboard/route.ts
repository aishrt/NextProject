import db from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";
import Case from "@/models/case.model";
import courtHearingModel from "@/models/court.hearing.model";
import ClaimReportModel from "@/models/cer_Report.model";
import CaseDocument from "@/models/documents.model";
import ClaimFinancialModel from "@/models/claim_financial.model";

export async function GET(req: NextRequest) {
  try {
    db.connectDB();
    const server: any = await getServerSession(authOptions);
    const user = server.user || null;

    const activeCases = await Case.find({
      lawyer: user?._id,
      status: "active",
    }).countDocuments();

    const inProgress = await Case.find({
      lawyer: user?._id,
      status: "pending",
    }).countDocuments();

    const preLitigation = await Case.find({
      lawyer: user?._id,
      caseType: "preLitigation",
    }).countDocuments();

    const litigation = await Case.find({
      lawyer: user?._id,
      caseType: "litigation",
    }).countDocuments();

    const resolved = await Case.find({
      lawyer: user?._id,
      status: "resolved",
    }).countDocuments();

    const notResolved = await Case.find({
      lawyer: user?._id,
      status: { $in: ["reject", "notResolved"] },
    }).countDocuments();

    const submitted = await Case.find({ lawyer: user?._id }).countDocuments();

    const activeCase = await Case.findOne({ lawyer: user?._id })
      .sort({ createdAt: -1 })
      .populate("user");

    const litigationLawyer = await Case.find({
      lawyer: user?._id,
      caseType: "litigation",
      isLaywerAssigned: true,
    }).countDocuments();

    const preLitigationLawyer = await Case.find({
      lawyer: user?._id,
      caseType: "preLitigation",
      isLaywerAssigned: true,
    }).countDocuments();

    const prelitigationSuccess = await Case.find({
      lawyer: user?._id,
      caseType: "preLitigation",
      status: "resolved",
    }).countDocuments();

    const litigationSuccess = await Case.find({
      lawyer: user?._id,
      caseType: "litigation",
      status: "resolved",
    }).countDocuments();

    const prelitigationFailed = await Case.find({
      lawyer: user?._id,
      caseType: "preLitigation",
      status: { $in: ["notResolved", "reject"] },
    }).countDocuments();

    const litigationFailed = await Case.find({
      lawyer: user?._id,
      caseType: "litigation",
      status: { $in: ["notResolved", "reject"] },
    }).countDocuments();

    const courtHearing = await courtHearingModel
      .findOne({ addedBy: user?._id })
      .sort({ createdAt: -1 })
      .populate("case_id");

    const evalReports = await ClaimFinancialModel.find({ lawyer: user?._id })
      .sort({ createdAt: -1 })
      .populate("case_id");

    const findCases = await Case.find({ lawyer: user?._id });
    let documents: any = [];
    for (const val of findCases) {
      const caseDocs = await CaseDocument.find({
        role: { $nin: ["lawyer"] },
        case_id: val?._id,
      })
        .sort({ createdAt: -1 })
        .populate("case_id");
      documents.push(...caseDocs);
    }

    const statusType = [
      activeCases,
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
          activeCases,
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
