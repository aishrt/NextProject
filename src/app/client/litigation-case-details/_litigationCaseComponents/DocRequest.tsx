"use client";

import React from "react";
import "../../../client/client.css";
import { Link } from "@mui/material";


export const DocRequest = () => {


  return (
    <div className="case-details-pre rounded-lg doc-requests mb-4" style={{background: "#FFF"}}>
        <div className="pre-card-details">
        <div className="pi-card-inner rounded">
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Document Name</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">Document Name</span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Category</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                Civil
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Private Message</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
              <Link href="/" className="dark">View</Link>
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Purpose</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">Purpose</span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Shared on</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">12-01-2311
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Status</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">Completed
              </span>
            </div>
          
          </div>
          <div className="view-gray-btns d-flex gap-2 justify-content-center py-4 align-items-center">
            <Link href="/" className="view-dc-gray bggray rounded-lg px-4 py-3">View Document</Link>
            <Link href="/" className="view-dc-gray bggray rounded-lg px-4 py-3">Download</Link>
            <Link href="/" className="view-dc-gray bggray rounded-lg px-4 py-3">View More</Link>
          </div>
        </div>
    </div>
  );
};
