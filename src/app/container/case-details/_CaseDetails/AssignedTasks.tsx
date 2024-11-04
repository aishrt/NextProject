"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/eye.png";
import "../../../expert/expert.css";
import Link from "next/link";
import Image from "next/image";
import moment from "moment";
import { Cases } from "@/types/Cases";
import { Button } from "@/components/Form/Button";

const AssignedTask = () => {
  const [page, setPage] = useState(1);
  const [referenceId, setReference] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [lawyer, setLawyer] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [submissionDate, setSubmission] = useState<string>("");
  const [updatedDate, setUpdated] = useState<string>("");
  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const { data, isLoading, isFetching, refetch } = useCases({
    referenceId,
    name,
    lawyer,
    status,
    submissionDate,
    updatedDate,
    page,
    role: "expert",
  });

  useEffect(() => {
    refetch();
  }, [page, clearFilter]);

  const handleSearch = () => {
    setClearFilter(false);
    refetch();
  };

  return (
    <div className="cases-list-table pink-header expert-table">
      <Table<Cases>
        data={data?.data ?? []}
        currentPage={data?.currentPage ?? 1}
        totalEntries={data?.totalEntries ?? 10}
        clientPagination={false}
        handlePageChange={(e, page) => {
          console.log(page);
          setPage(page);
          refetch();
        }}
        columns={[
          {
            field: "referenceId",
            title: "Case ID",
            Cell({ entry: { referenceId } }) {
              return <span>#12212f</span>;
            },
          },
          {
            field: "category",
            title: "Task Name",
            Cell({ entry: {} }) {
              return <span> Lorem Ipsum</span>;
            },
          },
          {
            field: "createdAt",
            title: " Date",
            Cell({ entry: { createdAt } }) {
              return (
                <span>
                  <div className="date-table">
                    <span className="d-block">
                      {moment(createdAt).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </span>
              );
            },
          },
          {
            field: "status",
            title: "Status",
            Cell({ entry: {} }) {
              return <span className="not-upload"> Not Uploaded</span>;
            },
          },
          {
            field: "_id",
            title: "Action",
            Cell({ entry: { _id } }) {
              return (
                <span className="text-center">
                  <span className="text-center">
                    <Link
                      href={`/expert/litigation-case-overview?id=${_id}`}
                      className="dark"
                    >
                      <Image src={view} className="view-icon-table" alt="" />
                    </Link>
                  </span>
                </span>
              );
            },
          },
        ]}
      />
      <div className="view-task text-end mt-3">
        <Button variant="contained" className="expert-btn">View All</Button>
      </div>
    </div>
  );
};

export default AssignedTask;
