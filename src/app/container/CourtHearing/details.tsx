"use client";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/navigation";
import "../../admin/admin.css";
import Link from "next/link";
import "./Add/style.css";
import doc from "@/assets/folder-open.png";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs from "dayjs";

function Hearingdetails({ role, details }: any) {
  const router = useRouter();
  return (
    <div className="main-content expert-cases case-updates court-hearing">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24 pb-3">Court Hearing Details</h2>

        <button
          onClick={() => router.push(`/${role}/court-hearing`)}
          className="client-btn"
        >
          Back
        </button>
      </div>
      {!details?.title ? (
        <div className="d-flex justify-content-around">
          <div style={{ width: "100%" }} className="mt-5">
            <p className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </p>

            <p className="placeholder-wave">
              <span className="placeholder col-6"></span>
            </p>
            <p aria-hidden="true" className="placeholder-wave">
              <span className="placeholder col-6"></span>
            </p>

            <a
              className="btn btn-primary disabled placeholder-wave col-4"
              aria-hidden="true"
            ></a>
          </div>
          <div style={{ width: "100%" }} className="mt-5">
            <p className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </p>

            <p className="placeholder-wave">
              <span className="placeholder col-6"></span>
            </p>
            <p aria-hidden="true" className="placeholder-wave">
              <span className="placeholder col-6"></span>
            </p>

            <a
              className="btn btn-primary disabled placeholder-wave col-4"
              aria-hidden="true"
            ></a>
          </div>
        </div>
      ) : (
        <div className="row mt-4">
          <div className="col-12 col-md-7">
            <div className="case-details-pre p-4 bg-white rounded-lg doc-requests mb-4">
              <div className="pre-card-details">
                <div className="pi-card-inner rounded">
                  <div className="f-14 p-3 lawyer-case-details d-flex">
                    <span className="title">Case</span>
                    <span className="coln">:</span>
                    <span className="semi-bold id-refer text-end">
                      #{details?.case_id?.referenceId}
                    </span>
                  </div>
                  <div className="f-14 p-3 lawyer-case-details d-flex">
                    <span className="title">Title</span>
                    <span className="coln">:</span>
                    <span className="semi-bold id-refer text-end">
                      {details?.title}
                    </span>
                  </div>
                  <div className="f-14 p-3 lawyer-case-details d-flex">
                    <span className="title">Description</span>
                    <span className="coln">:</span>
                    <span className="semi-bold id-refer text-end">
                      {details?.description}
                    </span>
                  </div>
                  <div className="f-14 p-3 lawyer-case-details d-flex">
                    <span className="title">Date</span>
                    <span className="coln">:</span>
                    <span className="semi-bold id-refer text-end">
                      {moment(details?.date).format("DD-MMM-YYYY")}
                    </span>
                  </div>
                  <div className="f-14 p-3 lawyer-case-details d-flex">
                    <span className="title">Time</span>
                    <span className="coln">:</span>
                    <span className="semi-bold id-refer text-end">
                      {details?.time}
                    </span>
                  </div>
                  {/* <div className="f-14 p-3 border-btm-lgt d-flex">
                  <span className="title">Attendees</span>
                  <span className="coln">:</span>
                  <span className="semi-bold id-refer text-end">4</span>
                </div> */}
                  <div className="f-14 p-3 lawyer-case-details d-flex">
                    <span className="title">Address</span>
                    <span className="coln">:</span>
                    <span className="semi-bold id-refer text-end">
                      {details?.address || "NA"}
                    </span>
                  </div>
                  <div className="f-14 p-3 lawyer-case-details d-flex justify-content-between">
                    <span className="title">Uploaded Document</span>
                    <span className="coln">:</span>
                    <span
                      onClick={() => {
                        let BaseURL = `${process.env.NEXT_PUBLIC_PDF_URL}/uploads`;
                        let a = document.createElement("a");
                        a.href = `${BaseURL}${details?.document}`;
                        a.target = "__blank";
                        a.click();
                      }}
                      className="semi-bold id-refer text-end d-flex justify-content-end align-items-center"
                    >
                      <h5 className="f-16 mb-0">
                        {details?.document?.substr(10, 20)}
                      </h5>
                      <Image src={doc} className="doc-icn" alt="doc" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="white-card p-4 rounded hearing-calender mb-4">
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar
                  disableHighlightToday
                  disabled
                  value={dayjs(details?.reminderDate)}
                />
              </LocalizationProvider>
            </div>
            <div
              className="case-details-pre reminder-lawry rounded-lg doc-requests mb-4"
              style={{ background: "#FFF" }}
            >
              <div className="pre-card-details">
                <div className="pi-card-inner rounded">
                  <div className="f-14 p-3 border-btm-lgt d-flex">
                    <span className="title">Reminder Date</span>
                    <span className="coln">:</span>
                    <span className="semi-bold id-refer text-end">
                      {moment(details?.reminderDate).format("DD-MMM-YYYY")}
                    </span>
                  </div>
                  <div className="f-14 p-3 border-btm-lgt d-flex">
                    <span className="title">Title</span>
                    <span className="coln">:</span>
                    <span className="semi-bold id-refer text-end">
                      {details?.reminderTitle}
                    </span>
                  </div>
                  <div className="f-14 p-3 border-btm-lgt d-flex">
                    <span className="title">Description</span>
                    <span className="coln">:</span>
                    <span className="semi-bold id-refer text-end">
                      {details?.reminderDescription}
                    </span>
                  </div>
                  <div className="f-14 p-3 border-btm-lgt d-flex">
                    <span className="title">Time</span>
                    <span className="coln">:</span>
                    <span className="semi-bold id-refer text-end">
                      {details?.reminderTime}
                    </span>
                  </div>

                  {/* <div className="f-14 p-3 border-btm-lgt d-flex">
                  <span className="title">Attendees</span>
                  <span className="coln">:</span>
                  <span className="semi-bold id-refer text-end">4</span>
                </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Hearingdetails;
