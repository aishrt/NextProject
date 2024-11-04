"use client";

import React, { useState } from "react";
import Table from "@/components/Table/Table";
import "../../../client/client.css";

export const ResTable = () => {
  const [page, setPage] = useState(1);
  //   const { refetch, isLoading } = useCases({ page });
  //   const { data, refetch, isLoading } = useCategories({ page });
  const staticData = [
    {
      ref_id: 1,
      f_name: "Name",
      phone_number: "0213444442",
      email: "test@yopmail.com",
      address: "address",
      msg: "Message",
      purpose: "Purpose",
    },
  ];
  return (
    <Table<any>
      currentPage={1}
      totalEntries={10}
      data={staticData}
      clientPagination={false}
      columns={[
        { field: "ref_id", title: "Sr. No." },
        {
          field: "f_name",
          title: "Full Name",
        },
        {
          field: "phone_number",
          title: "Phone Number",
        },
        {
          field: "email",
          title: "Email",
        },
        {
          field: "address",
          title: "Address",
        },
        {
          field: "msg",
          title: "Private Message",
        },
        {
          field: "purpose",
          title: "Purpose",
        },
      ]}
    />
  );
};
