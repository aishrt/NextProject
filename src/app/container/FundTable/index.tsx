"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useTasksList } from "@/queries/tasks";
import view from "@/assets/view.png";
import edit from "@/assets/images.png";
import { GrDocumentUpdate } from "react-icons/gr";
import { MdMessage } from "react-icons/md";

import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../client/client.css";
import Link from "next/link";
import Image from "next/image";
import { Alert, CircularProgress, Snackbar, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { TasksType } from "@/types/tasks";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button } from "@/components/Form/Button";
import { useFundList } from "@/queries/funds";

const FundTable = ({ id, userRole }: { id?: any; userRole?: any }) => {
  const router = useRouter();
  const [RemindIndex, setRemindIndex] = useState("");
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  // Filters state
  const [statusFilter, setStatusFilter] = useState("all");

  // Fetching tasks with filters
  const { data, isLoading, refetch } = useFundList({
    page,
    search: "",
  });
  console.log(data, "===================list data");
  // Handle status filter change
  const handleStatusChange = (e: any) => {
    setStatusFilter(e.target.value); // Update status filter state
  };

  // Refetch tasks when filters change
  useEffect(() => {
    refetch();
  }, [statusFilter, page]);

  // Helper function to show the update button
  const GetUpdateButton = (key: any) => {
    if (key == "pending") {
      return true;
    }
    if (key == "inProgress") {
      return true;
    }
    if (key == "edit_suggesstion") {
      return true;
    }
  };

  const ReminderEmail = (id: any) => {
    setRemindIndex(id);
    axios.get(`/api/task/remind?task_id=${id}`).then((res: any) => {
      setRemindIndex("");

      openSnackbar({ message: "Reminder Sent successfully ", type: "success" });
    });
  };
  const options = [
    { label: "Personal Document", value: "personal" },
    { label: "Proof of Identity", value: "identity" },
    { label: "Communication to Read", value: "communication" },
    { label: "Proof od Damage", value: "damage" },
  ];

  const GetCategory = (key: any) => {
    console.log(key);
    let val = "";
    options?.map((itm: any) => {
      if (itm?.value == key) {
        val = itm?.label;
      }
    });
    if (val) {
      return val;
    } else {
      return key;
    }
  };

  return (
    <div className="cases-list-table expert-table">
      <div className="doc-filters-form mb-3">
        <div className="row mt-4 align-items-end">
          <div className="col-12 col-md-3 mb-3">
            <div className="filter-input">
              <label>Reference Id</label>
              <input
                type="number"
                placeholder="Reference Id"
                className="form-control filter-ip"
                name="referenceId"
              />
            </div>
          </div>
          <div className="col-12 col-md-2 mb-3">
            <div className="filter-input">
              <label>Status</label>
              <select
                className="form-control filter-ip"
                name="status"
                value={statusFilter}
                onChange={handleStatusChange} // Call handler on filter change
              >
                <option value={"all"}>All</option>
                <option value={"pending"}>Pending</option>
                <option value={"completed"}>Completed</option>
              </select>
            </div>
          </div>

          <div className="col-12 col-md-2 mb-3"></div>
          <div className=" col-12 col-md-3 filter-btn mb-3">
            <Button variant="contained" size="md" className="expert-btn">
              <span className="f-16">Search</span>
            </Button>
          </div>
        </div>
      </div>
      {isLoading ? (
        <center className="mt-5">
          {" "}
          <CircularProgress />
        </center>
      ) : (
        <Table<any>
          data={data?.data ?? []}
          currentPage={data?.currentPage ?? 1}
          totalEntries={data?.totalEntries ?? 10}
          handlePageChange={(e, page) => {
            setPage(page);
          }}
          columns={[
            {
              field: "case__id",
              title: "Reference Id",
              Cell({ entry: { case_id } }: any) {
                return <span>#{case_id?.referenceId}</span>;
              },
            },
            {
              field: "fundAmount",
              title: "Fund Amount",
              Cell({ entry: { fundAmount } }: any) {
                return <span>{fundAmount}</span>;
              },
            },
            {
              field: "transactionId",
              title: "Transaction ID",
              Cell({ entry: { transactionId } }: any) {
                return <span>{transactionId}</span>;
              },
            },
            {
              field: "createdAt",
              title: "Created Date",
              Cell({ entry: { createdAt } }: any) {
                return <span>{moment(createdAt).format("DD MMM YYYY")}</span>;
              },
            },

            // {
            //   field: "status",
            //   title: "Status",
            //   Cell({ entry: { status } }: any) {
            //     return (
            //       <span
            //         className={`text-capitalize ${
            //           status === "pending" ? "pending-status" : "active-status"
            //         }`}
            //       >
            //         {status === "pending" && "Pending"}
            //         {status === "completed" && "Completed"}
            //       </span>
            //     );
            //   },
            // },
            {
              field: "actions",
              title: "Action",
              Cell({
                entry: {
                  _id,
                  status,
                  assignedTo,
                  isDocument,
                  updates,
                  case_id,
                },
              }: any) {
                return (
                  <span className="admin-table-btns d-flex ps-3 gap-2">
                    <span
                      onClick={() => {
                        router.push(`/${userRole}/funds/detail?id=${_id}`);
                      }}
                    >
                      <Image src={view} alt="" className="pointer" />
                    </span>
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

export default FundTable;
