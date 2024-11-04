"use client";

import React, { useState } from "react";
import Table from "@/components/Table/Table";
import "../../../client/client.css";

export const SharedTable = () => {
  const [page, setPage] = useState(1);
  //   const { refetch, isLoading } = useCases({ page });
  //   const { data, refetch, isLoading } = useCategories({ page });
  const staticData = [
    {
      ref_id: 1,
      f_name: "Lorem Ipsum",
      phone_number: "0213444442",
      email: "test@yopmail.com",
      address: "234 Boston",
      purpose: "Lorem Ipsum",
      status: "",
      shared_on: "22/04/24",
      deadline: "22/04/24",
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
          field: "purpose",
          title: "Purpose",
        },
        {
            field: "status",
            title: "Status",
            Cell({ entry }) {
                return <span className="pending-status">Pending</span>;
            },
          },
          {
            field: "shared_on",
            title: "Shared On",
          },
          {
            field: "deadline",
            title: "Deadline",
          },
      ]}
    />
  );
};
