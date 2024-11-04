import React from "react";
import "../../admin/admin.css";
import { AdminPreTaskTable } from "@/app/container/TaskTable/_AdminPreTaskTable";

export default async function TasksList(){
  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Case Tasks</h2>
        <button className="submit-btn rounded bg-white text-black">
          <a className="text-black w-max"
            style={{ textDecoration: "none" }}
            href={`/admin/pre-tasks/add`}
          >
            Add
          </a>
        </button>
      </div>
      <div className="res-table-box">
        <div className="table-responsive mt-4">
          <AdminPreTaskTable/>
        </div>
      </div>
    </div>
  );
}
