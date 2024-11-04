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

  const [page, setPage] = useState(1);

  const [referenceId, setReference] = useState<string>("");

  const [status, setStatus] = useState<string>("");
  const [submissionDate, setSubmission] = useState<string>("");
  const [updatedDate, setUpdated] = useState<string>("");

  const [subVal, setDateVal] = useState<string>("");
  const [updateLstVal, setLastUpDateVal] = useState<string>("");

  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const { data: user } = useSession();
  const session = user?.user;

  const { data, isLoading, isFetching, refetch } = useCases({
    referenceId,
    status,
    submissionDate,
    type: "litigation",
    page,
    user: session?._id || "",
    role: role,
  });
  useEffect(() => {
    refetch();
  }, []);

  const handleSearch = () => {
    refetch();
  };

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

              {/* <div className="col-12 col-md-4 col-xxl-2 mt-3">
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
              </div> */}

              <div className="col-12 col-md-4 col-xxl-2 mt-3">
                <div className="filter-input">
                  {/* <label className="date-label">Date:</label> */}
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

            // {
            //   field: "caseType",
            //   title: "Case Type",
            //   Cell({ entry: { caseType } }) {
            //     return <span className="">{upperFirst(caseType)}</span>;
            //   },
            // },

            {
              field: "_id",
              title: "Financial Report",
              Cell({
                entry: {
                  _id,
                  isFinancialReport,
                  isEvalReport,
                  lawyerFinancialReport,
                },
              }: any) {
                return (
                  <span
                    onClick={() => {
                      if (
                        role == "expert" &&
                        isFinancialReport &&
                        !lawyerFinancialReport
                      ) {
                        router.push(
                          `/${role}/create-financial-report?id=${_id}&type=lawyer`
                        );
                      }
                      if (role == "expert" && lawyerFinancialReport) {
                        router.push(
                          `/${role}/lawyer-financial-report?id=` + _id
                        );
                      }
                    }}
                  >
                    {role == "expert" && lawyerFinancialReport && (
                      <ViewReport />
                    )}
                    {role == "expert" &&
                      isFinancialReport &&
                      !lawyerFinancialReport && <CreateReport />}

                    {role == "expert" &&
                      !isFinancialReport &&
                      !lawyerFinancialReport &&
                      "Pending client report"}

                    {/* {role == "admin" && !lawyerFinancialReport && "Pending"}
                    {role == "admin" && lawyerFinancialReport && <ViewReport />} */}
                  </span>
                );
              },
            },

            {
              field: "_id",
              title: "Assign lawyers",
              Cell({ entry: { _id, lawyerFinancialReport, requestStatus } }) {
                return (
                  <span>
                    {lawyerFinancialReport &&
                    (requestStatus == "pending" ||
                      requestStatus == "requested") ? (
                      <a
                        onClick={() =>
                          router.push(
                            `/expert/assign-litigation-lawyer?case_id=${_id}`
                          )
                        }
                        className="assign-lawyer cursor"
                      >
                        Assign lawyers
                      </a>
                    ) : requestStatus == "accepted" ? (
                      <a className="assign-lawyer">
                        {upperFirst(requestStatus)}
                      </a>
                    ) : (
                      <a className="assign-lawyer">Pending </a>
                    )}
                  </span>
                );
              },
            },

            {
              field: "createdAt",
              title: "Date Created",
              Cell({ entry: { createdAt } }) {
                return (
                  <span>
                    <div className="date-table">
                      <span className="d-block">
                        {moment(createdAt).format("DD MMM YYYY")}
                      </span>
                    </div>
                  </span>
                );
              },
            },
            // {
            //   field: "updatedAt",
            //   title: "Last Updated",
            //   Cell({ entry: { updatedAt } }) {
            //     return (
            //       <span>
            //         <div className="date-table">
            //           <span className="d-block">
            //             {moment(updatedAt).format("DD MMM YYYY (hh:mm A)")}
            //           </span>
            //         </div>
            //       </span>
            //     );
            //   },
            // },

            // {
            //   field: "status",
            //   title: "Status",
            //   Cell({ entry: { status } }) {
            //     return (
            //       <span
            //         className={`text-capitalize ${
            //           status == "pending"
            //             ? "pending-status"
            //             : status == "active"
            //             ? "active-status"
            //             : status == "resolved"
            //             ? "active-status"
            //             : status == "notResolved"
            //             ? "notresolve-status"
            //             : "pending-status"
            //         }`}
            //       >
            //         {status == "notResolved" ? "Not Resolved" : status}
            //       </span>
            //     );
            //   },
            // },

            // {
            //   field: "_id",
            //   title: "Actions",
            //   Cell({ entry: { _id } }) {
            //     return (
            //       <span className="text-center">
            //         <span
            //           style={{ cursor: "pointer" }}
            //           onClick={() =>
            //             router.push(`/${role}/case-overview?id=${_id}`)
            //           }
            //         >
            //           <Image
            //             src={eye}
            //             // src={view}
            //             alt=""
            //             className=""
            //           />
            //         </span>
            //       </span>
            //     );
            //   },
            // },
          ]}
        />
      )}
    </div>
  );
};

export default CaseTable;
