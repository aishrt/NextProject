"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/eye.png";
import "../../../expert/expert.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Button } from "@/components/Form/Button";
import { CircularProgress, MenuItem, Select } from "@mui/material";
import { Cases } from "@/types/Cases";

const options = [
  { label: "Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Resolved", value: "resolved" },
  { label: "Not resolved", value: "notResolved" },
];

const TaskTable = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [referenceId, setReference] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [lawyer, setLawyer] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [submissionDate, setSubmission] = useState<string>("");
  const [updatedDate, setUpdated] = useState<string>("");

  const [subVal, setDateVal] = useState<string>("");
  const [updateLstVal, setLastUpDateVal] = useState<string>("");
  const [uploadedBy, setUploadedBy] = useState<string>("");

  const [clearFilter, setClearFilter] = useState<boolean>(false);

  const { data, isLoading, isFetching, refetch } = useCases({
    referenceId,
    name,
    lawyer,
    status,
    submissionDate,
    updatedDate,
    uploadedBy,
    page,
    role: "expert",
  });

  useEffect(() => {
    refetch();
  }, [page, clearFilter, uploadedBy]);

  const handleSearch = () => {
    setClearFilter(false);
    refetch();
  };

  return (
    <div className="cases-list-table expert-table">
      {isLoading || isFetching ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Table<Cases>
          data={data?.data ?? []}
          currentPage={data?.currentPage ?? 1}
          totalEntries={data?.totalEntries ?? 10}
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
                return <span>{"#" + referenceId}</span>;
              },
            },
            {
              field: "category",
              title: "Category",
              Cell({ entry: { caseType } }) {
                return <span> Legal</span>;
              },
            },
            {
              field: "caseType",
              title: "Type",
              Cell({ entry: { caseType } }) {
                return <span> Litigation</span>;
              },
            },
            {
              field: "doc_name",
              title: "Document Name",
              Cell({ entry: { category } }) {
                return <span> {category ?? "NA"}</span>;
              },
            },
            {
              field: "createdAt",
              title: "Last Submission Date",
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
              field: "createdAt",
              title: "Valid Till",
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
              field: "description",
              title: "Description",
              Cell({ entry: {} }) {
                return (
                  <span>
                    <div className="description">
                      <span className="d-block">Lorem Ipsum</span>
                    </div>
                  </span>
                );
              },
            },
            {
              field: "title",
              title: "Title",
              Cell({ entry: {} }) {
                return (
                  <span>
                    <div className="description">
                      <span className="d-block">Lorem Ipsum</span>
                    </div>
                  </span>
                );
              },
            },
            {
              field: "status",
              title: "Status",
              Cell({ entry: {} }) {
                return <span className="pending-st">Pending</span>;
              },
            },
            {
              field: "uploaded_by",
              title: "Assigned Person",
              Cell({ entry: {} }) {
                return (
                  <span>
                    <div className="uplaoded by ">Lawyer</div>
                  </span>
                );
              },
            },
            {
              field: "reminder",
              title: "Reminder",
              Cell({ entry: {} }) {
                return <span className="reminder-done">Done</span>;
              },
            },
           
            {
              field: "_id",
              title: "Document",
              Cell({ entry: { _id } }) {
                return (
                  <span className="text-center">
                    <span className="text-center">
                      <Link
                        href={`/expert`}
                        className="dark"
                      >
                        View
                      </Link>
                    </span>
                  </span>
                );
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default TaskTable;
