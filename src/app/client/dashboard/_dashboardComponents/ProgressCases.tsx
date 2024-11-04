"use client";

import React, { useEffect, useState } from "react";
import "../../../client/client.css";
import { styled } from "@mui/material/styles";
import { LinearProgress, linearProgressClasses } from "@mui/material";
import { DashboardData } from "@/types/Dashboard";

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 18,
  borderRadius: 2,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#51CBFF" : "#fff",
  },
}));

export const ProgressCases = ({
  data,
}: {
  data: DashboardData | undefined;
}) => {
  const getProgress = (val: any) => {
    const conditions = [
      val.progress,
      val.isEvalReport,
      val.isFinancialReport,
      val.evalReportStatus === "accept",
      val.isLaywerAssigned,
      val.status == "resolved",
      val.category ? true:  false,
    ];
    const trueCount = conditions.filter(Boolean).length;
    console.log(val.referenceId, val.progress, conditions, trueCount);

    const percentage = (trueCount / conditions.length) * 100;
    console.log(`True Conditions: ${trueCount}, Percentage: ${percentage}%`);
    return Math.round(percentage);
  };

  useEffect(() => {
    data?.caseProgress.slice(0, 4).forEach((val) => getProgress(val));
  }, [data]);

  return (
    <div className="status-type">
      <div className="white-card rounded-lg">
        <div className="status-title border-btm p-3">
          <h3 className="f-18 semi-bold mb-0">Cases Progress</h3>
        </div>
        <div className="cases-programs p-3">
          <div className="cases-prgm-box d-flex">
            <p className="gray f-14 mb-0 case-lft">Case</p>
            <p className="gray f-14 mb-0 case-rght">Progress</p>
          </div>
          {data?.caseProgress?.slice(0, 4)?.map((val: any, index: number) => (
            <div key={index} className="cases-prgm-box d-flex lght-bg mb-2">
              <p className="gray f-14 mb-0 case-lft">#{val?.referenceId ?? "NA"}</p>
              <div className="case-rght with-progress d-flex align-items-center">
                <p className="gray f-14 mb-0">
                  {getProgress(val)}%
                  {/* <span className="green ml-2">+12%</span> */}
                </p>
                <BorderLinearProgress
                  variant="determinate"
                  className="border-progress"
                  value={getProgress(val)}
                />
              </div>
            </div>
          ))}
          {/* <div className="cases-prgm-box d-flex lght-bg mb-2">
            <p className="gray f-14 mb-0 case-lft">Lorem Ipsum</p>
            <div className="case-rght with-progress d-flex align-items-center">
              <p className="gray f-14 mb-0">
                89% <span className="green ml-2">+12%</span>
              </p>
              <BorderLinearProgress
                variant="determinate"
                className="border-progress"
                value={50}
              />
            </div>
          </div> */}
          {/* <div className="cases-prgm-box d-flex lght-bg mb-2">
            <p className="gray f-14 mb-0 case-lft">Lorem Ipsum</p>
            <div className="case-rght with-progress d-flex align-items-center">
              <p className="gray f-14 mb-0">
                89% <span className="green ml-2">+12%</span>
              </p>
              <BorderLinearProgress
                variant="determinate"
                className="border-progress"
                value={50}
              />
            </div>
          </div> */}
          {/* <div className="cases-prgm-box d-flex lght-bg mb-2">
            <p className="gray f-14 mb-0 case-lft">Lorem Ipsum</p>
            <div className="case-rght with-progress d-flex align-items-center">
              <p className="gray f-14 mb-0">
                89% <span className="green ml-2">+12%</span>
              </p>
              <BorderLinearProgress
                variant="determinate"
                className="border-progress"
                value={50}
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
