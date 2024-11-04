"use client";
import QuitenseMain from "@/app/container/QuiteseStep/main";
import { useSearchParams } from "next/navigation";
import React from "react";

function Page() {
  const search = useSearchParams();
  const id = search?.get("case_id");
  return (
    <>
      <QuitenseMain case_id={id} role={"client"} />
    </>
  );
}

export default Page;
