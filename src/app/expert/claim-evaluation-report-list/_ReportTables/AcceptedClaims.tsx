"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Table from "@/components/Table/Table";
import "../../../client/client.css";
import Button from "@mui/material/Button";
import report from "@/assets/update.png";
import Link from "next/link";
import { axios } from "@/utils/axios";
import { useRouter } from "next/navigation";
import moment from "moment";

export const AcceptedClaims = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();

  const GetStatus = (key: any) => {
    switch (key) {
      case "accept":
        return "Accepted";
        break;
      case "reject":
        return "Rejected";
        break;
      case "purchase":
        return "Purchased";
        break;

      default:
        return "Pending";
        break;
    }
  };
  const [listData, setListdata] = useState({
    data: [],
    totalEntries: 0,
    currentPage: 0,
  });

  const NavigatePage = (key: any) => {
    return router.push(`/expert/${key}`);
  };
  const UpdateReportStatus = (id: any, status: any) => {
    axios
      .post("/api/report", { report_id: id, status: status })
      .then((res: any) => {
        if (res?.success) {
          GetReports();
        }
      });
  };

  const GetReports = () => {
    axios
      .get(`/api/report/list?page=${page}&status=accept&role=expert`)
      .then((res: any) => {
        if (res?.success) {
          setListdata(res);
        }
      });
  };

  useEffect(() => {
    GetReports();
  }, []);
  return (
    <Table<any>
      currentPage={listData?.currentPage}
      totalEntries={listData?.totalEntries}
      data={listData?.data}
      handlePageChange={(e, page) => {
        setPage(page);
        GetReports();
      }}
      clientPagination={false}
      columns={[
        // { field: "ref_id", title: "Sr. No." },
        {
          field: "referenceID",
          title: "Reference ID",
          Cell({ entry: { case_id } }) {
            return <span className="">#{case_id?.referenceId}</span>;
          },
        },
        {
          field: "category",
          title: "Cateogry",
          Cell({ entry: { case_id } }) {
            return <span className="">{case_id?.category || "NA"}</span>;
          },
        },
        {
          field: "createdAt",
          title: "Case Registered on",
          Cell({ entry: { case_id } }) {
            return (
              <span className="">
                {moment(case_id?.createdAt).format("DD-MMM-YYYY")}
              </span>
            );
          },
        },
        {
          field: "createdAt",
          title: "Report Uploaded On",
          Cell({ entry: { createdAt } }) {
            return (
              <span className="">
                {moment(createdAt).format("DD-MMM-YYYY")}
              </span>
            );
          },
        },

        {
          field: "ev_report",
          title: "Evaluation Report",
          Cell({ entry: { case_id } }) {
            return (
              <span>
                <span className="action-btns d-flex align-items-center gap-2 justify-content-center">
                  {/* <Link href="/"> */}
                  <span>
                    {case_id?.isEvalReport ? (
                      <Image
                        onClick={() =>
                          NavigatePage(`eval-report?id=${case_id?._id}`)
                        }
                        src={report}
                        alt=""
                        className="view-icons"
                      />
                    ) : (
                      "Pending"
                    )}{" "}
                  </span>
                  {/* </Link> */}
                </span>
              </span>
            );
          },
        },
        {
          field: "fin_report",
          title: "Financial Report",
          Cell({ entry: { case_id } }) {
            return (
              <span>
                <span className="action-btns d-flex align-items-center gap-2 justify-content-center">
                  {/* <Link href="/"> */}
                  <span>
                    {case_id?.isFinancialReport ? (
                      <Image
                        onClick={() =>
                          NavigatePage(`financial-report?id=${case_id?._id}`)
                        }
                        src={report}
                        alt=""
                        className="view-icons"
                      />
                    ) : (
                      "Pending"
                    )}
                  </span>
                  {/* </Link> */}
                </span>
              </span>
            );
          },
        },
        {
          field: "status",
          title: "Status",
          Cell({ entry: { status } }) {
            return <span className="accept-status">{GetStatus(status)}</span>;
          },
        },
        {
          field: "action",
          title: "Action",
          Cell({ entry: { case_id } }) {
            return (
              <span>
                <span className="action-btns d-flex align-items-center gap-2 ">
                  {/* <Link href="/"> */}
                  <span>
                    {!case_id?.lawyer ? (
                      <Button
                        onClick={() =>
                          NavigatePage(
                            `assign-prelitigation-lawyer?case_id=${case_id?._id}`
                          )
                        }
                      >
                        Assign Lawyer
                      </Button>
                    ) : (
                      "Assigned"
                    )}
                  </span>
                  {/* </Link> */}
                </span>
              </span>
            );
          },
        },
      ]}
    />
  );
};
