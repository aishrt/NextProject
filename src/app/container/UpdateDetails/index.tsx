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
import { Tooltip } from "@mui/material";
import ClaimFinancialModel from "@/models/claim_financial.model";
import moment from "moment";
import { axios } from "@/utils/axios";
import { useRouter } from "next/navigation";
import useSnackbar from "@/hooks/useSnackbar";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import doc from "@/assets/folder-open.png";
import { Link } from "@mui/material";
import "../../expert/expert.css";

const UpdateView = ({ data, id, role }: { data: any; id: any; role?: any }) => {
  const router = useRouter();
  const [details, setDetails]: any = useState({});
  const { openSnackbar, snackProps, alertProps } = useSnackbar();
  const [referenceId, setReference] = useState<string>("");
  const [subVal, setDateVal] = useState<string>("");
  const [submissionDate, setSubmission] = useState<string>("");
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
  const HandleDOwnloadImage = async (FileURL: any) => {
    const link = document.createElement("a");
    link.href = `${getBaseURL() + FileURL}`;
    link.target = "_blank";
    // link.setAttribute("download", `${data?.data?.title}${GetFormat(FileURL)}`);
    // document.body.appendChild(link);
    link.click();
    return;
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
            `${data?.data?.title}${GetFormat(FileURL)}`
          );
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  console.log(data.data, "=====data");
  return (
    // <div className="main-content expert-cases">
    //   <div className="top-br d-flex justify-content-between align-items-center">
    //     <h2 className="f-24">Update Details</h2>

    //     <button style={{ width: "140px" }} className="form-control">
    //       <a style={{ textDecoration: "none" }} onClick={() => router.back()}>
    //         Back
    //       </a>
    //     </button>
    //   </div>
    //   <div className="res-table-box">
    //     <div className="table-responsive mt-4">
    //       <div className="cases-list-table expert-table">
    //         <div className="flex flex-col mt-5 w-1/2">
    //           <div className="flex flex-col graph_dev mt-3">
    //             <h6 className="flex">Title of Discussion</h6>

    //             <div
    //               style={{
    //                 display: "flex",
    //                 alignItems: "center",
    //                 width: "100%",
    //               }}
    //             >
    //               <input
    //                 required
    //                 className="form-control graph_input"
    //                 value={data?.data?.title}
    //                 disabled
    //                 name="question"
    //                 type="text"
    //                 placeholder=""
    //               />
    //             </div>
    //           </div>
    //           <div className="flex flex-col graph_dev mt-3">
    //             <h6 className="flex">Description</h6>

    //             <div
    //               style={{
    //                 display: "flex",
    //                 alignItems: "center",
    //                 width: "100%",
    //               }}
    //               dangerouslySetInnerHTML={{ __html: data?.data?.description }}
    //             ></div>
    //           </div>

    //           <div className="flex flex-col graph_dev mt-3">
    //             <h6 className="flex">Discussion Date</h6>

    //             <div
    //               style={{
    //                 display: "flex",
    //                 alignItems: "center",
    //                 width: "100%",
    //               }}
    //             >
    //               <input
    //                 required
    //                 className="form-control graph_input"
    //                 value={moment(data?.data?.discussionDate).format(
    //                   "YYYY-MM-DD"
    //                 )}
    //                 disabled
    //                 name="question"
    //                 type="date"
    //                 placeholder=""
    //               />
    //             </div>
    //           </div>

    //           {data?.data?.document ? (
    //             <div className="flex flex-col graph_dev mt-3">
    //               <h6 className="flex">Document</h6>

    //               <div
    //                 style={{
    //                   display: "flex",
    //                   alignItems: "center",
    //                   width: "100%",
    //                 }}
    //               >
    //                 <iframe
    //                   src={`http://localhost:3000/public${data?.data?.document}`}
    //                 ></iframe>
    //                 <img
    //                   style={{ width: "32px" }}
    //                   title="Download"
    //                   onClick={() => HandleDOwnloadImage(data?.data?.document)}
    //                   src="https://i.pinimg.com/474x/63/a4/35/63a435bf71e6627eedce9b91a0859c89.jpg"
    //                   alt=""
    //                 />
    //               </div>
    //             </div>
    //           ) : null}
    //           {data?.data?.exchangedDocument ? (
    //             <div className="flex flex-col graph_dev mt-3">
    //               <h6 className="flex">Exchanged Document</h6>

    //               <div
    //                 style={{
    //                   display: "flex",
    //                   alignItems: "center",
    //                   width: "100%",
    //                 }}
    //               >
    //                 <iframe
    //                   src={`http://localhost:3000/public${data?.data?.exchangedDocument}`}
    //                 ></iframe>
    //                 <img
    //                   style={{ width: "32px" }}
    //                   title="Download"
    //                   onClick={() =>
    //                     HandleDOwnloadImage(data?.data?.exchangedDocument)
    //                   }
    //                   src="https://i.pinimg.com/474x/63/a4/35/63a435bf71e6627eedce9b91a0859c89.jpg"
    //                   alt=""
    //                 />
    //               </div>
    //             </div>
    //           ) : null}
    //         </div>
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div className="upate-doc-cnt">
      {/* <div className="doc-filters-form mb-4">
        <div className="row mt-4">
          <div className="col-12 col-md-3">
            <div className="filter-input">
              <input
                type="text"
                className="form-control filter-ip"
                placeholder="Document Name"
              />
            </div>
          </div>
          <div className="col-12 col-md-2">
            <div className="filter-input">
              <label className="date-label">Submission Date:</label>
              <input
                type="date"
                className="form-control filter-ip"
                placeholder="Submission Date"
                value={subVal}
                onChange={(e) => {
                  let date = e.target.value;
                  setDateVal(date);
                  const [year, month, day] = date.split("-");
                  // return `${day}/${month}/${year}`;
                  setSubmission(`${day}/${month}/${year}`);
                }}
              />
            </div>
          </div>
          <div className="col-12 col-md-2">
            <div className="filter-input">
              <input
                type="time"
                className="form-control filter-ip"
                placeholder="Time"
              />
            </div>
          </div>
          <div className="col-12 col-md-2">
            <div className="filter-input">
              <input
                type="text"
                className="form-control filter-ip"
                placeholder="Attendees Name"
              />
            </div>
          </div>
          <div className="col-12 col-md-3">
            <div className=" col-12 col-md-2 filter-btn">
              <Button variant="contained" size="sm" className="expert-btn">
                <span className="f-16">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </div> */}
      {/* Important dates */}
      <div className="row">
        <div className="col-12 col-md-6">
          <div className="today-appoint import-dates white-card rounded-lg">
            <div
              className="appoint-title bggreen"
              style={{ borderRadius: "10px 10px 0 0" }}
            >
              <h3 className="f-18 semi-bold p-3 mb-0">Important Dates</h3>
            </div>

            <div className="active-claims-box p-3">
              <div className="d-flex active-claim-list">
                <span className="claim-status">Case ID</span>
                <span className="claim-coln">:</span>
                <span className="claim-status-cnt">
                  #{data?.data?.case_id?.referenceId}
                </span>
              </div>
              <div className="d-flex active-claim-list">
                <span className="claim-status">Case Category</span>
                <span className="claim-coln">:</span>
                <span className="claim-status-cnt">
                  {data?.data?.case_id?.category}
                </span>
              </div>
              <div className="d-flex active-claim-list">
                <span className="claim-status">Description</span>
                <span className="claim-coln">:</span>

                <span className="claim-status-cnt">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data?.data?.description,
                    }}
                  />
                </span>
              </div>
              {/* <div className="d-flex active-claim-list">
                <span className="claim-status">Location</span>
                <span className="claim-coln">:</span>
                <span className="claim-status-cnt">
                  {data?.data?.case_id?.individualData?.address}{" "}
                </span>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      {/* Communication */}
      <div className="row mt-4">
        <div className="col-12 col-md-8">
          <div className="communication-div white-card p-4">
            <div className="comm-header d-flex justify-content-between align-items-center pb-2 border-btm">
              <p className="f-14 mb-0">
                <span className="semi-bold">Title of Communication:</span>{" "}
                {data?.data?.title}
              </p>
              <p className="f-14 mb-0">
                <span className="semi-bold">Date:</span>{" "}
                {moment(data?.data?.discussionDate).format(
                  "DD-MMM-YYYY H:mm A"
                )}
              </p>
            </div>
            <p className="semi-bold f-16 pt-4">Attendees</p>
            <div className="attendy-tags d-flex gap-2">
              {data?.data?.attendees?.map((itm: any, i: number) => {
                return (
                  <span style={{ backgroundColor: "#FC9DB2" }} key={i}>
                    {itm?.name}
                  </span>
                );
              })}
            </div>
            <p className="semi-bold f-16 pt-4 mb-2">Points discussed</p>
            <ul className="gray f-14">
              {data?.data?.discussionPoint?.map((itm: any, i: number) => {
                return <li key={i}>{itm?.name}</li>;
              })}
            </ul>
            {data?.data?.document && (
              <>
                <p className="semi-bold f-16 pt-4 mb-2">
                  Documents attached of Communication
                </p>
                <div className="row document-row">
                  <div className="col-12 col-md-4  col-lg-4 col-xl-3  mb-4">
                    <Link className="text-decoration-none">
                      {data?.data?.document && (
                        <>
                          {data?.data?.document?.map((itm: any, i: any) => {
                            return (
                              <div
                                key={i}
                                style={{ width: "280px" }}
                                className="folder-card mt-3 rounded recent-folder case-upde"
                              >
                                <Image
                                  src={doc}
                                  className="doc-icn"
                                  alt="doc"
                                />
                                <div
                                  className="doc-filter-fl"
                                  onClick={() => {
                                    HandleDOwnloadImage(itm);
                                  }}
                                >
                                  <h5 className="f-16 mb-0">
                                    {itm?.substr(22, 20)}
                                  </h5>
                                  {/* <p className="f-13 mb-0 gray">5 MB</p> */}
                                </div>
                              </div>
                            );
                          })}
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </>
            )}
            {data?.data?.exchangedDocument && (
              <>
                <p className="semi-bold f-16 pt-4 mb-2">Documents Exchanged</p>
                <div className="row document-row">
                  <div className="col-12 col-md-4  col-lg-4 col-xl-3  mb-4">
                    <Link className="text-decoration-none">
                      {data?.data?.exchangedDocument && (
                        <>
                          {data?.data?.exchangedDocument?.map(
                            (itm: any, i: any) => {
                              return (
                                <div
                                  key={i}
                                  style={{ width: "280px" }}
                                  className="folder-card mt-3 rounded recent-folder case-exchnage"
                                >
                                  <Image
                                    src={doc}
                                    className="doc-icn"
                                    alt="doc"
                                  />
                                  <div
                                    className="doc-filter-fl"
                                    onClick={() => {
                                      HandleDOwnloadImage(itm);
                                    }}
                                  >
                                    <h5 className="f-16 mb-0">
                                      {itm?.substr(17, 20)}
                                    </h5>
                                    {/* <p className="f-13 mb-0 gray">5 MB</p> */}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateView;
