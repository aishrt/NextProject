import { PaginateData } from "@/types/Paginate";
import { User as UserType } from "@/types/User";
import db from "@/utils/connectDB";
import { Metadata } from "next";
import React from "react";
import QestionTable from "./_QestionSection";
// import "../../admin/admin.css";
import "../../expert/expert.css";

import CerQuestions from "@/models/cerQuestion.model";

export const metadata: Metadata = {
  title: "Claim Evaluation Report",
  description: "Generated by create next app",
};

export default async function ClaimEvalutionReport({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let page: string | string[] | undefined | number = searchParams?.page;
  let id: string | string[] | undefined | number = searchParams?.id;

  page = !!page ? +page : 1;
  const fetchData = async (
    pageNumber: number
  ): Promise<PaginateData<UserType>> => {
    await db.connectDB();
    const totalUsers = await CerQuestions.countDocuments({});
    const totalPages = Math.ceil(totalUsers / 10);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;

    const userData = await CerQuestions.find({});
    return {
      data: userData,
      currentPage: pageNumber,
      totalEntries: totalUsers,
    };
  };

  const data = await fetchData(page);

  console.log(data?.data, "datadatadata");

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Claim Evaluation Report</h2>
      </div>
      <div className="res-table-box">
        <div className="white-card p-4 mt-4">
          <QestionTable case_id={id} data={data} />
        </div>
      </div>
    </div>
  );
}
