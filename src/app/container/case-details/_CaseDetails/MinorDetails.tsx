"use client";

import React from "react";
import "../../../client/client.css";
import { Cases } from "@/types/Cases";
import moment from "moment";
import { upperFirst } from "lodash";

export const MinorDetails = ({ data }: { data: Cases | undefined }) => {
  return (
    <div
      className="case-details-pre rounded-lg h-100"
      style={{ background: "#F1FAFF" }}
    >
      <div
        className="headr-pre p-3"
        style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
      >
        <h3 className="f-18 semi-bold mb-0">Minor Details</h3>
      </div>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Last Name</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {upperFirst(data?.groupInfo.personData[0].surname)}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">First Name</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {upperFirst(data?.groupInfo.personData[0].name)}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Date of Birth</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {moment(data?.groupInfo.personData[0].dob).format("Do MMMM YYYY")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
