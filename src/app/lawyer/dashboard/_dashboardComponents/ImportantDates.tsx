"use client";

import React, { useState } from "react";
import "../../../admin/admin.css";
import { CourtHearing } from "@/types/Dashboard";
import moment from "moment";

export const ImportantDates = ({
  data,
}: {
  data: CourtHearing | undefined;
}) => {
  return (
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
            #{data?.case_id?.referenceId}
          </span>
        </div>
        <div className="d-flex active-claim-list">
          <span className="claim-status">Case Category</span>
          <span className="claim-coln">:</span>
          <span className="claim-status-cnt">
            {data?.case_id?.category ?? "NA"}
          </span>
        </div>
        <div className="d-flex active-claim-list">
          <span className="claim-status">Next Hearing</span>
          <span className="claim-coln">:</span>
          <span className="claim-status-cnt">
            {moment(data?.date).format("DD-MMM-YYYY")}
          </span>
        </div>
        <div className="d-flex active-claim-list">
          <span className="claim-status">Description</span>
          <span className="claim-coln">:</span>
          <span className="claim-status-cnt">{data?.description} </span>
        </div>
        <div className="d-flex active-claim-list">
          <span className="claim-status">Location</span>
          <span className="claim-coln">:</span>
          <span className="claim-status-cnt">{data?.address}</span>
        </div>
      </div>
    </div>
  );
};
