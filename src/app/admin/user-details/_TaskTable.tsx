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
import { axios } from "@/utils/axios";

const TaskTable = ({ id }: any) => {
  const router = useRouter();
  const [loadingData, setDataLoading] = useState(false);
  const [caseData, setCaseData] = React.useState({ _id: "", progress: "" });
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);
  const [TaskData, setTaskData] = useState([]);
  const { data, refetch, isLoading } = useCases({ page });
  const [filter, setFilter] = useState({ totalEntries: 0, currentPage: 0 });
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

  const GetTaskData = () => {
    axios.get(`/api/task/list?user_id=${id}`).then((res: any) => {
      if (res.status == 200) {
        setTaskData(res?.data);
        setFilter({
          totalEntries: res?.totalEntries,
          currentPage: res?.currentPage,
        });
      }
    });
  };
  useEffect(() => {
    GetTaskData();
  }, []);

  return (
    <div className="cases-list-table expert-table">
      <Table<any>
        data={TaskData}
        columns={[
          {
            field: "task_name",
            title: "Task Name",
            Cell({ entry: { title } }) {
              return <span>{title}</span>;
            },
          },
          {
            field: "description",
            title: "Description",
            Cell({ entry: { description } }) {
              return <span>{description}</span>;
            },
          },
          {
            field: "last_date",
            title: "Submisson Date",
            Cell({ entry: { submissionAt } }) {
              return <span>{moment(submissionAt).format("DD-MMM-YYYY")}</span>;
            },
          },

          {
            field: "valid_until",
            title: "Valid Until",
            Cell({ entry: { validTill } }) {
              return <span> {moment(validTill).format("DD-MMM-YYYY")}</span>;
            },
          },

          {
            field: "status",
            title: "Status",
            Cell({ entry: { status } }) {
              return <span className="pending-status">{status}</span>;
            },
          },
          // {
          //   field: "assigned_by",
          //   title: "Assigned By",
          //   Cell({ entry }) {
          //     return <span className="">Case Manager</span>;
          //   },
          // },
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
        currentPage={filter?.currentPage ?? 1}
        totalEntries={filter?.totalEntries ?? 10}
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
