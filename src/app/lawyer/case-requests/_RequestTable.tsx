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

const Requests = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: user } = useSession();
  const session = user?.user;
  const [id, setId] = useState();
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [ModeLoader, setModelLoader] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  const { data, isLoading, isFetching, refetch } = useRequestTypes({
    page,
    role:'lawyer'
  });
  useEffect(() => {
      refetch();
  }, []);

  const toggleDropdown = (id: any) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const UpdateReportStatus = (id: any, status: any) => {
    axios
      .post("/api/lawyer/report", {
        status: status,
        requestId: id,
      })
      .then((res: any) => {
        if (res?.success) {
          setModelLoader(false);
          setOpenDialog(false);
          openSnackbar({
            message: `Claim ${status} successfuly !`,
            type: "success",
          });
          status == "accepted"
            ? router.push(`/lawyer/cases-list?type=litigation`)
            : router.push(`/lawyer/dashboard`);
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

  return (
    <div className="">
      <ConfirmationDialog
        open={openDialog}
        title="Report Confirmation"
        message={`Are you sure you want to reject this report? This action cannot be undone.`}
        loading={ModeLoader}
        onConfirm={() => {
          setModelLoader(true);
          UpdateReportStatus(id, "rejected");
        }}
        onCancel={() => setOpenDialog(false)}
      />

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
              field: "caseId",
              title: "Financial Report",
              Cell({ entry: { _id, caseId } }: any) {
                return (
                  <span
                    onClick={() => {
                      if (caseId?.lawyerFinancialReport) {
                        router.push(
                          `/lawyer/financial-report?id=` + caseId?._id
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

            {
              field: "status",
              title: "Status",
              Cell({ entry: { status } }) {
                return (
                  <span className="text-capitalize pending-status">
                    {status == "counterOffer" ? "Counter Offer" : status}
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
                    {status == "pending" && (
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
                                      router.push(
                                        `/lawyer/financial-report?id=${caseId?._id}`
                                      );
                                    }}
                                  >
                                    Accept
                                  </a>
                                </li>
                                <li>
                                  <a
                                    className="cursor"
                                    onClick={() => {
                                      setOpenDialog(true);
                                      setId(_id);
                                      setOpenDropdownId(null);
                                    }}
                                  >
                                    Reject
                                  </a>
                                </li>

                                <li>
                                  <a
                                    className="cursor"
                                    onClick={() => {
                                      router.push(
                                        `/lawyer/financial-report?id=${caseId?._id}`
                                      );
                                    }}
                                  >
                                    Counter Offer
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
