"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/eye.png";
import "../../admin/admin.css";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { Button } from "@/components/Form/Button";
import { CircularProgress } from "@mui/material";
import { Cases } from "@/types/Cases";

const options = [
  { label: "Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Resolved", value: "resolved" },
  { label: "Not resolved", value: "notResolved" },
];

const CasesTable = () => {
  const router = useRouter();
  const params = useSearchParams();
  const type = params?.get("type")!;
  console.log(type);
  const [page, setPage] = useState(1);
  const [referenceId, setReference] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [lawyer, setLawyer] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [submissionDate, setSubmission] = useState<string>("");
  const [updatedDate, setUpdated] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [openUploadDocs, setopenUploadDocs] = useState<boolean>(false);
  const [UploadRef, setUploadRef]: any = useState();
  const [SelectDocs, setSelectDocs] = useState([]);
  const [CaseID, setCaseID] = useState<string>("");

  const [subVal, setDateVal] = useState<string>("");
  const [updateLstVal, setLastUpDateVal] = useState<string>("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpenUploadDOcs = () => setopenUploadDocs(true);
  const handleCloseUploadDOcs = () => setopenUploadDocs(false);
  const [clearFilter, setClearFilter] = useState<boolean>(false);

  const { data, isLoading, isFetching, refetch } = useCases({
    referenceId,
    name,
    lawyer,
    status,
    submissionDate,
    updatedDate,
    type: type,
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
    <div className="cases-list-table expert-table">
      <div className="doc-filters-form mb-3">
        <div className="row mt-4">
          <div className="col-12 col-md-12">
            <div className="row filter-docs">
              <div className="col-12 col-md-3 mb-3">
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
                    placeholder="Lawyer Name"
                    value={lawyer}
                    onChange={(e) => setLawyer(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <select
                    className="form-control filter-ip"
                    name="status"
                    //className="form-select filter-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {options.map(({ label, value }) => (
                      <option key={label?.toString()} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <label className="date-label">Submission Date:</label>
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
                <label className="date-label">Last Updated Date:</label>
                <div className="filter-input">
                  <input
                    type="date"
                    className="form-control filter-ip"
                    placeholder="Last Updated Date"
                    value={updateLstVal}
                    onChange={(e) => {
                      let date = e.target.value;
                      setLastUpDateVal(date);
                      const [year, month, day] = date.split("-");
                      setUpdated(`${day}/${month}/${year}`);
                    }}
                  />
                </div>
              </div>

              <div className=" col-12 col-md-3 filter-btn mt-4">
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
              title: "Case ID",
              Cell({ entry: { referenceId } }) {
                return <span>{"#" + referenceId}</span>;
              },
            },
            {
              field: "category",
              title: "Category",
              Cell({ entry: { category } }) {
                return <span> {category ?? "NA"}</span>;
              },
            },

            {
              field: "role",
              title: "Representative",
              Cell({ entry: { role } }) {
                return (
                  <span>
                    {role == "directParty"
                      ? "Directly Affected Party"
                      : role == "leadRepresentative"
                      ? "Lead Representative"
                      : role == "authRepresentative"
                      ? "Authorized Representative"
                      : role == "trustedPerson"
                      ? "Trusted Person"
                      : "NA"}
                  </span>
                );
              },
            },

            {
              field: "caseType",
              title: "Case Type",
              Cell({ entry: { caseType } }) {
                return <span>Pre-Litigation</span>;
              },
            },

            {
              field: "createdAt",
              title: "Submission  Date",
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
              title: "Evaluation Document",
              Cell({ entry: { documents, isEvalReport, _id } }: any) {
                return (
                  <span
                    onClick={() => {
                      // if(isEvalReport){
                      //   router.push('/admin/claim-report?id='+_id)
                      //   // setSelectDocs(documents)
                      //   // handleOpen()
                      // }else{
                      //   router.push('/admin/cer-question?id='+_id)
                      // }
                    }}
                  >
                    {" "}
                    {/* <Link href="#" className="view-documnt-pre"> */}
                    {isEvalReport ? "View Report" : "Pending"}
                    {/* </Link> */}
                  </span>
                );
              },
            },
            {
              field: "_id",
              title: "Financial Document",
              Cell({ entry: { _id, isFinancialReport } }: any) {
                return (
                  <span
                    onClick={() => {
                      // if(isFinancialReport){
                      //   router.push('/admin/financial-report/details?id='+_id)
                      // }else{
                      //   router.push('/admin/financial-report?id='+_id)
                      // }
                      // handleOpenUploadDOcs()
                      // setCaseID(_id)
                    }}
                  >
                    {isFinancialReport ? "View Report" : "Pending"}
                  </span>
                );
              },
            },
            {
              field: "task",
              title: "Task",
              Cell({ entry: { createdAt, _id } }) {
                return (
                  <span>
                    <div className="date-table">
                      <span
                        className="d-block"
                        onClick={() => router.push("/admin/tasks?id=" + _id)}
                      >
                        View Task
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
                        href={`/admin/pre-litigation-case-overview?id=${_id}`}
                        className="dark"
                      >
                        View More
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

export default CasesTable;
