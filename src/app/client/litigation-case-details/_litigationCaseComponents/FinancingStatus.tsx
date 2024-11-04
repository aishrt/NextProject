"use client";

import React from "react";
import "../../../client/client.css";

export const FinancingStatus = () => {
  return (
    <div
      className="case-details-pre rounded-lg case-info financing-status"
      style={{ background: "#fff" }}
    >
      <div
        className="headr-pre p-3 mb-2"
        style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
      >
        <h3 className="f-18 semi-bold mb-0">Evaluation and Financing Status</h3>
      </div>
     <div className="financing-evalt row p-4 w-100 m-auto">
            <div className="row">
                <div className="col-12 col-md-6 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Case Submitted</p>
                        <div className="fin-status-complete">Completed</div>
                    </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Evaluation</p>
                        <div className="fin-status-complete">Completed</div>
                    </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Funding Status</p>
                        <div className="fin-status-complete">In Progress</div>
                    </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Accepted Offer</p>
                        <div className="fin-status-complete accpet">Accepted</div>
                    </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Lawyer Assignment</p>
                        <div className="fin-status-complete">Completed</div>
                    </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Pre-Litigation</p>
                        <div className="fin-status-complete liti">Completed</div>
                    </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                    <div className="bggray  rounded-lg p-3 text-center finance-colm">
                        <p className="f-15 semi-bold">Claim Closed</p>
                        <div className="fin-status-complete claim">Not Started</div>
                    </div>
                </div>
            </div>
     </div>
    </div>
  );
};
