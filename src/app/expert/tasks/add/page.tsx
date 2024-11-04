
import { PaginateData } from "@/types/Paginate";
import { User as UserType } from "@/types/User";
import db from "@/utils/connectDB";
import { Metadata } from "next";
import React from "react";
import "../../../admin/admin.css";
import CerQuestions from "@/models/cerQuestion.model";
import TaskModel from "@/models/tasks.model";
import TaskForm from "@/app/container/AddTask";

export const metadata: Metadata = {
  title: "Claim Evaluation Report",
  description: "Generated by create next app",
};

export default async function AddTask({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let page: string | string[] | undefined | number = searchParams?.page;
  let id: string | string[] | undefined | number = searchParams?.id;
  let task_id: string | string[] | undefined | number = searchParams?.task_id;

  page = !!page ? +page : 1;
  const fetchData = async (
    pageNumber: number
  ): Promise<PaginateData<UserType>> => {
    await db.connectDB();
    const totalUsers = await CerQuestions.countDocuments({ });
    const totalPages = Math.ceil(totalUsers / 10);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;

    const userData = await TaskModel.findOne({_id:task_id}).exec()
    return {
      data: userData,
      currentPage: pageNumber,
      totalEntries: totalUsers,
    };
  };

  const data = await fetchData(page);

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Add Task</h2>
      </div>
      <div className="res-table-box white-card mt-4 rounded p-5 indivi-form">
        <div className="mt-4">
          <TaskForm case_id={id} data={data} task_id={task_id} role={"expert"} />
        </div>
      </div>
    </div>
  );
}