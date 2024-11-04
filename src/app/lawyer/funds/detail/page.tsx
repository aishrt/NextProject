"use client";
import FundDetails from "@/app/container/FundDetails";
import { axios } from "@/utils/axios";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function FundView() {
  const search = useSearchParams();
  const [data, setData] = useState({});
  const id = search?.get("id");
  const getFundDetails = () => {
    axios.get(`/api/fund?id=${id}`).then((res: any) => {
        console.log(res)
      if (res?.success) {
        setData(res?.data);
      }
    });
  };
  useEffect(() => {
    if (id) {
      getFundDetails();
    }
  }, [id]);
  return (
    <>
      <FundDetails data={data} role={"lawyer"} />
    </>
  );
}

export default FundView;
