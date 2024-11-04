
import { PaginateData } from "@/types/Paginate";
import { User as UserType } from "@/types/User";
import db from "@/utils/connectDB";
import { Metadata } from "next";
import React from "react";
import TaskForm from "../../../container/AddTask";
import "../../../admin/admin.css";

import AdminTaskForm from "@/app/container/AddTask/_adminAdd";


export default function AddTask() {

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Add Task</h2>
      </div>
      <div className="res-table-box">
        <div className=" mt-4">
          <AdminTaskForm />
        </div>
      </div>
    </div>
  );
}
