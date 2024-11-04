import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import "../../expert/expert.css";
import db from "@/utils/connectDB";
import ClaimFinancialModel from "@/models/claim_financial.model";
import Case from "@/models/case.model";
import { Cases } from "@/types/Cases";
import FinancialReport from "@/app/container/lawyer-financial-report/page";
import Request from "@/models/caseRequests.model";
import { RequestType } from "@/types/Request";
import { authOptions } from "@/server/auth";
import { getServerSession } from "next-auth";

export const metadata: Metadata = {
  title: "Financial Report",
  description: "Generated by create next app",
};

export default async function FinancialReportView({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let id: string | string[] | undefined | number = searchParams?.id;

  const fetchData = async (): Promise<any> => {
    await db.connectDB();

    const server: any = await getServerSession(authOptions);
    let user = null;
    if (server && server.user) {
      user = server.user;
    }

    const userData = await ClaimFinancialModel.findOne({ case_id: id })
      .limit(1)
      .lean();
    const caseData: Cases | null = await Case.findById(id).lean();
    const request: RequestType | null = await Request.findOne({
      lawyer: user?._id,
      caseId: id,
    }).lean();

    return {
      data: {
        ...userData,
        request,
        lawyerFinancialReport: caseData?.lawyerFinancialReport,
      },
    };
  };

  const data: any = await fetchData();

  return (
    <div className="main-content expert-cases case-updates">
      <FinancialReport report={data} role={"lawyer"} />
    </div>
  );
}