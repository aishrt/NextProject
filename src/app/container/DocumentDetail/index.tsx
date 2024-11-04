"use client";
import { PaginateData } from "@/types/Paginate";
import { User as UserType } from "@/types/User";
import db from "@/utils/connectDB";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import "../../admin/admin.css";
import CerQuestions from "@/models/cerQuestion.model";
import ClaimReportModel from "@/models/cer_Report.model";
import { FaLock } from "react-icons/fa";
import { CircularProgress, Tooltip } from "@mui/material";
import ClaimFinancialModel from "@/models/claim_financial.model";
import moment from "moment";
import { axios } from "@/utils/axios";
import { useRouter } from "next/navigation";
import useSnackbar from "@/hooks/useSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";
import { Button } from "@/components/Form/Button";

const DocumentsDetails = ({
  // data,
  id,
  role,
}: {
  // data: any;
  id: any;
  role?: any;
}) => {
  const router = useRouter();
  const [details, setDetails]: any = useState({});
  const [data, setData]: any = useState({});
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const [loading, setLoading] = useState({
    approved: false,
    reject: false,
    edit_suggesstion: false,
    reviewing: false,
    isDownload: false,
  });
  const getBaseURL = () => {
    return `${process.env.NEXT_PUBLIC_PDF_URL}/uploads`;
    if (window.location.hostname == "localhost") {
      return "/uploads";
    } else {
      return "/api/file";
    }
  };
  const GetTaskDetails = () => {
    axios.get(`/api/documents/${id}/detail`).then((res: any) => {
      setData(res);
    });
  };
  // const UpdateTask = (status: any) => {
  //   setLoading({ ...loading, [status]: true });

  //   axios
  //     .post("/api/task/update", { task_id, status: status })
  //     .then((res: any) => {
  //       if (res?.status == 200) {
  //         setLoading({ ...loading, [status]: false });

  //         openSnackbar({
  //           message: "Status updated successully",
  //           type: "success",
  //         });
  //         router.back();
  //       }
  //     });
  // };

  useEffect(() => {
    GetTaskDetails();
  }, [id]);

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
  const HandleDOwnloadImage = async (FileURL: any) => {
    console.log(data);
    if (!loading.isDownload) {
      return false;
    }
    fetch(`${getBaseURL() + FileURL}`, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;

          link.setAttribute(
            "download",
            `${data?.documents?.title}${GetFormat(FileURL)}`
          ); //or any other extension
          document.body.appendChild(link);
          link.click();
          setLoading({ ...loading, isDownload: false });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const GetUpdateButton = (key: any) => {
    if (key == "reject") {
      return false;
    }
    if (key == "approved") {
      return false;
    } else return true;
  };
  const renderDocumentPreview = (documentUrl: string) => {
    const fileExtension = documentUrl?.split(".").pop()?.toLowerCase();

    if (["jpg", "jpeg", "png", "gif"].includes(fileExtension!)) {
      return (
        <img
          src={getBaseURL() + documentUrl}
          className="d-block m-auto"
          alt="document preview"
          style={{ maxWidth: "100%", height: "200px", objectFit: "contain" }}
        />
      );
    }

    if (fileExtension === "pdf") {
      return (
        <img
          src={"https://cdn-icons-png.freepik.com/512/180/180327.png"}
          alt="document preview"
          style={{ maxWidth: "100%", height: "160px", objectFit: "contain" }}
        />
      );
    }

    return (
      <a
        href={getBaseURL() + documentUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary"
      >
        View Document
      </a>
    );
  };

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-26 fw-500">Document Details</h2>

        <Button
          variant="contained"
          style={{ width: "140px" }}
          className="client-btn"
          onClick={() => {
            if (role) {
              router.push(
                `/${role}/case-documents/${data?.documents?.case_id?._id}`
              );
            }
          }}
        >
          <a style={{ textDecoration: "none" }}>Back</a>
        </Button>

        {/* <button className="form-control " onClick={()=>{
      }} style={{width:'140px'}}> <a href="/add-question" style={{textDecoration:'none'}}>Add Question</a> </button> */}
      </div>
      {!data?.documents?._id ? (
        <div>
          <>
            <div className="mt-5">
              <p className="placeholder-glow">
                <span className="placeholder col-12"></span>
              </p>

              <p className="placeholder-wave">
                <span className="placeholder col-12"></span>
              </p>
              <p aria-hidden="true" className="placeholder-wave">
                <span className="placeholder col-6"></span>
              </p>

              <a
                className="btn btn-primary disabled placeholder-wave col-4"
                aria-hidden="true"
              ></a>
            </div>
          </>
        </div>
      ) : (
        <div className="res-table-box">
          <div className=" mt-4">
            <div className="cases-list-table expert-table">
              <div className="flex flex-col mt-5 w-1/2 white-card p-4 rounded indivi-form">
                {data?.case_id?.referenceId && (
                  <div className="flex flex-col graph_dev mt-3">
                    <h6 className="flex">Document Name</h6>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        required
                        className="form-control graph_input"
                        value={data?.documents?.title}
                        disabled
                        name="question"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                )}
                <div className="row">
                  <div className="col-12 col-md-12 col-xxl-6">
                    <div className="flex flex-col graph_dev mt-3">
                      <h6 className="flex">Document Name</h6>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <input
                          required
                          className="bglight-ip w-100 rounded"
                          value={data?.documents?.title}
                          disabled
                          name="question"
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-xxl-6">
                    <div className="flex flex-col graph_dev mt-3">
                      <h6 className="flex">Uploaded By</h6>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <input
                          required
                          className="bglight-ip w-100 rounded"
                          value={
                            data?.userDetails?.firstName ||
                            data?.userDetails?.name
                          }
                          disabled
                          name="question"
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-xxl-6">
                    <div className="flex flex-col graph_dev mt-3">
                      <h6 className="flex">Description</h6>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <input
                          required
                          className="bglight-ip w-100 rounded"
                          value={data?.documents?.description || ""}
                          disabled
                          name="question"
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-12 col-xxl-6">
                    <div className="flex flex-col graph_dev mt-3">
                      <h6 className="flex">Uploaded At</h6>

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <input
                          required
                          className="bglight-ip w-100 rounded"
                          value={moment(data?.documents?.createdAt).format(
                            "DD-MMM-YYYY"
                          )}
                          disabled
                          name="question"
                          type="text"
                          placeholder=""
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <hr />

                {/* {data?.documents?.document ? (
                  <div className="row graph_dev mt-3">
                    <div className="col-12 col-md-6 col-xxl-4">
                      <h6 className="f-20 fw-500">Document</h6>

                      <div className="document-div bggray rounded p-4 text-center">
                        {renderDocumentPreview(data?.documents?.document)}{" "}
                        <img
                          style={{ width: "32px" }}
                          title="Download"
                          className="mt-3"
                          onClick={() => {
                            setLoading({ ...loading, isDownload: true });
                            HandleDOwnloadImage(data?.documents?.document);
                          }}
                          src="https://i.pinimg.com/474x/63/a4/35/63a435bf71e6627eedce9b91a0859c89.jpg"
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                ) : null} */}
                <div className="row mt-4">
                  {data?.documents?.previousVersions ? (
                    <>
                      {data?.documents?.previousVersions?.map(
                        (itm: any, i: any) => {
                          return (
                            <div className="col-12 col-md-6 col-xxl-4" key={i}>
                              <h6 className="f-20 fw-500">
                                Version-{itm?.version + 1} Document
                              </h6>

                              <div className="document-div bggray rounded p-4 text-center">
                                {renderDocumentPreview(itm?.document)}{" "}
                                <img
                                  style={{ width: "32px" }}
                                  title="Download"
                                  className="mt-3"
                                  onClick={() => {
                                    setLoading({
                                      ...loading,
                                      isDownload: true,
                                    });
                                    HandleDOwnloadImage(itm?.document);
                                  }}
                                  src="https://i.pinimg.com/474x/63/a4/35/63a435bf71e6627eedce9b91a0859c89.jpg"
                                  alt=""
                                />
                              </div>
                            </div>
                          );
                        }
                      )}
                    </>
                  ) : null}
                  {/* <div className="d-flex">
                    {data?.documents?.previousVersions ? (
                      <>
                        {data?.documents?.previousVersions?.map(
                          (itm: any, i: any) => {
                            return (
                              <div
                                className="flex flex-col graph_dev mt-3 ml-3"
                                key={i}
                              >
                                <h6 className="flex">
                                  Version-{itm?.version + 1} Document
                                </h6>

                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    width: "100%",
                                  }}
                                >
                                  {renderDocumentPreview(itm?.document)}{" "}
                                  <img
                                    style={{ width: "32px" }}
                                    title="Download"
                                    onClick={() => {
                                      setLoading({
                                        ...loading,
                                        isDownload: true,
                                      });
                                      HandleDOwnloadImage(itm?.document);
                                    }}
                                    src="https://i.pinimg.com/474x/63/a4/35/63a435bf71e6627eedce9b91a0859c89.jpg"
                                    alt=""
                                  />
                                </div>
                              </div>
                            );
                          }
                        )}
                      </>
                    ) : null}
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsDetails;
