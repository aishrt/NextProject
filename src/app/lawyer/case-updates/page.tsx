"use client";

import TaskTable from "@/app/container/TaskTable";
import CaseUpdatesTable from "@/app/container/UpdatesTable";
import { axios } from "@/utils/axios";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const search = useSearchParams();
  const case_id = search?.get("case_id");
  const [ListData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const GetCaseUpdates = () => {
    setLoading(true);
    axios.get(`/api/case-updates/list?case_id=${case_id}`).then((res: any) => {
      if (res.success) {
        setLoading(false);

        setListData(res?.data);
      }
    });
  };

  useEffect(() => {
    if (case_id) {
      GetCaseUpdates();
    }
  }, [case_id]);
  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Case Updates</h2>

        <button style={{ width: "140px" }} className="form-control">
          <a
            style={{ textDecoration: "none" }}
            href={`/lawyer/case-updates/add?case_id=` + case_id}
          >
            Add
          </a>
        </button>
        {/* <button className="form-control " onClick={()=>{
      }} style={{width:'140px'}}> <a href="/add-question" style={{textDecoration:'none'}}>Add Question</a> </button> */}
      </div>
      <div className="res-table-box">
        <div className=" mt-4">
          <CaseUpdatesTable
            data={ListData}
            loading={loading}
            case_id={case_id}
            userRole={"lawyer"}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
