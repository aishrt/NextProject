"use client";

import React, { useState } from "react";
import Table from "@/components/Table/Table";
import { useCategories } from "@/queries/category";
import { Cases } from "@/types/Cases";
import "../../../expert/expert.css";
import { Link } from "@mui/material";

const LawyerTable = () => {
  const [page, setPage] = useState(1);
  const { data, refetch, isLoading } = useCategories({ page });
  const staticData = [
    {
      ref_id: "#223333",
      type: "",
      category: "Financed Party",
      date: "",
      represent: "Financed Party",
      assigned_lawyer: "Freduardo Hill",
      sumary: "",
      status: "",
    },
    {
      ref_id: "#223333",
      type: "",
      category: "Financed Party",
      date: "",
      represent: "Financed Party",
      assigned_lawyer: "Freduardo Hill",
      sumary: "",
      status: "",
    },
    {
      ref_id: "#223333",
      type: "",
      category: "Financed Party",
      date: "",
      represent: "Financed Party",
      assigned_lawyer: "Freduardo Hill",
      sumary: "",
      status: "",
    },
  ];
  return (
    <Table<any>
      data={staticData}
      columns={[
        { field: "ref_id", title: "Case Id" },
        {
          field: "type",
          title: "Case Type ",
          Cell({ entry }) {
            return <span>Pre Litigation</span>;
          },
        },
        { field: "category", title: "Category" },
        {
          field: "date",
          title: "Date Created",
          Cell({ entry }) {
            return (
              <span>
                <div className="date-table">
                  <span className="d-block">11/01/2022</span>
                </div>
              </span>
            );
          },
        },
    
        {
          field: "status",
          title: "Status",
          Cell({ entry }) {
            return (
              <span>
                <span className="pending-status">Pending</span>
              </span>
            );
          },
        },
        {
          field: "actions",
          title: "",
          Cell({ entry }) {
            return <span>
              <Link href="/expert/assign-prelitigation-lawyer" className="assign-lawyer">Assign lawyers</Link>
              {/* <Link href="/expert" className="view-lawyer-link">View Lawyer</Link> */}
            </span>;
          },
        },
      ]}
      currentPage={data?.currentPage ?? 1}
      totalEntries={data?.totalEntries ?? 10}
      handlePageChange={(e, page) => {
        setPage(page);
        refetch();
      }}
    />
  );
};

export default LawyerTable;
