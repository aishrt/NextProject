"use client";

import React from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
// import { Metadata } from "next";
import { Link } from "@mui/material";
import Image from "next/image";
import "../../client/client.css";
import download from "@/assets/cloud.png";
import fold from "@/assets/fold.png";
import { DamagesChart } from "./_ClaimCharts/DamagesChart";
import { RiskChart } from "./_ClaimCharts/RiskChart";

export default function ClaimEvaluationReport() {

  return (
    <ContentWrapper>
      <div className="top-title mt-5 mb-4">
        <div className="left">
          <h2 className="f-30 bold">Claim Evaluation Report</h2>
        </div>
      </div>
      <h3 className="f-16 bold pb-2">KEY INSIGHTS</h3>
      <div className="row mb-5">
        <div className="col-12 col-md-4">
          <div className="key-insight row">
            <div className="col-12 col-md-4">
              <div className="key-value f-30">68%</div>
            </div>
            <div className="col-12 col-md-8">
              <div className="key-content">
                <p className="f-13 mb-1">Case Law</p>
                <h5 className="f-16 bold">Favourable decisions</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="key-insight row">
            <div className="col-12 col-md-4">
              <div className="key-value f-30">31%</div>
            </div>
            <div className="col-12 col-md-8">
              <div className="key-content">
                <p className="f-13 mb-1">Most awarded compensation</p>
                <h5 className="f-16 bold">Compensation of €150,000</h5>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="key-insight row">
            <div className="col-12 col-md-4">
              <div className="key-value f-30">80%</div>
            </div>
            <div className="col-12 col-md-8">
              <div className="key-content">
                <p className="f-13 mb-1">Opposing Party</p>
                <h5 className="f-16 bold">Risk Provision of €272,000</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <h3 className="f-16 bold pb-2">CHARTS OVERVIEW</h3>
      <div className="bggray charts-overview p-4 rounded-lg">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="damage-chart p-3">
              <h4 className="f-16 pb-4">Possible distribution of damages</h4>
              <DamagesChart />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="damage-chart p-3">
              <h4 className="f-16 pb-4">Possible risk provision</h4>
              <RiskChart />
            </div>
          </div>
        </div>
      </div>
      <h3 className="f-16 bold pb-2 mt-5">DOCUMENTS READY</h3>
      <div className="ready-docs d-flex gap-4 align-items-center mb-4">
        <div className="evalut-report yellow-bg rounded-lg">
          <p className="f-14 mb-2">Download Full Report</p>
          <div className="full-report d-flex justify-content-between align-items-end">
            <h3 className="f-30 mb-0">Evaluation Report</h3>
            <Link href="#">
              <Image src={download} className="eval-download" alt="download" />{" "}
            </Link>
          </div>
        </div>
        <div className="evalut-report green-nbg rounded-lg">
          <p className="f-14 mb-2">Data Analyse Summary</p>
          <div className="full-report d-flex justify-content-between align-items-end">
            <h3 className="f-30 mb-0">Conclusion Overview</h3>
            <Link href="#">
              <Image src={fold} className="eval-download" alt="download" />{" "}
            </Link>
          </div>
        </div>
        <div className="evalut-report purple-btn btn-claim rounded-lg">
          <Link href="#">
            <h6 className="f-20 bold mb-0 text-black">Get your claim funded!</h6>
          </Link>
        </div>
      </div>
    </ContentWrapper>
  );
}
