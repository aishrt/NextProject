import db from "@/utils/connectDB";
import { Metadata } from "next";
import React from "react";

import ClaimFinancialModel from "@/models/claim_financial.model";
import ClaimReportModel from "@/models/cer_Report.model";
import ClaimEvalReport from "@/app/container/ClaimEvalReport";
import Case from "@/models/case.model";
import { Cases } from "@/types/Cases";

export const metadata: Metadata = {
  title: "Claim Evaluation Report",
  description: "Generated by create next app",
};

export default async function ClaimEvaluationReport({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let id: string | string[] | undefined | number = searchParams?.id;

  const fetchData = async (): Promise<any> => {
    await db.connectDB();

    const userData = await ClaimReportModel.findOne({
      case_id: id,
    }).lean();
    const caseData: Cases | null = await Case.findById(id).lean();

    return {
      data: { ...userData, isFinancialReport: caseData?.isFinancialReport },
    };
  };
  const data: any = await fetchData();

  return (
    <>
      <ClaimEvalReport data={data} role={"expert"} />
    </>
  );
}