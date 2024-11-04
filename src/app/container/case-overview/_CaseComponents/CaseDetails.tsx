"use client";

import React from "react";
import "../../../client/client.css";
import { Cases } from "@/types/Cases";
import { upperFirst } from "lodash";

export const CaseDetails = ({ data }: { data: Cases | undefined }) => {
  return (
    <div className="case-details-pre rounded-lg" style={{ background: "#FFF" }}>
      <div className="headr-pre px-3">
        <h3 className="f-18 semi-bold">Case Overview</h3>
      </div>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Case Status</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {data?.status == "notResolved"
                ? "Not Resolved"
                : upperFirst(data?.status)}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Case Type</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {data?.category}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Role</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {data?.role == "directParty"
                ? "Directly Affected Party"
                : data?.role == "leadRepresentative"
                ? "Lead Representative"
                : data?.role == "authRepresentative"
                ? "Authorized Representative"
                : "Trusted Person"}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Person Name</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">Jackson Esthera</span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Opposing Party</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {data?.opposingCompany
                ? data?.opposingCompany?.companyName
                : "Individual"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
