"use client";

import React, { useState } from "react";
import Image from "next/image";
import "../../../expert/expert.css";
import { Button } from "@/components/Form/Button";
import { Documents } from "@/types/Dashboard";
import { upperFirst } from "lodash";
import moment from "moment";
import { useRouter } from "next/navigation";

export const AskedDocs = ({ data }: { data: Documents[] | undefined }) => {
  const router = useRouter();
  const options = [
    { label: "Personal Document", value: "personal" },
    { label: "Proof of Identity", value: "identity" },
    { label: "Communication to Read", value: "communication" },
    { label: "Proof of Damage", value: "damage" },
  ];

  return (
    <>
      {data && data.length === 0 && (
        <p className="semi-bold text-center my-5">No data found!</p>
      )}

      {data?.slice(0, 3)?.map((val: any, index: number) => (
        <div
          key={index}
          className="asked-docs reports-crd import-dates px-4 rounded-lg mb-3"
        >
          <div
            className="p-4 border  rounded-lg report-bg-box"
            style={{ background: "#E5ECF6" }}
          >
            <div className="d-flex active-claim-list report-bg-card">
              <span className="claim-status">Case ID</span>
              <span className="claim-coln">:</span>
              <span className="claim-status-cnt">
                #{val?.case_id?.referenceId}
              </span>
            </div>

            <div className="d-flex active-claim-list  report-bg-card">
              <span className="claim-status">Category</span>
              <span className="claim-coln">:</span>
              <span className="claim-status-cnt">{val?.case_id?.category}</span>
            </div>
            <div className="d-flex active-claim-list report-bg-card">
              <span className="claim-status">Document Name</span>
              <span className="claim-coln">:</span>
              <span className="claim-status-cnt">{val?.title}</span>
            </div>
            <div className="d-flex active-claim-list report-bg-card">
              <span className="claim-status">Document Category</span>
              <span className="claim-coln">:</span>
              <span className="claim-status-cnt">
                {options.map((i) => {
                  if (i.value == val?.category) {
                    return i.label;
                  }
                })}
              </span>
            </div>
            <div className="d-flex active-claim-list  report-bg-card">
              <span className="claim-status">Last Date</span>
              <span className="claim-coln">:</span>
              <span className="claim-status-cnt">
                {moment(val?.createdAt).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="d-flex active-claim-list  report-bg-card">
              <span className="claim-status">Asked From</span>
              <span className="claim-coln">:</span>
              <span className="claim-status-cnt">
                {upperFirst(val?.uploadedBy?.role)}
              </span>
            </div>
            <div className="view-reprt mt-3">
              <Button
                className="expert-btn rounded-full"
                variant="primary"
                size="sm"
                onClick={() =>
                  router.push(`/expert/case-documents/${val?.case_id?._id}`)
                }
              >
                Update Document
              </Button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
