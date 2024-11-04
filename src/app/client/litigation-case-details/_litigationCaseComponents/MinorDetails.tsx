"use client";

import React from "react";
import "../../../client/client.css";


export const MinorDetails = () => {


  return (
    <div className="case-details-pre rounded-lg h-100" style={{background: "#F1FAFF"}}>
        <div className="headr-pre p-3" style={{background: "#A6D5CC", borderRadius: "10px 10px 0 0 "}}>
            <h3 className="f-18 semi-bold mb-0">Minor Details</h3>
        </div>
        <div className="pre-card-details">
        <div className="pi-card-inner rounded">
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Last Name</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">Esthera</span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">First Name</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                Jonathan
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Date of Birth</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">24th june 2024</span>
            </div>
          
          </div>
        </div>
    </div>
  );
};
