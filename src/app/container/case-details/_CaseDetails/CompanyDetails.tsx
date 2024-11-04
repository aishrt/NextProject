"use client";

import React from "react";
import "../../../client/client.css";
import { Cases } from "@/types/Cases";
import { upperFirst } from "lodash";

export const CompanyDetails = ({ data }: { data: Cases | undefined }) => {
  return (
    <div
      className="case-details-pre rounded-lg h-100"
      style={{ background: "#F1FAFF" }}
    >
      <div
        className="headr-pre p-3"
        style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
      >
        <h3 className="f-18 semi-bold mb-0">
          {data?.isIndividual == "individual"
            ? "Individual Details"
            : "Company Details"}{" "}
        </h3>
      </div>
      {data?.isIndividual == "company" && (
        <div className="pre-card-details">
          <div className="pi-card-inner rounded">
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Company Name</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                {data?.companyData?.companyName
                  ? data?.companyData?.companyName
                  : "NA"}
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Address</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                {data?.companyData?.address ? data?.companyData?.address : "NA"}
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Registry Number</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                {data?.companyData?.reg_no}
              </span>
            </div>
          </div>
        </div>
      )}

      {data?.isIndividual == "individual" && (
        <div className="pre-card-details">
          <div className="pi-card-inner rounded">
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Last Name</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                {upperFirst(data?.individualData?.lastName)}
              </span>
            </div>

            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">First Name</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                {upperFirst(data?.individualData?.firstName)}
              </span>
            </div>

            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Email</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                {data?.individualData?.email}
              </span>
            </div>

            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Phone Number</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                {data?.individualData?.phone}
              </span>
            </div>

            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Address</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                {data?.individualData?.address}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
