"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../admin/admin.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { describe } from "node:test";

const TaskTable = () => {
  const router = useRouter();
  const [loadingData, setDataLoading] = useState(false);
  const [caseData, setCaseData] = React.useState({ _id: "", progress: "" });
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);

  const { data, refetch, isLoading } = useCases({ page });
  console.log(data?.data);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const staticData = [
    {
      referenceId: "",
      task_name: "",
      description: "",
      last_date: "",
      valid_until: "",
      assigned_by: "",
      status: "",
      actions: "",
    },
    {
      referenceId: "",
      task_name: "",
      description: "",
      last_date: "",
      valid_until: "",
      assigned_by: "",
      status: "",
      actions: "",
    },
    {
      referenceId: "",
      task_name: "",
      description: "",
      last_date: "",
      valid_until: "",
      assigned_by: "",
      status: "",
      actions: "",
    },
  ];

  return (
    <div className="cases-list-table expert-table">
      <Table<any>
        data={staticData}
        columns={[
          {
            field: "task_name",
            title: "Task Name",
            Cell({ entry }) {
              return <span>Task Name</span>;
            },
          },
          {
            field: "description",
            title: "Description",
            Cell({ entry }) {
              return <span>Lorem Ipsum</span>;
            },
          },
          {
            field: "last_date",
            title: "Last Date",
            Cell({ entry }) {
              return <span>12-01-2001 </span>;
            },
          },

          {
            field: "valid_until",
            title: "Valid Until",
            Cell({ entry: {} }) {
              return <span> 12-04-2020</span>;
            },
          },

          {
            field: "status",
            title: "Status",
            Cell({ entry }) {
              return <span className="pending-status">Pending</span>;
            },
          },
          {
            field: "assigned_by",
            title: "Assigned By",
            Cell({ entry }) {
              return <span className="">Case Manager</span>;
            },
          },
          {
            field: "actions",
            title: "Action",
            Cell({ entry: { _id } }) {
              return (
                <span className="admin-table-btns d-flex gap-2">
                  {/* <span onClick={() => router.push(`/admin`)}>
                    <Image src={block} alt="" className="block-user" />
                  </span> */}
                  <span onClick={() => router.push(`/admin`)}>
                    <Image src={view} alt="" className="" />
                  </span>
                  {/* <span onClick={() => router.push(`/admin`)}>
                    <Image src={del} alt="" className="" />
                  </span> */}
                </span>
              );
            },
          },
        ]}
        currentPage={data?.currentPage ?? 1}
        totalEntries={data?.totalEntries ?? 10}
        handlePageChange={(e, page) => {
          console.log(page);
          setPage(page);
          refetch();
        }}
      />
    </div>
  );
};

export default TaskTable;
