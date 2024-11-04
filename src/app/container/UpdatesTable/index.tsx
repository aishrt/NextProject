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
import { Button, CircularProgress, Tooltip } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { CerQestionsType, CerQestionsApiResponse } from "@/types/CerQuestions";
import { axios } from "@/utils/axios";
import { TasksType } from "@/types/tasks";

const CaseUpdatesTable = ({
  data,
  case_id,
  userRole,
  loading,
}: {
  data: any;
  case_id: any;
  userRole: any;
  loading: any;
}) => {
  const router = useRouter();
  const [loadingData, setDataLoading] = useState(false);
  const [caseData, setCaseData] = React.useState({ _id: "", progress: "" });
  const [open, setOpen] = React.useState(false);
  const [ListData, setListData] = useState([]);
  const theme = useTheme();
  const [loader, setLoader] = useState(false);
  const [page, setPage] = useState(0);
  const [filter, setFilter] = useState({
    currentPage: 0,
    totalEntries: 0,
    status: "",
    search: "",
    currentFilter: false,
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  useEffect(() => {
    let filterData = localStorage.getItem("task_filter");
    setFilter({ ...filter, status: filterData ?? "" });
  }, []);

  const GetUpdates = (p: any) => {
    setLoader(true);
    setFilter({ ...filter, currentFilter: true, search: p?.search });
    axios
      .get(`/api/case-updates/list?case_id=${case_id}&search=${filter?.search}`)
      .then((res: any) => {
        if (res.success) {
          setLoader(false);
          setListData(res?.data);
          setFilter({
            ...filter,
            currentPage: res?.currentPage,
            totalEntries: res?.totalEntries,
          });
        }
      });
  };

  useEffect(() => {
    GetUpdates({});
    const UpdatedData: any = data?.data?.map((itm: any, i: any) => {
      return { ...itm, serial: i + 1 };
    });
    if (!filter?.currentFilter) {
      setListData(UpdatedData);
      setFilter({
        ...filter,
        currentPage: data?.currentPage ?? 1,
        totalEntries: data?.totalEntries ?? 10,
      });
    }
  }, []);
  console.log(ListData, "======data");
  return (
    <div className="cases-list-table expert-table">
      <div className="doc-filters-form mb-3">
        <div className="row mt-4">
          <div className="col-12 col-md-12">
            <div className="col-12 col-md-3">
              <div className="filter-input">
                <form
                  onSubmit={(e: any) => {
                    e.preventDefault();
                    GetUpdates(filter);
                  }}
                >
                  <input
                    type="text"
                    onChange={(e: any) =>
                      setFilter({ ...filter, search: e.target.value })
                    }
                    placeholder="Search Here"
                    className="form-control"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading || loader ? (
        <CircularProgress />
      ) : (
        <Table<{
          _id: string;
          title: string;
          discussionPoint: Date;
          attendees: Date;
          case_id: object;
          document: string;
          discussionDate: Date;
          createdAt: string;
          updatedAt: string;
          case__id: any;
          exchangedDocument: any;
          status: any;
          __v: boolean;
          actions: any;
        }>
          data={ListData ?? []}
          currentPage={filter?.currentPage ?? 1}
          totalEntries={filter?.totalEntries ?? 10}
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
              field: "title",
              title: "Title",
              Cell({ entry: { title } }: any) {
                return <span>{title}</span>;
              },
            },
            {
              field: "discussionPoint",
              title: "Discussion Point",
              Cell({ entry: { discussionPoint } }: any) {
                return <span>{discussionPoint[0]?.name || "NA"}</span>;
              },
            },
            {
              field: "attendees",
              title: "Attendees Name",
              Cell({ entry: { attendees } }: any) {
                return <span>{attendees[0]?.name || "NA"}</span>;
              },
            },
            {
              field: "document",
              title: "Document",
              Cell({ entry: { document } }: any) {
                return <span>{document ? "Uploaded" : "NA"}</span>;
              },
            },
            {
              field: "exchangedDocument",
              title: "Exchanged Document",
              Cell({ entry: { exchangedDocument } }: any) {
                return <span>{exchangedDocument ? "Uploaded" : "NA"}</span>;
              },
            },
            {
              field: "discussionDate",
              title: "Date of Discussion",
              Cell({ entry: { discussionDate } }: any) {
                return (
                  <span>
                    {moment(discussionDate).format("DD-MMM-YYYY H:mm A")}
                  </span>
                );
              },
            },

            //   {
            //     field: "status",
            //     title: "Status",
            //     Cell({ entry: { status } }: any) {
            //       return (
            //         <span
            //           className={`text-capitalize ${
            //             status == "pending" ? "pending-status" : "active-status"
            //           }`}
            //         >
            //           {" "}
            //           {status == "pending" && "Pending"}
            //           {status == "inProgress" && "In Progress"}
            //           {status == "approved" && "Approved"}
            //           {status == "reject" && "Rejected"}
            //           {status == "reviewing" && "Reviewing"}
            //           {status == "edit_suggesstion" && "Edit Suggesstion"}
            //         </span>
            //       );
            //     },
            //   },

            {
              field: "actions",
              title: "Action",
              Cell({
                entry: { _id, status, role, isDocument, updates, case_id },
              }: any) {
                return (
                  <span className="admin-table-btns d-flex gap-2">
                    <span
                      className="pointer"
                      onClick={() => {
                        router.push(
                          `/${userRole}/case-updates/detail?id=${_id}`
                        );
                      }}
                    >
                      <Image src={view} alt="" className="" />
                    </span>
                    {/* {role == userRole && (
                    <>
                      {GetUpdateButton(status) && (
                        <Tooltip title={"Leave Update"}>
                          <span
                            onClick={() => {
                              if (updates) {
                                return router.push(
                                  `/${userRole}/tasks/update?id=${case_id?._id}&isUpdated=true&isDocument=${isDocument}&task_id=` +
                                    _id
                                );
                              }
                              router.push(
                                `/${userRole}/tasks/update?id=${case_id?._id}&isDocument=${isDocument}&task_id=` +
                                  _id
                              );
                            }}
                          >
                            <GrDocumentUpdate />
                          </span>
                        </Tooltip>
                      )}
                    </>
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

export default CaseUpdatesTable;
