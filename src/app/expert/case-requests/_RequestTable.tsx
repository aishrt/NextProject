"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import "../../client/client.css";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { upperFirst } from "lodash";
import { useSession } from "next-auth/react";
import { useRequestTypes } from "@/queries/requests";
import { RequestType } from "@/types/Request";
import Image from "next/image";
import ellipse from "@/assets/ellipse.png";
import ConfirmationDialog from "@/components/Form/ConfirmationDialogue";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert, Snackbar } from "@mui/material";

const options = [
  { label: "Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Accepted", value: "accepted" },
  { label: "Counter Offer", value: "counterOffer" },
];

const Requests = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: user } = useSession();
  const session = user?.user;
  const [id, setId] = useState();

  const [status, setStatus] = useState("");
  const [referenceId, setReference] = useState<string>("");
  const [lawyer, setLawyer] = useState<string>("");
  const [option, setOption] = useState<string>("");

  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [ModeLoader, setModelLoader] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  const { data, isLoading, isFetching, refetch } = useRequestTypes({
    referenceId,
    lawyer,
    status: option,
    page,
    role: "expert",
  });
  useEffect(() => {
    refetch();
  }, []);

  const toggleDropdown = (id: any) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const UpdateReportStatus = (id: any, status: string) => {
    axios
      .post("/api/expert/counterStatus", {
        status: status,
        requestId: id,
      })
      .then((res: any) => {
        if (res?.success) {
          setModelLoader(false);
          setOpenDialog(false);
          openSnackbar({
            message: `Counter ${status} successfuly !`,
            type: "success",
          });
          refetch();
        }
      })
      .catch((err: any) => {
        console.log(err);
        openSnackbar({
          message: err?.response?.data?.message,
          type: "error",
        });
      });
  };

  const handleSearch = () => {
    refetch();
  };

  return (
    <div className="">
      <ConfirmationDialog
        open={openDialog}
        title="Report Confirmation"
        message={`Are you sure you want to ${status} this counter amount? This action cannot be undone.`}
        loading={ModeLoader}
        onConfirm={() => {
          setModelLoader(true);
          if (status == "reject") {
            UpdateReportStatus(id, "rejected");
          }
          if (status == "accept") {
            UpdateReportStatus(id, "accepted");
          }
        }}
        onCancel={() => setOpenDialog(false)}
      />

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

              <div className="col-12 col-md-4 col-xxl-2 mt-3">
                <div className="filter-input">
                  <select
                    className="form-control filter-ip"
                    name="status"
                    //className="form-select filter-select"
                    value={option}
                    onChange={(e) => setOption(e.target.value)}
                  >
                    {options.map(({ label, value }) => (
                      <option key={label?.toString()} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
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
        <Table<RequestType>
          data={data?.data ?? []}
          currentPage={data?.currentPage ?? 1}
          totalEntries={data?.totalEntries ?? 10}
          handlePageChange={(e, page) => {
            setPage(page);
            refetch();
          }}
          columns={[
            {
              field: "caseId",
              title: "Reference Id",
              Cell({ entry: { caseId } }) {
                return <span>{"#" + caseId?.referenceId}</span>;
              },
            },

            {
              field: "lawyer",
              title: "Lawyer Name",
              Cell({ entry: { lawyer } }) {
                return <span>{upperFirst(lawyer?.name) ?? "NA"}</span>;
              },
            },

            {
              field: "caseId",
              title: "Financial Report",
              Cell({ entry: { _id, caseId } }: any) {
                return (
                  <span
                    onClick={() => {
                      if (caseId?.lawyerFinancialReport) {
                        router.push(
                          `/expert/lawyer-financial-report?id=` + caseId?._id
                        );
                      }
                    }}
                  >
                    {caseId?.lawyerFinancialReport ? (
                      <Button variant="outline">View Report</Button>
                    ) : (
                      <Button variant="outline">Pending</Button>
                    )}
                  </span>
                );
              },
            },

            // {
            //   field: "counterAmount",
            //   title: "Counter Offer Amount",
            //   Cell({ entry: { counterAmount } }) {
            //     return (
            //       <>
            //         {counterAmount && (
            //           <span className="text-capitalize active-status">
            //             {counterAmount}
            //           </span>
            //         )}
            //       </>
            //     );
            //   },
            // },

            {
              field: "status",
              title: "Status",
              Cell({ entry: { status, counterAmount } }) {
                return (
                  <span
                    className={`text-capitalize ${
                      status == "accepted" ? "active-status" : "pending-status"
                    }`}
                  >
                    {status == "counterOffer"
                      ? `Counter Offer (${counterAmount})`
                      : status}
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
            {
              field: "_id",
              title: "Action",
              Cell({ entry: { _id, caseId, status } }) {
                return (
                  <span>
                    {status == "counterOffer" && (
                      <span className="action-btns d-flex align-items-center gap-2  justify-content-center">
                        <span>
                          <div className="menu-container">
                            <button
                              className="menu-button"
                              onClick={() => toggleDropdown(_id)}
                            >
                              <Image
                                src={ellipse}
                                className="ellipse-ico"
                                alt=""
                                height={25}
                                width={25}
                              />
                            </button>
                            {openDropdownId == _id && (
                              <ul className="dropdown-menu">
                                <li>
                                  <a
                                    className="cursor"
                                    onClick={() => {
                                      setStatus("accept");
                                      setOpenDialog(true);
                                      setId(_id);
                                      setOpenDropdownId(null);
                                      // router.push(
                                      //   `/lawyer/financial-report?id=${caseId?._id}`
                                      // );
                                    }}
                                  >
                                    Accept
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className="cursor"
                                    onClick={() => {
                                      setStatus("reject");
                                      setOpenDialog(true);
                                      setId(_id);
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    Reject
                                  </a>
                                </li>
                              </ul>
                            )}
                          </div>
                        </span>
                      </span>
                    )}
                  </span>
                );
              },
            },
          ]}
        />
      )}

      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
};

export default Requests;
