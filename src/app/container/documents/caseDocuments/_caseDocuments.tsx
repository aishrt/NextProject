"use client";

import React, { useEffect, useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";
import { Button } from "@/components/Form/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import ConfirmationDialog from "@/components/Form/ConfirmationDialogue";
import LoadingButton from "@mui/lab/LoadingButton";
import view from "@/assets/eye.png";
import down from "@/assets/down.png";
import "../../../client/client.css";
import "../../../admin/admin.css";
import Link from "next/link";
import Image from "next/image";
import Table from "@/components/Table/Table";
import moment from "moment";
const CaseDocuments = ({ params, role }: { params: any; role: any }) => {
  const [documents, setDocuments] = useState({
    data: [],
    totalEntires: 0,
    currentPage: 0,
  });
  const [FIleModelOpen, setFileModelOpen] = useState(false);
  const [ReasonModelOpen, setReasonModelOpen] = useState(false);
  const [ReasonModalLoader, setReasonModelLoader] = useState(false);

  const [FileModalLoader, setFileModelLoader] = useState(false);
  const [loading, setLoading] = useState(false);
  const search = useSearchParams();
  let DocsType = search?.get("type") || "";
  const [form, setform] = useState({ id: "", status: "", modelTitle: "" });
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: File | null;
  }>({}); // New state for storing selected files
  const { data } = useSession();
  const [filter, setFilter] = useState({
    status: "",
    type: "",
    category: "",
    page: 1,
  });
  const getBaseURL = () => {
    return `${process.env.NEXT_PUBLIC_PDF_URL}/uploads`;

    if (window.location.hostname == "localhost") {
      return "/uploads";
    } else {
      return "/api/file";
    }
  };
  const GetFormat = (key: any) => {
    console.log(key);
    if (key.includes(".pdf")) return ".pdf";
    if (key.includes(".png")) return ".png";
    if (key.includes(".jpeg")) return ".jpeg";
    if (key.includes(".jpg")) return ".jpg";
    if (key.includes(".ods")) return ".ods";
    if (key.includes(".txt")) return ".txt";
    if (key.includes(".csv")) return ".csv";
    if (key.includes(".xls")) return ".xls";
    if (key.includes(".xlsx")) return ".xlsx";
    if (key.includes(".doc")) return ".doc";
    if (key.includes(".docx")) return ".docx";
    if (key.includes(".ppt")) return ".ppt";
    if (key.includes(".pptx")) return ".pptx";
    if (key.includes(".zip")) return ".zip";
    if (key.includes(".rar")) return ".rar";
    if (key.includes(".mp4")) return ".mp4";
    if (key.includes(".mp3")) return ".mp3";
    if (key.includes(".wav")) return ".wav";
    if (key.includes(".gif")) return ".gif";
    if (key.includes(".svg")) return ".svg";
    if (key.includes(".html")) return ".html";
    if (key.includes(".css")) return ".css";
    if (key.includes(".js")) return ".js";
    if (key.includes(".json")) return ".json";
    if (key.includes(".webp")) return ".webp";

    return ".png";
  };
  const HandleDOwnloadImage = async (FileURL: any, title: any) => {
    console.log(data);
    console.log(FileURL, title);
    fetch(`${getBaseURL() + FileURL}`, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;

          link.setAttribute("download", `${title}${GetFormat(FileURL)}`); //or any other extension
          document.body.appendChild(link);
          link.click();
          // setLoading({ ...loading, isDownload: false });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const [open, setOpen] = useState("");

  const handleClick = (key: any) => {
    setOpen(key);
    // setOpen((prevOpen) => !prevOpen); // Toggle the open state
  };
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
  const [SuggestReason, setSuggestionReason] = useState("");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl);
  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };
  const [SelectedDoc, setSelectedDoc] = useState("");
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [ModeLoader, setModelLoader] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const getDocuments = async (
    status: string,
    type: string,
    category: any,
    page: any
  ) => {
    setLoading(true);
    try {
      const res: any = await axios.get(
        `/api/cases/${
          params.id
        }/documents?status=${status}&type=${type}&category=${category}&page=${
          page || 1
        }`
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

  const handleStatusChange = async (docId: string, status: string) => {
    setModelLoader(true);
    if (status == "suggestion" && !SuggestReason) {
      openSnackbar({
        message: "Please enter reason for suggesstion",
        type: "error",
      });
      return;
    }
    if (status == "suggestion") {
      setReasonModelLoader(true);
      setLoaders({
        ...loaders,
        suggestion: true,
      });
    }
    let payload: any = { status: status };
    if ((status = "suggestion")) {
      payload["reason"] = SuggestReason;
    }
    try {
      await axios.put(`/api/documents/${docId}/status`, payload);
      setModelLoader(false);
      setOpenDialog(false);
      openSnackbar({
        message: `Document ${status} successfully`,
        type: "success",
      });
      if (status == "suggestion") {
        setReasonModelLoader(false);
        setReasonModelOpen(false);
      }
      setLoaders({
        edit_request: false,
        edit_requestID: "",
        suggestion: false,
        suggestionID: "",
        acceptEditRequest: false,
        acceptEditRequestID: "",
        RejectEditRequestID: "",
        RejectEditRequest: false,
      });
      if (DocsType) {
        router.push(`/${currentUser?.role}/case-documents/${params?.id}`);
      }
      getDocuments("", "", "", 1);
      setFilter({ status: "", type: "", category: "", page: 1 });
    } catch (err: any) {
      openSnackbar({
        message: err?.message ?? `Failed to ${status} document`,
        type: "error",
      });
    }
  };

  // Store selected file in state
  const handleFileChange = (docId: string, file: File | null) => {
    setSelectedFiles((prevState) => ({
      ...prevState,
      [docId]: file,
    }));
  };

  // Trigger document update on button click
  const handleDocumentUpdate = async (docId: string) => {
    const selectedFile = selectedFiles[docId];
    if (!selectedFile) {
      openSnackbar({
        message: "Please select a file to upload",
        type: "error",
      });
      return;
    }
    setLoaders({ ...loaders, suggestion: true });
    const formData = new FormData();
    formData.append("document", selectedFile);

    try {
      await axios.put(`/api/documents/${docId}/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoaders({ ...loaders, suggestion: false });

      openSnackbar({
        message: "Document updated successfully",
        type: "success",
      });
      getDocuments("", "", "", filter.page);

      if (DocsType) {
        router.push(`/${currentUser?.role}/case-documents/${params?.id}`);
      }
      setSelectedDoc("");
      setFileModelOpen(false);
      getDocuments("", "", "", filter.page);
    } catch (err: any) {
      openSnackbar({
        message: err?.message ?? "Failed to update document",
        type: "error",
      });
    }
  };
  const options = [
    { label: "Personal Document", value: "personal" },
    { label: "Proof of Identity", value: "identity" },
    { label: "Communication to Read", value: "communication" },
    { label: "Proof of Damage", value: "damage" },
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
    getDocuments(filter.status, DocsType, "", filter.page);
    setFilter({ ...filter, type: DocsType });
  }, [params.id, DocsType]);

  return (
    <div className="main-content  case-doc-details mt-4">
      <div className="text-end">
        {role == "admin" ? null : (
          <Button
            variant="contained"
            className="client-btn f-16"
            size="md"
            onClick={() => {
              if (currentUser?.role) {
                router.push(
                  `/${currentUser?.role}/case-documents/${params.id}/add`
                );
              }
            }}
          >
            Add New Document
          </Button>
        )}
      </div>
      <ConfirmationDialog
        open={openDialog}
        title={`Document Confirmation`}
        message={`Are you sure you want to ${form.modelTitle} this Document? This action cannot be undone.`}
        loading={ModeLoader}
        onConfirm={() => {
          handleStatusChange(form.id, form.status);
          // AssignLawyer(activeLawyerId);
        }}
        onCancel={() => setOpenDialog(false)}
      />
      <div className="mb-4 d-flex">
        {/* <div className="text-end">
          <Button
            variant="contained"
            className="client-btn f-16"
            size="md"
            onClick={() =>
              router.push(
                `/${currentUser?.role}/case-documents/${params.id}/add`
              )
            }
          >
            Add New Document
          </Button>
        </div> */}
        <div
          className=" d-flex align-items-end col-3 ml-3"
          style={{ marginLeft: "5px" }}
        >
          <select
            value={filter.category}
            onChange={(e: any) => {
              getDocuments(
                filter.status,
                filter.type,
                e.target.value,
                filter.page
              );
              setFilter({ ...filter, category: e.target.value });
            }}
            name=""
            style={{ marginRight: "15px" }}
            className="form-control bg-white p-2 col-auto ml-3"
            id=""
          >
            {" "}
            <option value="">Select Category</option>
            <option value="personal">Personal Documents</option>
            <option value="damage">Proof of Damage</option>
            <option value="identity">Proof of Identity</option>
            <option value="communication">Communication of Read</option>
          </select>
          <select
            style={{ marginRight: "15px" }}
            value={filter.status}
            onChange={(e: any) => {
              setFilter({ ...filter, status: e.target.value });
              getDocuments(
                e.target.value,
                filter.type,
                filter.category,
                filter.page
              );
            }}
            name=""
            className="form-control bg-white p-2 col-auto"
            id=""
          >
            <option value="">Select Status</option>

            <option value="">All</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
            <option value="requested">Requested</option>
            <option value="suggestion">Suggestion</option>
            {/* <option value="edit_request">Edit Request</option> */}
          </select>
          <select
            value={filter.type}
            onChange={(e: any) => {
              setFilter({ ...filter, type: e.target.value });
              getDocuments(
                filter.status,
                e.target.value,
                filter.category,
                filter.page
              );
            }}
            style={{ marginRight: "15px" }}
            className="form-control bg-white p-2 col-auto ml-3"
          >
            <option value="">Select Document </option>
            <option value="all">Indemmisez Moi Reviewed Documents</option>
            <option value="claim">Client uploaded docuemnts</option>
            <option value={"lawyer"}>Lawyer drafted document</option>
          </select>
        </div>
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
                  getDocuments(
                    filter.status,
                    filter.type,
                    filter.category,
                    page
                  );
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
                      return <span>{GetCategory(category) || "NA"}</span>;
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
                    Cell({
                      entry: {
                        _id,
                        title,
                        status,
                        role,
                        document,
                        reason,
                        uploadedBy,
                      },
                    }: any) {
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
                              onClick={() =>
                                HandleDOwnloadImage(document, title)
                              }
                              className="border px-2 py-1 rounded me-2"
                            >
                              <img
                                src="../../assets/down.png"
                                alt="view"
                                className="view-doc"
                              />
                            </a>
                            <div className="relative">
                              {currentUser?.role == "expert" && (
                                <>
                                  {status == "accepted" ||
                                  status == "rejected" ||
                                  status == "suggestion" ? null : (
                                    <>
                                      <Button
                                        id="basic-button"
                                        className="border px-1 py-1 rounded bg-white"
                                        aria-controls={
                                          open == _id ? "basic-menu" : undefined
                                        }
                                        aria-haspopup="true"
                                        aria-expanded={
                                          open == _id ? "true" : undefined
                                        }
                                        onClick={() => {
                                          if (_id && _id == open) {
                                            handleClick("");
                                          } else {
                                            handleClick(_id);
                                          }
                                        }}
                                      >
                                        <img
                                          src="../../assets/ellipse.png"
                                          alt="view"
                                          className="view-doc"
                                        />
                                      </Button>
                                    </>
                                  )}
                                </>
                              )}

                              {(currentUser?.role != "expert" &&
                                role == currentUser?.role) ||
                              uploadedBy?.role == currentUser?.role ? (
                                <>
                                  {status == "rejected" ||
                                  status == "requested" ||
                                  status == "accepted" ? null : (
                                    <Button
                                      id="basic-button"
                                      className="border px-1 py-1 rounded bg-white"
                                      aria-controls={
                                        open == _id ? "basic-menu" : undefined
                                      }
                                      aria-haspopup="true"
                                      aria-expanded={
                                        open == _id ? "true" : undefined
                                      }
                                      onClick={() => {
                                        if (_id && _id == open) {
                                          handleClick("");
                                        } else {
                                          handleClick(_id);
                                        }
                                      }}
                                    >
                                      <img
                                        src="../../assets/ellipse.png"
                                        alt="view"
                                        className="view-doc"
                                      />
                                    </Button>
                                  )}
                                </>
                              ) : null}

                              {role != "expert" && open == _id && (
                                <div
                                  className="menu-options"
                                  id="basic-menu"
                                  // anchorEl={anchorEl}
                                  // open={open}
                                  // onClose={handleClose}
                                  // MenuListProps={{
                                  //   "aria-labelledby": "basic-button",
                                  // }}
                                >
                                  {currentUser?.role == role ||
                                  (uploadedBy?.role == currentUser?.role &&
                                    status == "suggestion") ? (
                                    <MenuItem
                                      onClick={() => {
                                        setSelectedDoc(_id);
                                        setFileModelOpen(true);
                                        console.log(reason, "id");
                                        setSuggestionReason(reason);
                                        // handleStatusChange(_id, "suggestion");
                                      }}
                                      className="gray"
                                    >
                                      Upload Document
                                    </MenuItem>
                                  ) : null}
                                  {currentUser?.role === "expert" &&
                                    status === "requested" && (
                                      <>
                                        <MenuItem
                                          onClick={() => {
                                            setOpenDialog(true);
                                            setform({
                                              status: "accepted",
                                              id: _id,
                                              modelTitle: "Accept",
                                            });
                                          }}
                                          className="green"
                                        >
                                          Accept
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            setOpenDialog(true);
                                            setform({
                                              status: "rejected",
                                              id: _id,
                                              modelTitle: "Reject",
                                            });
                                          }}
                                          className="red"
                                        >
                                          Reject
                                        </MenuItem>
                                        <MenuItem
                                          onClick={() => {
                                            setSelectedDoc(_id);

                                            setReasonModelOpen(true);
                                          }}
                                          className="gray"
                                        >
                                          Suggest Document Upgrade
                                        </MenuItem>
                                      </>
                                    )}
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      );
                    },
                  },
                ]}
              />
              {/* {documents.map((doc: any, index) => (
            <div key={index} className="col-12 col-lg-6 col-xxl-4 mb-3">
              <div className="card p-3 position-relative">
                <div className="card-body">
                  <h5 className="card-title mt-3">
                    <DescriptionIcon
                      style={{ fontSize: "28px", color: "#007bff" }}
                    />
                    {doc?.title ?? "Untitled Document"}
                  </h5>
                  
                  <p className="f-14">
                    <b>Uploaded by:</b>{" "}
                    {doc?.user_details?.name
                      ? `${doc?.user_details?.name} (${doc?.user_details?.role})`
                      : "N/A"}
                  </p>
                  {doc.document ? (
                    <div className="document-preview text-center">
                      {renderDocumentPreview(doc.document)}
                      
                      <div className="mt-3 d-flex align-items-center case-doc-routes justify-content-center gap-2">
                        <a
                          onClick={() =>
                            router.push(
                              `/${role}/case-documents/detail?id=${doc?._id}`
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
                          href={doc.document}
                          download
                          className="border px-2 py-1 rounded me-2"
                        >
                          <img
                            src="../../assets/down.png"
                            alt="view"
                            className="view-doc"
                          />
                        </a>
                        <div>
                          {currentUser.role == "expert" && (
                            <>
                              {doc.status == "accepted" ||
                              doc.status == "rejected" ||
                              doc.status == "suggestion" ? null : (
                                <>
                                  <Button
                                    id="basic-button"
                                    className="border px-1 py-1 rounded bg-white"
                                    aria-controls={
                                      open ? "basic-menu" : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                    onClick={handleClick}
                                  >
                                    <img
                                      src="../../assets/ellipse.png"
                                      alt="view"
                                      className="view-doc"
                                    />
                                  </Button>
                                </>
                              )}
                            </>
                          )}

                          {currentUser?.role == "client" &&
                          doc.role == "client" ? (
                            <>
                              {doc.status == "rejected" ||
                              doc.status == "requested" ||
                              doc.status == "accepted" ||
                              doc.status == "suggestion" ? null : (
                                <Button
                                  id="basic-button"
                                  className="border px-1 py-1 rounded bg-white"
                                  aria-controls={
                                    open ? "basic-menu" : undefined
                                  }
                                  aria-haspopup="true"
                                  aria-expanded={open ? "true" : undefined}
                                  onClick={handleClick}
                                >
                                  <img
                                    src="../../assets/ellipse.png"
                                    alt="view"
                                    className="view-doc"
                                  />
                                </Button>
                              )}
                            </>
                          ) : null}
                          {doc.role != "expert" && (
                            <Menu
                              id="basic-menu"
                              anchorEl={anchorEl}
                              open={open}
                              onClose={handleClose}
                              MenuListProps={{
                                "aria-labelledby": "basic-button",
                              }}
                            >
                              {currentUser?.role === "expert" &&
                                doc.status === "requested" && (
                                  <>
                                    <MenuItem
                                      onClick={() => {
                                        setOpenDialog(true);
                                        setform({
                                          status: "accepted",
                                          id: doc._id,
                                          modelTitle: "Accept",
                                        });
                                      }}
                                      className="green"
                                    >
                                      Accept
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        setOpenDialog(true);
                                        setform({
                                          status: "rejected",
                                          id: doc._id,
                                          modelTitle: "Reject",
                                        });
                                      }}
                                      className="red"
                                    >
                                      Reject
                                    </MenuItem>
                                    <MenuItem
                                      onClick={() => {
                                        handleStatusChange(
                                          doc._id,
                                          "suggestion"
                                        );
                                      }}
                                      className="gray"
                                    >
                                      Suggest Document Upgrade
                                    </MenuItem>
                                  </>
                                )}
                            
                            </Menu>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted">No file available.</p>
                  )}

                  {renderStatusBadge(doc.status)}

                  {GetUpdateCheck(doc.status) &&
                    currentUser?._id === doc?.uploadedBy?.user && (
                      <div className="mt-3">
                        <input
                          className="form-control"
                          type="file"
                          accept="application/pdf,image/*"
                          onChange={(e: any) =>
                            handleFileChange(doc._id, e.target.files[0])
                          }
                        />
                        <Button
                          variant="primary"
                          color="primary"
                          className="mt-2"
                          onClick={() => handleDocumentUpdate(doc._id)}
                        >
                          Upload New Document
                        </Button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))} */}
              <Dialog
                open={FIleModelOpen}
                onClose={() => setFileModelOpen(false)}
              >
                <DialogTitle>Upload new Document</DialogTitle>
                <DialogTitle className="d-flex align-items-center">
                  <label>Reason : </label>{" "}
                  <label style={{ marginLeft: "3px" }}> {SuggestReason}</label>
                </DialogTitle>

                <DialogContent>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e: any) =>
                      handleFileChange(SelectedDoc, e.target.files[0])
                    }
                    name=""
                    id=""
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setFileModelOpen(false)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    onClick={() => handleDocumentUpdate(SelectedDoc)}
                    color="secondary"
                    loading={loaders?.suggestion}
                  >
                    <span>Upload</span>
                  </LoadingButton>
                </DialogActions>
              </Dialog>
              <Dialog
                open={ReasonModelOpen}
                onClose={() => setReasonModelOpen(false)}
              >
                <DialogTitle>Reason for Suggestion</DialogTitle>
                <DialogContent>
                  <textarea
                    style={{ width: "500px" }}
                    className="form-control"
                    placeholder="Give Changes Idea"
                    onChange={(e: any) => setSuggestionReason(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setReasonModelOpen(false)}
                    className="client-btn"
                    variant="contained"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <LoadingButton
                    onClick={() =>
                      handleStatusChange(SelectedDoc, "suggestion")
                    }
                    // variant="outline"
                    className="submit-btn"
                    loading={loaders?.suggestion}
                  >
                    <span>Submit</span>
                  </LoadingButton>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CaseDocuments;
