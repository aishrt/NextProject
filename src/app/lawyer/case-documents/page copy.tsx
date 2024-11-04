"use client";

import { CaseFolders } from "@/app/container/caseFolders";

export default function TasksList() {
  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Case-Documents</h2>

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
          <CaseFolders />
        </div>
      </div>
    </div>
  );
}
