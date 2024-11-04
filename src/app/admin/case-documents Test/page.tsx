import { PaginateData } from "@/types/Paginate";
import { User as UserType } from "@/types/User";
import db from "@/utils/connectDB";
import { Metadata } from "next";
import React from "react";
import TaskTable from "@/app/container/TaskTable";
import "../../admin/admin.css";
import TaskModel from "@/models/tasks.model";
import mongoose from "mongoose";
import CalenderView from "@/app/container/CalenderView";
import DocumentTable from "@/app/container/DocumentsTable";
import CaseDocument from "@/models/documents.model";

export const metadata: Metadata = {
  title: "Case Tasks",
  description: "Generated by create next app",
};

export default async function TasksList({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  let page: string | string[] | undefined | number = searchParams?.page;
  // const router = useRouter();
  let id: any = searchParams?.id;
  let status: string | string[] | undefined | number = searchParams?.status;

  page = !!page ? +page : 1;
  const objectID = new mongoose.Types.ObjectId(id);

  const fetchData = async (
    pageNumber: number,
    filters: any
  ): Promise<PaginateData<UserType>> => {
    const totalUsers = await TaskModel.countDocuments({});
    const totalPages = Math.ceil(totalUsers / 10);
    if (pageNumber > totalPages) {
      pageNumber = totalPages;
    }
    const start = pageNumber - 1;

    // if (!id) {
    //   const userData = await CaseDocument.find({}).populate("case_id");
    //   return {
    //     data: userData,
    //     currentPage: pageNumber,
    //     totalEntries: totalUsers,
    //   };
    // }
    let pipline = [
      //   {
      //     $match: {
      //       $or: [
      //         {
      //           case_id: id,
      //         },
      //         {
      //           status: "pending",
      //         },
      //         {
      //           role: "expert",
      //         },
      //       ],
      //     },
      //   },

      {
        $lookup: {
          from: "cases",
          localField: "case_id",
          foreignField: "_id",
          as: "case_id",
        },
      },

      {
        $lookup: {
          from: "tasks",
          localField: "task_id",
          foreignField: "_id",
          as: "task_id",
        },
      },

      {
        $unwind: {
          path: "$case_id",
        },
      },
      {
        $unwind: {
          path: "$task_id",
        },
      },
    ];
    // if (id) {
    //   pipline.unshift({
    //     $match: {
    //       $or: [{ case_id: id }],
    //     },
    //   });
    // }
    const userData = await CaseDocument.aggregate(pipline).exec();
    return {
      data: userData,
      currentPage: pageNumber,
      totalEntries: totalUsers,
    };
  };

  let data: any = await fetchData(page, status);

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Documents</h2>

        {/* {id && (
          <button style={{ width: "140px" }} className="form-control">
            <a
              style={{ textDecoration: "none" }}
              href={`/expert/tasks/add?id=` + id}
            >
              Add
            </a>
          </button>
        )} */}
        {/* <button className="form-control " onClick={()=>{
      }} style={{width:'140px'}}> <a href="/add-question" style={{textDecoration:'none'}}>Add Question</a> </button> */}
      </div>
      <div className="res-table-box">
        <div className="table-responsive mt-4">
          <DocumentTable
            data={data}
            id={id}
            userRole={"admin"}
            status={status}
          />
          {/* <CalenderView
            data={data}
            id={id}
            userRole={"expert"}
            status={status}
          /> */}
        </div>
      </div>
    </div>
  );
}
