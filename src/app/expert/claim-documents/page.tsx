"use client";

import React, { useEffect, useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import { CircularProgress, Menu, MenuItem } from "@mui/material";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";
import { Button } from "@/components/Form/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ConfirmationDialog from "@/components/Form/ConfirmationDialogue";
import LoadingButton from "@mui/lab/LoadingButton";
import view from "@/assets/eye.png";
import down from "@/assets/down.png";
import "../../client/client.css";
import "../../admin/admin.css";
import Link from "next/link";
import Image from "next/image";
import Table from "@/components/Table/Table";
import moment from "moment";
function ClaimDocuments() {
  const [documents, setDocuments] = useState({
    data: [],
    totalEntires: 0,
    currentPage: 0,
  });
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  let case_id = search?.get("id") || "";

  const { data } = useSession();
  const [filter, setFilter] = useState({
    status: "",
    type: "",
    category: "",
    page: 1,
  });

  const currentUser: any = data?.user;
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const [loaders, setLoaders] = useState({
    edit_request: false,
    edit_requestID: "",
    suggestion: false,
    suggestionID: "",
    acceptEditRequest: false,
    acceptEditRequestID: "",
    RejectEditRequestID: "",
    RejectEditRequest: false,
  });
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [ModeLoader, setModelLoader] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const getDocuments = async (page: any) => {
    setLoading(true);
    try {
      const res: any = await axios.get(
        `/api/cases/${case_id}/documents?type=all&page=${page || 1}`
      );
      setDocuments({
        data: res?.data,
        currentPage: res?.currentPage,
        totalEntires: res?.totalEntries,
      });
      // setDocuments(res?.data ?? []);
    } catch (err: any) {
      console.error("Error fetching documents:", err);
      openSnackbar({
        message: err?.message ?? "Failed to load documents",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderDocumentPreview = (documentUrl: string) => {
    const fileExtension = documentUrl?.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension!)) {
      return (
        <img
          src={documentUrl}
          onError={(e: any) => {
            e.target.src =
              "https://cdn-icons-png.freepik.com/512/180/180327.png";
          }}
          alt="Document Preview"
          style={{ maxWidth: "100%", height: "160px", objectFit: "contain" }}
        />
      );
    }

    if (fileExtension === "pdf") {
      return (
        <img
          src={"https://cdn-icons-png.freepik.com/512/180/180327.png"}
          style={{ maxWidth: "100%", height: "160px", objectFit: "contain" }}
        />
        // <iframe
        //   onError={(e: any) => {
        //     console.log(e, "error");
        //   }}
        //   rel="noopener noreferrer"
        //   src={documentUrl}
        //   aria-placeholder="https://d9-wret.s3.us-west-2.amazonaws.com/assets/palladium/production/s3fs-public/thumbnails/image/file.jpg"
        //   style={{ width: "100%", height: "400px" }}
        //   title="PDF preview"
        // ></iframe>
      );
    }

    return (
      <a
        href={documentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
      >
        View Document
      </a>
    );
  };

  // Trigger document update on button click

  const GetUpdateCheck = (key: any) => {
    // if (key == "accepted") return true;
    if (key == "suggestion") return true;
    return false;
  };

  const renderStatusBadge = (status: string) => {
    let bgColor = "";
    let key = "";
    if (status === "accepted") bgColor = "green";
    else if (status === "rejected") bgColor = "red";
    else if (status === "Edit_request") bgColor = "grey";
    else bgColor = "grey"; // for "requested" or "suggestion"
    key = status;
    if (status == "edit_request") key = "Edit Request";
    return (
      <span
        style={{
          backgroundColor: bgColor,
          color: "white",
          padding: "5px 10px",
          borderRadius: "5px",
          fontSize: "12px",
          // position: "absolute",
          // top: "10px",
          // right: "10px",
        }}
      >
        {key.charAt(0).toUpperCase() + key.slice(1)}
      </span>
    );
  };

  useEffect(() => {
    if (case_id) {
      getDocuments(1);
    }
  }, [case_id]);

  return (
    <>
      <div className="mb-3 mt-3 p-3">
        <h4>Claim Documents</h4>
      </div>
      {loading ? (
        <center
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            height: "50vh",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </center>
      ) : (
        <>
          {documents?.data?.length === 0 ? (
            <center>
              <p>No documents available for this case.</p>
            </center>
          ) : (
            <div className="cases-list-table">
              <Table<any>
                data={documents?.data ?? []}
                currentPage={documents?.currentPage ?? 1}
                totalEntries={documents?.totalEntires ?? 10}
                handlePageChange={(e, page) => {
                  getDocuments(page);
                  setFilter({ ...filter, page: page });
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
                    field: "createdAt",
                    title: "Uploaded on",
                    Cell({ entry: { createdAt } }: any) {
                      return (
                        <span>{moment(createdAt).format("DD MMM YYYY")}</span>
                      );
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
                    field: "category",
                    title: "Category",
                    Cell({ entry: { category } }: any) {
                      return <span>{category || "NA"}</span>;
                    },
                  },

                  {
                    field: "status",
                    title: "Status",
                    Cell({ entry: { status } }: any) {
                      return <>{renderStatusBadge(status)}</>;
                    },
                  },
                  {
                    field: "actions",
                    title: "Action",
                    Cell({ entry: { _id, status, role, document } }: any) {
                      return (
                        <>
                          <div className="socumnet-btns d-flex align-items-center justify-content-left gap-1">
                            <a
                              onClick={() =>
                                router.push(
                                  `/${currentUser?.role}/case-documents/detail?id=${_id}`
                                )
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="border px-2 py-1 rounded me-2"
                            >
                              <img
                                src="../../assets/eye.png"
                                alt="view"
                                className="view-doc"
                              />
                            </a>
                            <a
                              href={document}
                              download
                              className="border px-2 py-1 rounded me-2"
                            >
                              <img
                                src="../../assets/down.png"
                                alt="view"
                                className="view-doc"
                              />
                            </a>
                          </div>
                        </>
                      );
                    },
                  },
                ]}
              />
            </div>
          )}
        </>
      )}
    </>
  );
}

export default ClaimDocuments;
