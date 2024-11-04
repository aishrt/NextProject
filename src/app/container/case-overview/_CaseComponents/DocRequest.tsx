"use client";

import React from "react";
import "../../../client/client.css";
import { Link } from "@mui/material";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const DocRequest = ({ data }: any) => {
  const router = useRouter();
  const { data: session } = useSession();
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
  const HandleDOwnloadImage = async () => {
    if (!data?.document) {
      return false;
    }

    fetch(`${getBaseURL() + data?.document}`, {
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
            `${data?.title}${GetFormat(data?.document)}`
          );
          document.body.appendChild(link);
          link.click();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className="case-details-pre rounded-lg doc-requests mb-4"
      style={{ background: "#FFF" }}
    >
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Document Name</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">{data?.title}</span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Category</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {data?.category}
            </span>
          </div>
          {/* <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Private Message</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              <Link href="/" className="dark">
                View
              </Link>
            </span>
          </div> */}
         
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Shared on</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {moment(data?.updatedAt).format("DD-MMM-YYYY")}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Status</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">{data?.status}</span>
          </div>
        </div>
        <div className="view-gray-btns d-flex gap-2 justify-content-center py-4 align-items-center">
          <a
            href={
              data?.updates?.document
                ? `${getBaseURL() + data?.updates?.document}`
                : "#"
            }
            className="view-dc-gray bggray rounded-lg px-4 py-3"
          >
            {data?.updates?.document ? "View Document" : "Pending"}
          </a>
          <a
            onClick={HandleDOwnloadImage}
            className="view-dc-gray bggray rounded-lg px-4 py-3"
          >
            Download
          </a>
          <a
            href={`/${session?.user?.role}/case-documents/detail?id=${data?._id}`}
            className="view-dc-gray bggray rounded-lg px-4 py-3"
          >
            View More
          </a>
        </div>
      </div>
    </div>
  );
};
