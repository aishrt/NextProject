"use client";
import CourtHearingAdd from "@/app/container/CourtHearing/Add";
import CourtHearingList from "@/app/container/CourtHearing/List";
import { axios } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const [list, setLIst] = useState([]);
  const search = useSearchParams();
  const id = search?.get("id");
  const [loading, setLoading] = useState(false);
  const getDocs = () => {
    setLoading(true);
    axios.get(`/api/court-hearing?case_id=${id}`).then((res: any) => {
      console.log(res);
      if (res?.success) {
        setLoading(false);
        setLIst(res?.data);
      }
    });
  };
  useEffect(() => {
    if (id) {
      getDocs();
    }
  }, [id]);
  return (
    <>
      <CourtHearingList loading={loading} role={"lawyer"} data={list} id={id} />
    </>
  );
}

export default Page;
