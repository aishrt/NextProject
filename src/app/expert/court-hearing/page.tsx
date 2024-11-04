"use client";
import CourtHearingAdd from "@/app/container/CourtHearing/Add";
import CourtHearingList from "@/app/container/CourtHearing/List";
import { axios } from "@/utils/axios";
import React, { useEffect, useState } from "react";

function Page() {
  const [list, setLIst] = useState([]);
  const [loading, setLoading] = useState(false);
  const getDocs = () => {
    setLoading(true);
    axios.get("/api/court-hearing").then((res: any) => {
      console.log(res);
      if (res?.success) {
        setLoading(false);

        setLIst(res?.data);
      }
    });
  };
  useEffect(() => {
    getDocs();
  }, []);
  return (
    <>
      <CourtHearingList loading={loading} role={"expert"} data={list} />
    </>
  );
}

export default Page;
