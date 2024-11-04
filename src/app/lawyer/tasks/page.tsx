"use client";

import React from "react";
import TaskTable from "@/app/container/TaskTable";
import "../../client/client.css";
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
            href={`/lawyer/tasks/add?id=` + id}
          >
            Add
          </a>
        </button>
        {/* <button className="form-control " onClick={()=>{
      }} style={{width:'140px'}}> <a href="/add-question" style={{textDecoration:'none'}}>Add Question</a> </button> */}
      </div>
      <div className="res-table-box">
        <div className="mt-4">
          <TaskTable id={id} userRole={"lawyer"} />
        </div>
      </div>
    </div>
  );
}
