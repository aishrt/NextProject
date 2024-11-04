"use client";

import React from "react";
import "../../../client/client.css";

export const DocTracking = () => {
  return (
    <div
      className="case-details-pre rounded-lg case-info financing-status"
      style={{ background: "#fff" }}
    >
      <div
        className="headr-pre p-3 mb-2"
        style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
      >
        <h3 className="f-18 semi-bold mb-0">Documents Tracking</h3>
      </div>
     <div className="financing-evalt row p-4 w-100 m-auto">
            <div className="row">
                <div className="col-12 col-md-3 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Editable doc</p>
                        <div className="fin-status-count">15</div>
                    </div>
                </div>
                <div className="col-12 col-md-3 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Non-Editable  doc</p>
                        <div className="fin-status-count">15</div>
                    </div>
                </div>
                <div className="col-12 col-md-3 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Lawyer updated doc</p>
                        <div className="fin-status-count">15</div>
                    </div>
                </div>
                <div className="col-12 col-md-3 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Personal Doc</p>
                        <div className="fin-status-count">15</div>
                    </div>
                </div>
            </div>
     </div>
    </div>
  );
};
