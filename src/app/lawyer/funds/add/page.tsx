"use client";
import AddFundForm from "@/app/container/AddFund";
import React from "react";
import "../../../lawyer/lawyer.css";
import { useSearchParams } from "next/navigation";
function Page() {
  const search = useSearchParams();
  const id = search.get("case_id");
  const isQuitense = search.get("isQuitense");
  const isLitigation = search.get("isLitigation");

  return (
    <div className="main-content expert-cases">
      <div className=" mt-4">
        <AddFundForm
          isQuitense={isQuitense}
          isLitigation={isLitigation}
          id={id}
          role={"lawyer"}
        />
      </div>
    </div>
  );
}

export default Page;
