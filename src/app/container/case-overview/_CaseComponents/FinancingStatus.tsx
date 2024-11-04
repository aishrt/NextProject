"use client";

import React from "react";
import "../../../client/client.css";
import { Cases } from "@/types/Cases";
import { Button } from "@/components/Form/Button";
import { axios } from "@/utils/axios";

export const FinancingStatus = ({
  data,
  user,
  report,
}: {
  data: Cases | undefined | any;
  user: any;
  report: any;
}) => {
  return (
    <div
      className="case-details-pre rounded-lg case-info financing-status"
      style={{ background: "#fff" }}
    >
      <div className="headr-pre p-4 mb-2">
        <h3 className="f-18 semi-bold mb-0">Evaluation and Financing Status</h3>
      </div>
      <div className="financing-evalt row p-4 w-100 m-auto">
        <div className="row">
          <div className="col-12 col-md-4 col-lg-3 col-xl-4 col-xxl-3 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Case Submitted</p>
              <div className="fin-status-complete">Completed</div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-3 col-xl-4 col-xxl-3 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Evaluation</p>
              <div
                className={`fin-status-complete ${
                  data?.status == "reject" ? "claim" : "liti"
                } `}
              >
                {data?.status == "accept" && "Completed"}
                {data?.status == "reject" ? "Rejected" : ""}
                {data?.evalReportStatus == "pending" &&
                data.status == "pending" &&
                data.isEvalReport
                  ? "Submitted"
                  : ""}
                {data?.evalReportStatus == "accept" ? "Completed" : ""}
                {!data?.isEvalReport &&
                !data?.isAccepted &&
                data?.evalReportStatus == "pending"
                  ? "Pending"
                  : ""}{" "}
              </div>
            </div>
          </div>
          {/* <div className="col-12 col-md-3 col-lg-2 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Financial</p>
              <div className="fin-status-complete">
                {data?.isFinancialReport ? "Completed" : "Pending"}
              </div>
            </div>
          </div> */}
          <div className="col-12 col-md-4 col-lg-3 col-xl-4 col-xxl-3 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Funding Status</p>
              <div
                className={`fin-status-complete ${
                  data?.status == "reject" ? "claim" : "liti"
                }`}
              >
                {data?.evalReportStatus == "accept" && "Completed"}
                {data?.status == "reject" ? "Rejected" : ""}
                {data?.isFinancialReport &&
                !data?.isAccepted &&
                data?.status == "pending"
                  ? "Submitted"
                  : ""}
                {!data?.isFinancialReport &&
                !data?.isAccepted &&
                data?.evalReportStatus == "pending"
                  ? "Pending"
                  : ""}{" "}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-3 col-xl-4 col-xxl-3 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Accepted Offer</p>
              <div
                className={`fin-status-complete  ${
                  data?.status == "reject" ? "claim" : "liti"
                }`}
              >
                {data?.status == "active" && "Completed"}
                {data?.status == "reject" && "Rejected"}
                {data?.isAccepted && "Accepted"}
                {data?.status != "reject" && data?.evalReportStatus == "pending"
                  ? "Pending"
                  : ""}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-3 col-xl-4 col-xxl-3 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Lawyer Assignment</p>
              <div
                className={`fin-status-complete ${
                  data?.evalReportStatus !== "reject" ? "complete" : "claim"
                }`}
              >
                {data?.isLaywerAssigned && "Completed"}
                {!data?.isLaywerAssigned && data?.status !== "reject"
                  ? "Pending"
                  : ""}
                {data?.status == "reject" && "Rejected"}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-3 col-xl-4 col-xxl-3 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">
                {data?.caseType == "litigation"
                  ? "Litigation"
                  : "Pre-Litigation"}
              </p>
              <div
                className={`fin-status-complete ${
                  data?.status == "reject" ? "claim" : "liti"
                } `}
              >
                {data?.caseType == "litigation" && data?.status != "reject"
                  ? " Completed"
                  : ""}
                {data?.caseType == "preLitigation" && data?.status != "reject"
                  ? "Started"
                  : ""}

                {data?.status == "reject" && "Closed"}
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-3 col-xl-4 col-xxl-3 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Claim Closed</p>
              <div
                className={`fin-status-complete ${
                  data?.status == "reject" ? "claim" : "complete"
                }`}
              >
                {data?.status == "reject" ? "Closed" : "Not applicable"}
              </div>
            </div>
          </div>
          {/* {user?.user?.role == "client" &&
            data?.isEvalReport &&
            data?.isFinancialReport &&
            !data?.isAccepted && (
              <div className="col-12 col-md-3 col-lg-2 mb-4">
                <p className="f-15 semi-bold">Accept Offer</p>
                <div className=" claim">
                  {data?.isAccepted ? (
                    "Accepted"
                  ) : (
                    <Button onClick={AcceptOffer}>Accept</Button>
                  )}
                </div>
              </div>
            )}
          {user?.user?.role == "client" &&
            data?.isEvalReport &&
            data?.isFinancialReport &&
            !data?.isAccepted && (
              <div className="col-12 col-md-3 col-lg-2 mb-4">
                <p className="f-15 semi-bold">Reject Offer</p>
                <div className=" claim">
                  {data?.isAccepted ? (
                    "Accepted"
                  ) : (
                    <Button
                      variant="danger"
                      color="red"
                      onClick={RejectOffer}
                      className=""
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            )} */}
        </div>
      </div>
    </div>
  );
};
