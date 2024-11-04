"use client";

import React from "react";
import TaskTable from "@/app/container/TaskTable";
import "../../admin/admin.css";
import { useSearchParams } from "next/navigation";

export default function TasksList() {
  const params = useSearchParams();
  const id = params?.get("id");

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Case Tasks</h2>

        <button style={{ width: "140px" }} className="form-control">
          <a
            style={{ textDecoration: "none" }}
            href={`/expert/tasks/add?id=` + id}
          >
            Add
          </a>
        </button>
      </div>
      <div className="res-table-box">
        <div className="mt-4">
          <TaskTable id={id} userRole={"expert"} />
        </div>
      </div>
    </div>
  );
}
