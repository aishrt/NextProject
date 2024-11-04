"use client";

import React from "react";
import "../../../client/client.css";
import { Link } from "@mui/material";


export const DocRequestTrack = () => {


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
              <span className="title">From Email ID</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
              dummy@gmail.com
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Private Note</span>
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
              <span className="title">Agreement Untill</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">12-01-2311
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Days to complete</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">12
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Document type</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">Completed
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Description</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.
              </span>
            </div>
          
          </div>
          <div className="view-gray-btns py-5 px-3">
            <Link href="/" className="view-dc-gray bgdark text-white rounded-lg px-4 py-3">View Document</Link>
          </div>
        </div>
    </div>
  );
};
