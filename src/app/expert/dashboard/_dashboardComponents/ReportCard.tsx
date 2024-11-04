"use client";

import React, { useState } from "react";
import Image from "next/image";
import "../../../expert/expert.css";
import { Button } from "@/components/Form/Button";
import { EvalReport } from "@/types/Dashboard";
import moment from "moment";
import { upperFirst } from "lodash";
import { useRouter } from "next/navigation";

export const ReportCard = ({ data }: { data: EvalReport[] | undefined }) => {
  const router = useRouter();

  return (
    <div className=" reports-crd import-dates bg-white px-4 rounded-lg mb-3">
      {data?.slice(0, 3)?.map((val: any, index: number) => (
        <div className="p-4 border  rounded-lg report-bg-box" key={index}>
          <div className="d-flex active-claim-list report-bg-card">
            <span className="claim-status">Case ID</span>
            <span className="claim-coln">:</span>
            <span className="claim-status-cnt">
              #{val?.case_id?.referenceId}
            </span>
          </div>
          <div className="d-flex active-claim-list report-bg-card">
            <span className="claim-status">Created On</span>
            <span className="claim-coln">:</span>
            <span className="claim-status-cnt">
              {moment(val?.createdAt).format("DD MMM YYYY (h:mm a)")}
            </span>
          </div>
          <div className="d-flex active-claim-list  report-bg-card">
            <span className="claim-status">Category</span>
            <span className="claim-coln">:</span>
            <span className="claim-status-cnt">
              {val?.case_id?.category ?? "NA"}
            </span>
          </div>
          <div className="d-flex active-claim-list  report-bg-card">
            <span className="claim-status">Report Submitted on</span>
            <span className="claim-coln">:</span>
            <span className="claim-status-cnt">
              {moment(val?.updatedAt).format("DD MMM YYYY (h:mm a)")}
            </span>
          </div>
          <div
            className={`d-flex active-claim-list ${
              val?.status == "accept"
                ? "accept-status"
                : `status-${val?.status} report-bg-card`
            }`}
          >
            <span className="claim-status">Status</span>
            <span className="claim-coln">:</span>
            <span className="claim-status-cnt">
              {upperFirst(
                val?.status == "pending" ? val?.status : val?.status + "ed"
              )}
            </span>
          </div>

          <div className="view-reprt text-end mt-3">
            <Button
              className="expert-btn rounded-full"
              variant="primary"
              size="sm"
              onClick={() =>
                router.push(`/expert/eval-report?id=${val?.case_id?._id}`)
              }
            >
              View Report
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
