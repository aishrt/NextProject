"use client";

import React from "react";
import "../../../client/client.css";
import { Cases } from "@/types/Cases";
import { upperFirst } from "lodash";

export const OpposingInfo = ({ data }: { data: Cases | undefined }) => {
  return (
    <div
      className="case-details-pre rounded-lg"
      style={{ background: "#FFF" }}
    >
      <div
        className="headr-pre p-3"
        style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
      >
        <h3 className="f-18 semi-bold mb-0">Opposing Party</h3>
      </div>
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Opposing Party</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {upperFirst(data?.opposing)}
            </span>
          </div>
          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Name</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {data?.opposing == "company" ? (
                <>{data?.opposingCompany?.companyName || "NA"}</>
              ) : (
                <>
                  {upperFirst(data?.opposingIndividual?.first_name)}{" "}
                  {upperFirst(data?.opposingIndividual?.last_name)}
                </>
              )}
            </span>
          </div>

          <div className="f-14 p-3 border-btm-lgt d-flex">
            <span className="title">Address</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer text-end">
              {data?.opposing == "company" ? (
                <>{data?.opposingCompany?.address || "NA"}</>
              ) : (
                <>{upperFirst(data?.opposingIndividual?.location)}</>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
