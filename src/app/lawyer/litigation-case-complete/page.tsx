"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import LitigationCaseCompleteMain from "@/app/container/LItigationCompleteCase/main";
function Page() {
  const search = useSearchParams();
  const id = search?.get("case_id");
  return (
    <>
      <LitigationCaseCompleteMain case_id={id} role={"lawyer"} />
    </>
  );
}

export default Page;
