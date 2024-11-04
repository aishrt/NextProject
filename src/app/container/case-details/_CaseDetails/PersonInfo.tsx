"use client";

import React from "react";
import "../../../client/client.css";
import { Cases } from "@/types/Cases";
import { upperFirst } from "lodash";

export const PersonInfo = ({ data }: { data: Cases | undefined }) => {
  return (
    <div
      className="case-details-pre rounded-lg"
      style={{ background: "#F1FAFF" }}
    >
      <div
        className="headr-pre p-3"
        style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
      >
        <h3 className="f-18 semi-bold mb-0">
          Information of person on whose behalf you are acting
        </h3>
      </div>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Last Name</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {upperFirst(data?.groupInfo?.last_name)}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">First Name</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {upperFirst(data?.groupInfo?.first_name)}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Email Id</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {upperFirst(data?.groupInfo?.representative_email)}{" "}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Phone Number</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {data?.groupInfo?.representative_phone_no}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Address</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {data?.groupInfo?.representativeLocation}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
