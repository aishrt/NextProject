"use client";

import React, { useState } from "react";
import "../../admin/admin.css";
import { styled } from "@mui/material/styles";
import { LinearProgress, linearProgressClasses } from "@mui/material";

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

export const ProgressCases = () => {
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
          <div className="cases-prgm-box d-flex lght-bg mb-2">
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
          </div>
          <div className="cases-prgm-box d-flex lght-bg mb-2">
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
          </div>
          <div className="cases-prgm-box d-flex lght-bg mb-2">
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
          </div>
          <div className="cases-prgm-box d-flex lght-bg mb-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};
