"use client";

import TaskTable from "@/app/container/TaskTable";
import CaseUpdatesTable from "@/app/container/UpdatesTable";
import { axios } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const search = useSearchParams();
  const case_id = search?.get("case_id");
  const [loading, setLoading] = useState(false);

  const [ListData, setListData] = useState([]);
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
      </div>
      <div className="res-table-box">
        <div className=" mt-4">
          <CaseUpdatesTable
            data={ListData}
            case_id={case_id}
            loading={loading}
            userRole={"client"}
          />
        </div>
      </div>
    </div>
  );
}

export default Page;
