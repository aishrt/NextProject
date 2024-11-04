"use client";

import React from "react";
import "../../../client/client.css";
import { Cases } from "@/types/Cases";
import { upperFirst } from "lodash";

export const CaseDetails = ({ data }: { data: Cases | undefined }) => {
  return (
    <div
      className="case-details-pre rounded-lg"
      style={{ background: "#F1FAFF" }}
    >
      <div
        className="headr-pre p-3"
        style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
      >
        <h3 className="f-18 semi-bold mb-0">Case Details</h3>
      </div>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Claim Type</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {upperFirst(data?.isIndividual)}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Representing Party Minor</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {" "}
              {data?.groupInfo?.isSpouse ? "Yes" : "No"}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">
              Are you principal representative by the other finacial parties
            </span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {data?.groupInfo?.isRepresentative ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
