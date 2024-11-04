"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import down from "@/assets/down.png";
import view from "@/assets/view.png";
import eye from "@/assets/eye.png";
import { FaUserTag } from "react-icons/fa6";
import "../../../client/client.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import moment from "moment";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { upperFirst } from "lodash";
import { Cases } from "@/types/Cases";
import { useSession } from "next-auth/react";

const options = [
  { label: "Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Resolved", value: "resolved" },
  { label: "Not resolved", value: "notResolved" },
  { label: "Reject", value: "reject" },
];

const CreateReport = () => {
  return <Button variant="outline">Create</Button>;
};

const ViewTasks = () => {
  return (
    <Button variant="outline" className="w-max">
      View Tasks
    </Button>
  );
};

const ViewReport = () => {
  return <Button variant="outline">View Report</Button>;
};

const CaseTable = ({ role }: { role: string }) => {
  const router = useRouter();
  const params = useSearchParams();
  const type = params && params.get("type");

  const [page, setPage] = useState(1);

  const [referenceId, setReference] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [lawyer, setLawyer] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [submissionDate, setSubmission] = useState<string>("");
  const [updatedDate, setUpdated] = useState<string>("");

  const [subVal, setDateVal] = useState<string>("");
  const [updateLstVal, setLastUpDateVal] = useState<string>("");

  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const session = useSession();
  const { data, isLoading, isFetching, refetch } = useCases({
    referenceId,
    name,
    lawyer,
    status,
    submissionDate,
    updatedDate,
    type: type ?? "",
    page,
    user: session?.data?.user?._id || "",
    role: role,
  });
  useEffect(() => {
    if (session?.data?.user) {
      refetch();
    }
  }, [session, clearFilter, type]);

  const handleSearch = () => {
    setClearFilter(false);
    refetch();
  };
  console.log(type, "=========case data");

  return (
    <div className="">
      <div className="doc-filters-form mb-3">
        <div className="row mt-2">
          <div className="col-12 col-md-12">
            <div className="row filter-docs align-items-end">
              <div className="col-12 col-md-4 col-xxl-3 mt-3">
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

              {role != "lawyer" && (
                <div className="col-12 col-md-4 col-xxl-3 mt-3">
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
              )}

              {role != "lawyer" && (
                <div className="col-12 col-md-4 col-xxl-3 mt-3">
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
              )}

              <div className="col-12 col-md-4 col-xxl-2 mt-3">
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

              <div className="col-12 col-md-4 col-xxl-2 mt-3">
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
                      if (date) {
                        setSubmission(`${day}/${month}/${year}`);
                      } else {
                        setSubmission("");
                      }
                    }}
                  />
                </div>
              </div>

              <div className="col-12 col-md-4 col-xxl-2 mt-3">
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

              <div className=" col-12 col-md-4 col-xxl-2 mt-3 filter-btn">
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
              title: "Reference Id",
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
              field: "lawyer",
              title: "Assigned Lawyer",
              Cell({ entry: { lawyer } }) {
                return (
                  <span>{upperFirst(lawyer?.name) || "Not Assigned"}</span>
                );
              },
            },
            {
              field: "caseType",
              title: "Case Type",
              Cell({ entry: { caseType } }) {
                return (
                  <span>
                    {caseType == "litigation" ? "Litigation" : "Pre-Litigation"}
                  </span>
                );
              },
            },
            {
              field: "_id",
              title: "Evaluation Document",
              Cell({
                entry: { documents, prepareGraph, isEvalReport, _id },
              }: any) {
                return (
                  <span
                    onClick={() => {
                      if (isEvalReport) {
                        router.push(`/${role}/eval-report?id=` + _id);
                        // setSelectDocs(documents)
                        // handleOpen()
                      } else {
                        if (role == "client") {
                          return false;
                        }
                        if (role == "lawyer") return false;
                        if (role == "expert") {
                          router.push(`/${role}/cer-question?id=` + _id);
                        }
                      }
                    }}
                  >
                    {role == "client" && isEvalReport && <ViewReport />}
                    {role == "client" && !isEvalReport && "Pending"}
                    {role == "expert" && isEvalReport && <ViewReport />}
                    {role == "expert" && !isEvalReport && <CreateReport />}
                    {role == "admin" && !isEvalReport && "Pending"}
                    {role == "admin" && isEvalReport && <ViewReport />}
                    {role == "lawyer" && !isEvalReport && "Pending"}
                    {role == "lawyer" && isEvalReport && "Uploaded"}
                  </span>
                );
              },
            },
            {
              field: "_id",
              title: "Financial Document",
              Cell({ entry: { _id, isFinancialReport, isEvalReport } }: any) {
                return (
                  <span
                    onClick={() => {
                      if (
                        role == "client" &&
                        (!isFinancialReport || !isEvalReport)
                      ) {
                        return false;
                      }
                      if (role == "expert" && !isFinancialReport) {
                        router.push(
                          `/${role}/create-financial-report?id=` + _id
                        );
                      } else {
                        if (role == "lawyer") return false;
                        router.push(`/${role}/financial-report?id=` + _id);
                      }
                    }}
                  >
                    {role == "client" && isFinancialReport && isEvalReport && (
                      <ViewReport />
                    )}
                    {role == "client" &&
                      isFinancialReport &&
                      !isEvalReport &&
                      "Pending"}
                    {role == "client" &&
                      !isFinancialReport &&
                      isEvalReport &&
                      "Pending"}
                    {role == "client" &&
                      !isFinancialReport &&
                      !isEvalReport &&
                      "Pending"}

                    {role == "expert" && isFinancialReport && <ViewReport />}
                    {role == "expert" && !isFinancialReport && <CreateReport />}
                    {role == "admin" && !isFinancialReport && "Pending"}
                    {role == "admin" && isFinancialReport && <ViewReport />}
                    {role == "lawyer" && !isFinancialReport && "Pending"}
                    {role == "lawyer" && isFinancialReport && "Uploaded"}
                  </span>
                );
              },
            },

            {
              field: "task",
              title: "Task",
              Cell({ entry: { createdAt, _id } }: any) {
                return (
                  <span>
                    <div className="date-table">
                      <span
                        className="d-block w-max"
                        onClick={() => router.push(`/${role}/tasks?id=` + _id)}
                      >
                        <ViewTasks />
                      </span>
                    </div>
                  </span>
                );
              },
            },
            // {
            //   field: "tasks",
            //   title: "Task",
            //   Cell({ entry: { caseType, _id } }: any) {
            //     return (
            //       <span
            //         onClick={() => {
            //           router.push(`/client/tasks?id=${_id}`);
            //         }}
            //       >
            //         View Task
            //       </span>
            //     );
            //   },
            // },

            {
              field: "createdAt",
              title: "Created On",
              Cell({ entry: { createdAt } }) {
                return (
                  <span>
                    <div className="date-table">
                      <span className="d-block">
                        {moment(createdAt).format("DD MMM YYYY (hh:mm A)")}
                      </span>
                      {/* {moment(createdAt).format("h:mm a")} */}
                      {/* </span> */}
                    </div>
                  </span>
                );
              },
            },
            {
              field: "updatedAt",
              title: "Last Updated",
              Cell({ entry: { updatedAt } }) {
                return (
                  <span>
                    <div className="date-table">
                      <span className="d-block">
                        {moment(updatedAt).format("DD MMM YYYY (hh:mm A)")}
                      </span>
                    </div>
                  </span>
                );
              },
            },
            {
              field: "status",
              title: "Status",
              Cell({ entry: { status } }) {
                return (
                  <span
                    className={`text-capitalize ${
                      status == "pending"
                        ? "pending-status"
                        : status == "active"
                        ? "active-status"
                        : status == "resolved"
                        ? "active-status"
                        : status == "notResolved"
                        ? "notresolve-status"
                        : "pending-status"
                    }`}
                  >
                    {status == "notResolved" ? "Not Resolved" : status}
                  </span>
                );
              },
            },

            {
              field: "_id",
              title: "Actions",
              Cell({
                entry: {
                  _id,
                  isEvalReport,
                  isFinancialReport,
                  isLaywerAssigned,
                },
              }) {
                return (
                  <span className="text-center">
                    {/* {type == "preLitigation" && (
                      <Link href="/">
                        <span>
                          <Image src={down} alt="" className="" />
                        </span>
                      </Link>
                    )} */}

                    <span
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        router.push(`/${role}/case-overview?id=${_id}`)
                      }
                    >
                      <Image
                        src={eye}
                        // src={ view}
                        alt=""
                        className=""
                      />
                    </span>
                    {/* {type == "litigation" &&
                      role == "expert" &&
                      isEvalReport &&
                      isFinancialReport &&
                      !isLaywerAssigned && (
                        <span
                          onClick={() =>
                            router.push(
                              `/expert/assign-litigation-lawyer?case_id=${_id}`
                            )
                          }
                          style={{ marginLeft: "5px" }}
                          title="Assign Lawyer"
                        >
                          <FaUserTag size={17} />
                        </span>
                      )} */}
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

export default CaseTable;
