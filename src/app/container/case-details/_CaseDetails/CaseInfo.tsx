"use client";

import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import { Cases } from "@/types/Cases";

export const CaseInfo = ({data}:{data:Cases | undefined}) => {
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
            <span className="semi-bold id-refer text-end">{data?.category}</span>
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
            <span className="semi-bold id-refer text-end text-capitalize">{data?.caseType}</span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Opposing Party</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end text-capitalize">{data?.opposing}</span>
          </div>
        </div>
      </div>
      <h4 className="f-18 semi-bold p-3 pb-0" >Important Dates</h4>
      <p className="f-14 dark p-3">Court Hearing 1</p>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Title</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">loreum ipsum </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Date</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">20/01/2024</span>
          </div>

          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Time</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">08:30 am</span>
          </div>
          <div className="hearing-btn text-center py-4">
            <Button variant="contained" className="client-btn">View More</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
