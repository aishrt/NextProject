import { PaginateData } from "@/types/Paginate";
import { User as UserType } from "@/types/User";
import db from "@/utils/connectDB";
import { Metadata } from "next";
import React from "react";
import "../../../admin/admin.css";
import CerQuestions from "@/models/cerQuestion.model";

export const metadata: Metadata = {
  title: "Claim Evaluation Question",
  description: "Generated by create next app",
};

export default async function CerQuestionsList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let page: string | string[] | undefined | number = searchParams?.page;
  // const router = useRouter();
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

    const userData = await CerQuestions.findOne({ _id: id });

    return {
      data: userData,
      currentPage: pageNumber,
      totalEntries: totalUsers,
    };
  };

  const data: any = await fetchData(page);

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Claim Evaluation Report Questions</h2>
        <button className="submit-btn rounded bg-white">
          <a
            className="text-black"
            style={{ textDecoration: "none" }}
            href="/admin/cer-questions"
          >
            Back
          </a>
        </button>
        {/* <button className="form-control " onClick={()=>{
      }} style={{width:'140px'}}> <a href="/add-question" style={{textDecoration:'none'}}>Add Question</a> </button> */}
      </div>
      <div className="res-table-box">
        <div className="question-edit-form mt-4">
          <div className="cases-list-table white-card p-5 rounded expert-table">
            <div className="">
              <div className="graph_dev">
                <h6 className="d-block">Question</h6>
                <input
                  required
                  className="form-control graph_input"
                  value={data?.data?.question}
                  disabled
                  name="question"
                  type="text"
                  placeholder=""
                />
              </div>
              <div className="graph_dev mt-3">
                <h6 className="d-block">Limit</h6>
                <input
                  required
                  className="form-control graph_input"
                  value={data?.data?.limit}
                  disabled
                  name="limit"
                  type="number"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
