"use client";
import Hearingdetails from "@/app/container/CourtHearing/details";
import { axios } from "@/utils/axios";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

function Page() {
  const search = useSearchParams();
  const id = search?.get("id");
  const { data: session } = useSession();
  const [details, setDetails]: any = useState({});
  const getDetails = () => {
    axios.get(`/api/court-hearing/details?id=${id}`).then((res: any) => {
      if (res?.success) {
        setDetails(res?.data);
      }
    });
  };

  useEffect(() => {
    if (id) {
      getDetails();
    }
  }, [session, id]);
  return <Hearingdetails role={"client"} details={details} />;
}

export default Page;
