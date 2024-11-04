"use client";

import React from "react";
import "../../../client/client.css";

export const CaseInfo = () => {
  return (
    <div
      className="case-details-pre rounded-lg case-info"
      style={{ background: "#fff" }}
    >
      <div
        className="headr-pre p-3"
        style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
      >
        <h3 className="f-18 semi-bold mb-0">Case Information</h3>
      </div>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Case Title</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">Title</span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Case Category</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">Civil</span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Urgency Level</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">Urgent</span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Preferred Language</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">English</span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Case Type</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">Civil</span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Opposing Party</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">party</span>
          </div>
        </div>
      </div>
      <h4 className="f-18 semi-bold p-3" >Important Dates</h4>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Date of Incident</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">20/01/2024</span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Expected Outcome</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">20/01/2024</span>
          </div>

          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Deadlines for Responses</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">20/01/2024</span>
          </div>
        </div>
      </div>
    </div>
  );
};
