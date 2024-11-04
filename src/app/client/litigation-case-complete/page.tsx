"use client";
import LitigationCaseCompleteMain from "@/app/container/LItigationCompleteCase/main";
import { useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const search = useSearchParams();
  const id = search?.get("case_id");
  return (
    <>
      <LitigationCaseCompleteMain case_id={id} role={"client"} />
    </>
  );
}

export default Page;
