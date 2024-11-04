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

const LegalDocTable = () => {
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
      <div className="doc-filters-form mb-3">
        <div className="row mt-4">
          <div className="col-12 col-md-12">
            <div className="row filter-docs">
              <div className="col-12 col-md-2 mb-3">
                <div className="filter-input">
                  <input
                    type="number"
                    className="form-control filter-ip"
                    placeholder="Reference Id"
                    value={referenceId}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-2 mb-3">
                <div className="filter-input">
                  {/* <label className="date-label">Submission Date:</label> */}
                  <input
                    type="date"
                    className="form-control filter-ip"
                    placeholder="Submission Date"
                    value={subVal}
                    onChange={(e) => {
                      let date = e.target.value;
                      setDateVal(date);
                      const [year, month, day] = date.split("-");
                      // return `${day}/${month}/${year}`;
                      setSubmission(`${day}/${month}/${year}`);
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <input
                    type="text"
                    className="form-control filter-ip"
                    placeholder="Representative Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <input
                    type="text"
                    className="form-control filter-ip"
                    placeholder="Assigned Lawyer"
                    value={lawyer}
                    onChange={(e) => setLawyer(e.target.value)}
                  />
                </div>
              </div>

              <div className=" col-12 col-md-2 mb-3 filter-btn">
                <Button
                  variant="contained"
                  size="sm"
                  className="expert-btn"
                  onClick={handleSearch}
                >
                  <span className="f-16">Search</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

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
              title: "Sr. No",
              Cell({ entry: { referenceId } }) {
                return <span>{"#" + referenceId}</span>;
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
              field: "caseType",
              title: "Type",
              Cell({ entry: { caseType } }) {
                return <span> Litigation</span>;
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
              field: "uploaded_by",
              title: "Uploaded By",
              Cell({ entry: {} }) {
                return (
                  <span>
                    <div className="uplaoded by ">
                     Lawyer
                    </div>
                  </span>
                );
              },
            },
            {
              field: "uploadedBy",
              title: (
                <div className="upload-select-th border-0">
                  Uploaded By
                  <Select
                    value={uploadedBy}
                    onChange={(e) => {
                      setUploadedBy(e.target.value); // Update state with selected value
                    }}
                    displayEmpty
                    className="ml-2 border-none"
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="lawyer">Lawyer</MenuItem>
                    <MenuItem value="manager">Case Manager</MenuItem>
                  </Select>
                </div>
              ),
              Cell({ entry: { uploadedBy } }) {
                return <span>{uploadedBy ?? "NA"}</span>;
              },
            },
            {
              field: "createdAt",
              title: "Uploaded On",
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
                        <Image src={view} className="" alt="" />
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

export default LegalDocTable;
