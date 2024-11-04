"use client";
import CourtHearingAdd from "@/app/container/CourtHearing/Add";
import { useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const search = useSearchParams();
  const id = search.get("case_id");
  return (
    <>
      <CourtHearingAdd case_id={id} role={"lawyer"} />
    </>
  );
}

export default Page;
