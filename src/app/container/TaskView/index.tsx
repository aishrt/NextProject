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
import { Alert, Snackbar, Tooltip } from "@mui/material";
import ClaimFinancialModel from "@/models/claim_financial.model";
import moment from "moment";
import { axios } from "@/utils/axios";
import { useRouter } from "next/navigation";
import useSnackbar from "@/hooks/useSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";

const TaskDetails = ({
  data,
  task_id,
  role,
}: {
  data: any;
  task_id: any;
  role?: any;
}) => {
  const router = useRouter();
  const [details, setDetails]: any = useState({});
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const [loading, setLoading] = useState({
    approved: false,
    reject: false,
    edit_suggesstion: false,
    reviewing: false,
    isDownload: false,
  });
  const GetTaskDetails = () => {
    axios.get(`/api/task/list?task_id=${task_id}`).then((res: any) => {
      console.log(res);
      if (res.status == 200) {
        setDetails(res?.data);
      }
    });
  };

  const getBaseURL = () => {
    return `${process.env.NEXT_PUBLIC_PDF_URL}/uploads`;

    if (window.location.hostname == "localhost") {
      return "/uploads";
    } else {
      return "/api/file";
    }
  };
  const UpdateTask = (status: any) => {
    setLoading({ ...loading, [status]: true });
    axios
      .post("/api/task/update", { task_id, status: status })
      .then((res: any) => {
        if (res?.status == 200) {
          setLoading({ ...loading, [status]: false });
          openSnackbar({
            message: "Status updated successully",
            type: "success",
          });

          router.back();
        }
      })
      .catch((err: any) => {
        openSnackbar({ message: err?.message, type: "error" });
      });
  };

  useEffect(() => {
    GetTaskDetails();
  }, [task_id]);

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
  const HandleDOwnloadImage = async (fileURL: String) => {
    if (!loading.isDownload) {
      return false;
    }
    fetch(`${getBaseURL() + fileURL}`, {
      method: "GET",
      headers: {},
    })
      .then((response) => {
        response.arrayBuffer().then(function (buffer) {
          const url = window.URL.createObjectURL(new Blob([buffer]));
          const link = document.createElement("a");
          link.href = url;
          window.alert(fileURL);
          link.setAttribute(
            "download",
            `${details?.title}${GetFormat(details?.updates.document)}`
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

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Task Details</h2>
        <button  className="submit-btn bg-white rounded">
          <a style={{ textDecoration: "none", color: "#000" }} onClick={() => router.back()}>
            Back
          </a>
        </button>

        {/* <button className="form-control " onClick={()=>{
      }} style={{width:'140px'}}> <a href="/add-question" style={{textDecoration:'none'}}>Add Question</a> </button> */}
      </div>
      {!details?.title ? (
        <>
          <div className="">
            <p className="placeholder-glow">
              <span className="placeholder col-12"></span>
            </p>

            <p className="placeholder-wave">
              <span className="placeholder col-12"></span>
            </p>
            <p aria-hidden="true">
              <span className="placeholder col-6"></span>
            </p>

            <a
              className="btn btn-primary disabled placeholder col-4"
              aria-hidden="true"
            ></a>
          </div>
        </>
      ) : (
        <div className="">
          <div className="  mt-4 indivi-form">
            <div className="cases-list-table expert-table">
              <div className="row mt-5">
                <div className="col-12 col-lg-8 white-card p-5 rounded">
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
                        className=" bglight-ip w-100 rounded  graph_input"
                        value={details?.title}
                        disabled
                        name="question"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
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
                        className=" bglight-ip w-100 rounded  graph_input"
                        value={details?.description}
                        disabled
                        name="question"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="flex flex-col graph_dev mt-3">
                    <h6 className="flex">Category</h6>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        required
                        className=" bglight-ip w-100 rounded  graph_input"
                        value={details?.category}
                        disabled
                        name="question"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="flex flex-col graph_dev mt-3">
                    <h6 className="flex">Last Submission Date</h6>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        required
                        className=" bglight-ip w-100 rounded  graph_input"
                        value={moment(details?.submissionAt).format(
                          "YYYY-MM-DD"
                        )}
                        disabled
                        name="question"
                        type="date"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="flex flex-col graph_dev mt-3">
                    <h6 className="flex">Valid Till</h6>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        required
                        className=" bglight-ip w-100 rounded  graph_input"
                        value={moment(details?.validTill).format("YYYY-MM-DD")}
                        disabled
                        name="question"
                        type="date"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {details?.updates ? (
                    <div className="flex flex-col graph_dev mt-3">
                      <h6 className="flex">Updates</h6>

                      <div className="flex flex-col graph_dev mt-3">
                        <h6 className="flex">Title</h6>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <input
                            required
                            className=" bglight-ip w-100 rounded  graph_input"
                            value={details?.updates?.title}
                            disabled
                            name="question"
                            type="text"
                            placeholder=""
                          />
                        </div>
                      </div>
                      <div className="flex flex-col graph_dev mt-3">
                        <h6 className="flex">Descrption</h6>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            width: "100%",
                          }}
                        >
                          <input
                            required
                            className=" bglight-ip w-100 rounded  graph_input"
                            value={details?.updates?.description}
                            disabled
                            name="question"
                            type="text"
                            placeholder=""
                          />
                        </div>
                      </div>
                      {details?.updates?.document ? (
                        <div className="flex flex-col graph_dev mt-3">
                          <h6 className="flex">Document</h6>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <iframe
                              style={{ borderRadius: "5px" }}
                              title="Document"
                              src={`${
                                getBaseURL() + details?.updates?.document
                              }`}
                            ></iframe>
                            <img
                              style={{
                                width: "32px",
                                marginLeft: "5px",
                                cursor: "pointer",
                              }}
                              title="Download"
                              onClick={() => {
                                setLoading({ ...loading, isDownload: true });

                                HandleDOwnloadImage(details?.updates?.document);
                              }}
                              src="https://i.pinimg.com/474x/63/a4/35/63a435bf71e6627eedce9b91a0859c89.jpg"
                              alt=""
                            />
                          </div>
                        </div>
                      ) : null}
                      {details?.updates?.v2_document ? (
                        <div className="flex flex-col graph_dev mt-3">
                          <h6 className="flex">Version-2 Document</h6>

                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              width: "100%",
                            }}
                          >
                            <iframe
                              style={{ borderRadius: "5px" }}
                              src={`${
                                getBaseURL() + details?.updates?.v2_document
                              }`}
                            ></iframe>
                            <img
                              style={{
                                width: "32px",
                                marginLeft: "5px",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setLoading({ ...loading, isDownload: true });
                                HandleDOwnloadImage(
                                  details?.updates?.v2_document
                                );
                              }}
                              src="https://i.pinimg.com/474x/63/a4/35/63a435bf71e6627eedce9b91a0859c89.jpg"
                              alt=""
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
};

export default TaskDetails;
