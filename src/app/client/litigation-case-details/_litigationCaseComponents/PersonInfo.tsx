"use client";

import React from "react";
import "../../../client/client.css";


export const PersonInfo = () => {


  return (
    <div className="case-details-pre rounded-lg" style={{background: "#F1FAFF"}}>
        <div className="headr-pre p-3" style={{background: "#A6D5CC", borderRadius: "10px 10px 0 0 "}}>
            <h3 className="f-18 semi-bold mb-0">Information of person on whose behalf you
            are acting</h3>
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
              <span className="title">Email Id</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
              Jonathan@gmail.com
              </span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Phone Number</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">35465334534</span>
            </div>
            <div className="f-14 p-3 border-btm-lgt d-flex">
              <span className="title">Address</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">Apt. 633 2828 Block Forest, West Jackhaven, RI 67654-4502
              </span>
            </div>
          
          </div>
        </div>
    </div>
  );
};
