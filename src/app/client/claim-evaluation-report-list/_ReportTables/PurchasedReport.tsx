"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Table from "@/components/Table/Table";
import "../../../client/client.css";
import Button from "@mui/material/Button";
import report from "@/assets/update.png";
import Link from "next/link";
import { axios } from "@/utils/axios";
import { useSession } from "next-auth/react";
import moment from "moment";
import { useRouter } from "next/navigation";

export const PurchasedReport = () => {
  const [page, setPage] = useState(1);
  const [listData, setListdata] = useState({
    data: [],
    currentPage: 0,
    totalEntries: 0,
  });
  const { data: session } = useSession();
  const router = useRouter();
  const NavigatePage = (key: any) => {
    return router.push(`/client/${key}`);
  };
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
  const staticData = [
    {
      ref_id: 1,
      case_id: "2SWW4",
      uploaded: "24th June 2024",
      category: "Financed Party",
      price: "25",
      registered: "24th June 2024",
      ev_report: "",
      status: "",
      fin_report: "",
      action: "",
    },
    {
      ref_id: 1,
      case_id: "2SWW4",
      uploaded: "24th June 2024",
      category: "Financed Party",
      registered: "24th June 2024",
      doc_type: "lorem ipsum",
      key_issue: "lorem ipsum",
      size: "20MB",
      status: "",
      action: "",
    },
  ];
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
      .get(
        `/api/report/list?page=${page}&status=purchased&user_id=${session?.user?._id}`
      )
      .then((res: any) => {
        if (res?.success) {
          setListdata(res);
        }
      });
  };

  useEffect(() => {
    if (session?.user?._id) GetReports();
  }, [session]);
  return (
    <Table<any>
      currentPage={listData?.currentPage}
      totalEntries={listData?.totalEntries}
      data={listData?.data}
      clientPagination={false}
      handlePageChange={(e, page) => {
        setPage(page);
        GetReports();
      }}
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
          title: "Category",
          Cell({ entry: { case_id } }) {
            return <span className="">{case_id?.category||"NA"}</span>;
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
                <span className="action-btns d-flex align-items-center gap-2  justify-content-center">
                  {/* <Link href="/"> */}
                  <span>
                    {case_id?.isEvalReport ? (
                      <Image  onClick={() =>
                        NavigatePage(`eval-report?id=${case_id?._id}`)
                      } src={report} alt="" className="view-icons" />
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
                <span className="action-btns d-flex align-items-center gap-2  justify-content-center">
                  {/* <Link href="/"> */}
                  <span>
                    {case_id?.isFinancialReport ? (
                      <Image  onClick={() =>
                        NavigatePage(`financial-report?id=${case_id?._id}`)
                      } src={report} alt="" className="view-icons" />
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
            return <span className="pending-status">{GetStatus(status)}</span>;
          },
        },
      ]}
    />
  );
};
