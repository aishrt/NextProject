"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/view.png";
import edit from "@/assets/images.png";
import { GrDocumentUpdate } from "react-icons/gr";

import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../admin/admin.css";
import Link from "next/link";
import Image from "next/image";
import { Button, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { CerQestionsType, CerQestionsApiResponse } from "@/types/CerQuestions";
import { axios } from "@/utils/axios";
import { TasksType } from "@/types/tasks";
import { useSession } from "next-auth/react";

const DocumentTable = ({
  data,
  id,
  userRole,
  status,
}: {
  data: CerQestionsApiResponse | undefined;
  id: any;
  status: any;
  userRole: any;
}) => {
  const router = useRouter();
  const [loadingData, setDataLoading] = useState(false);
  const [caseData, setCaseData] = React.useState({ _id: "", progress: "" });
  const [open, setOpen] = React.useState(false);
  const [ListData, setListData] = useState([]);
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const { data: session } = useSession();
  const [filter, setFilter] = useState({
    currentPage: null as number | null | undefined,
    totalEntries: null as number | null | undefined,
    status: status || "",
    currentFilter: false,
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    let filterData = localStorage.getItem("task_filter");
    setFilter({ ...filter, status: filterData });
  }, []);

  const DeleteQuestion = (id: any) => {
    return false;
    axios
      .post(`/api/cer-question/delete-question?id=${id}`)
      .then((res: any) => {
        if (res?.status == 200) {
          window.location.reload();
        }
      });
  };

  const GetTask = (p: any) => {
    setFilter({ ...filter, currentFilter: true });
    axios
      .get(
        `/api/documents/list?id=${id || ""}&user_id=${
          session?.user?._id
        }&role=${userRole}&status=${p?.status || "pending"}`
      )
      .then((res: any) => {
        if (res.status == 200) {
          console.log(res);
          const result: any = res?.data?.map((itm: any, i: any) => {
            return { ...itm, serial: i + 1 };
          });
          setListData(result);
          setFilter({
            ...filter,
            currentPage: res?.currentPage,
            totalEntries: res?.totalEntries,
          });
        }
      });
  };

  useEffect(() => {
    // GetTask();
    const UpdatedData: any = data?.data?.map((itm: any, i: any) => {
      return { ...itm, serial: i + 1 };
    });
    if (!filter?.currentFilter) {
      setListData(UpdatedData);
      setFilter({
        ...filter,
        currentPage: data?.currentPage,
        totalEntries: data?.totalEntries,
      });
    }
  }, []);

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
  console.log(ListData, userRole);

  return (
    <div className="cases-list-table expert-table">
      <div className="doc-filters-form mb-3">
        <div className="row mt-4">
          <div className="col-12 col-md-12">
            <div className="col-12 col-md-3">
              <div className="filter-input">
                <select
                  className="form-control filter-ip"
                  name="status"
                  value={localStorage.getItem("task_filter")?.toString() ?? ""}
                  onChange={(e: any) => {
                    GetTask({ status: e.target.value });
                    setFilter({ ...filter, status: e.target.value });
                    localStorage.setItem("task_filter", e.target.value);
                    if (id) {
                      return router.push(
                        `/${userRole}/case-documents?id=${id}&status=${e.target.value}`
                      );
                    }
                    router.push(
                      `/${userRole}/case-documents?status=${e.target.value}`
                    );
                  }}
                >
                  <option value={"all"}>All</option>

                  <option value={"inProgress"}>in Progress</option>
                  <option value={"approved"}>Approved</option>
                  <option value={"reviewing"}>Reviewing</option>

                  <option value={"edit_suggesstion"}>Edit Suggesstion</option>

                  <option value={"reject"}>Rejected</option>

                  <option value={"pending"}>Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Table<TasksType>
        data={(ListData || data?.data) ?? []}
        currentPage={filter?.currentPage ?? 1}
        totalEntries={filter?.totalEntries ?? 10}
        handlePageChange={(e, page) => {
          setPage(page);
        }}
        columns={[
          // {
          //   field: "serial",
          //   title: "SR No.",
          //   Cell({ entry: { serial } }: any) {
          //     return <span>{serial}</span>;
          //   },
          // },
          {
            field: "case__id",
            title: "Reference Id",
            Cell({ entry: { case_id } }: any) {
              return <span>#{case_id?.referenceId}</span>;
            },
          },
          {
            field: "title",
            title: "Name",
            Cell({ entry: { task_id } }: any) {
              return <span>{task_id?.title}</span>;
            },
          },
          {
            field: "category",
            title: "Category",
            Cell({ entry: { task_id } }: any) {
              return <span>{task_id?.category}</span>;
            },
          },
          {
            field: "submissionAt",
            title: "Submission Date",
            Cell({ entry: { submissionAt } }: any) {
              return <span>{moment(submissionAt).format("DD-MMM-YYYY")}</span>;
            },
          },
          {
            field: "validTill",
            title: "Valid Till",
            Cell({ entry: { validTill } }: any) {
              return <span>{moment(validTill).format("DD-MMM-YYYY")}</span>;
            },
          },
          {
            field: "status",
            title: "Status",
            Cell({ entry: { task_id } }: any) {
              return (
                <span
                  className={`text-capitalize ${
                    status == "pending" ? "pending-status" : "active-status"
                  }`}
                >
                  {" "}
                  {task_id?.status == "pending" && "Pending"}
                  {task_id?.status == "inProgress" && "In Progress"}
                  {task_id?.status == "approved" && "Approved"}
                  {task_id?.status == "reject" && "Rejected"}
                  {task_id?.status == "reviewing" && "Reviewing"}
                  {task_id?.status == "edit_suggesstion" && "Edit Suggesstion"}
                </span>
              );
            },
          },

          {
            field: "actions",
            title: "Action",
            Cell({
              entry: {
                _id,
                status,
                role,
                isDocument,
                updates,
                case_id,
                task_id,
              },
            }: any) {
              return (
                <span className="admin-table-btns d-flex gap-2">
                  <span
                    className="pointer"
                    onClick={() => {
                      router.push(
                        `/${userRole}/case-documents/detail?id=${case_id?._id}&task_id=` +
                          task_id?._id
                      );
                    }}
                  >
                    <Image src={view} alt="" className="" />
                  </span>
                  {task_id?.role == userRole && (
                    <>
                      {GetUpdateButton(status) && (
                        <Tooltip title={"Leave Update"}>
                          <span
                            className="pointer"
                            onClick={() => {
                              if (task_id?.updates) {
                                return router.push(
                                  `/${userRole}/tasks/update?id=${case_id?._id}&isUpdated=true&isDocument=${task_id?.isDocument}&task_id=` +
                                    task_id?._id
                                );
                              }
                              router.push(
                                `/${userRole}/tasks/update?id=${case_id?._id}&isDocument=${task_id?.isDocument}&task_id=` +
                                  task_id?._id
                              );
                            }}
                          >
                            <GrDocumentUpdate />

                            {/* <Image src={edit} alt="" className="block-user" /> */}
                          </span>
                        </Tooltip>
                      )}
                    </>
                  )}
                </span>
              );
            },
          },
        ]}
      />
    </div>
  );
};

export default DocumentTable;
