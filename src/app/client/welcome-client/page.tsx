"use client";

import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
// import { Metadata } from "next";
import { Link } from "@mui/material";
import casesIcn from "@/assets/cases.png";
import Image from "next/image";
import radio from "@/assets/radio.png";
import "../../client/client.css";
import marks from "@/assets/marks.png";
import clock from "@/assets/clock.png";
import arrow from "@/assets/arrow.png";
import notify from "@/assets/notify.png";
import graph from "@/assets/graph.png";
import faq from "@/assets/faq.png";
import { useRouter, useSearchParams } from "next/navigation";
import { Cases } from "@/types/Cases";
import client from "@/assets/profile.png";
import { Button } from "@/components/Form/Button";

export default function CaseDetail() {
  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");
  const [loadingData, setDataLoading] = useState(false);

  const [caseData, setCase] = useState<Cases>();
  const [evictionData, setEvictionData] = useState<any>();

  return (
    <ContentWrapper>
      <div className="top-title mt-5 mb-4 d-flex justify-content-between align-items-center">
        <div className="left">
          <h2 className="f-22 bold">Welcome John!</h2>
          <p className="f-14">Welcome to your legal dashboard</p>
        </div>
        <div className="right">
          <Button variant="contained" className="purple-btn" size="md">
            New Case
          </Button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-4">
          <div className="case-cards mb-4 darkgray-card">
            <h3 className="f-15 bold">
              First Completed Case{" "}
              <Image src={marks} alt="marks" className="complete-check  ms-2" />
            </h3>
            <h2 className="f-26 semi-bold pb-2">Case #2343225</h2>
            <Button variant="contained" className="lightblue-btn">
              Access Case
            </Button>
          </div>
          <div className="case-cards darkgray-card mb-4">
            <h3 className="f-18 bold pb-2">Client Directory</h3>
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="client-cards bg-white text-center">
                  <Image
                    src={client}
                    alt="client-icon rounded-full"
                    className="client-cases-icon"
                  />
                  <h6 className="bold f-14 mb-0">Sarah</h6>
                  <p className=" f-13 mb-0">Director</p>
                </div>
              </div>
              <div className="col-12 col-md-6">
                <div className="client-cards bg-white text-center">
                  <Image
                    src={client}
                    alt="client-icon"
                    className="client-cases-icon"
                  />
                  <h6 className="bold f-14 mb-0">Sarah</h6>
                  <p className=" f-13 mb-0">Director</p>
                </div>
              </div>
            </div>
          </div>
          <div className="case-cards darkgray-card mb-4">
            <h3 className="f-18 bold">Communication Tools</h3>
            <div className="comm-btns">
              <Button variant="contained" className="green-btn mb-2 w-100">
                New Message
              </Button>
              <Button variant="contained" className="green-btn mb-2 w-100">
                Upload a File
              </Button>
              <Button variant="contained" className="green-btn w-100">
                Schedule Meeting
              </Button>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-8">
          <div className="overview-pro documents">
            <div className="next-steps bggray mb-4">
              <h4 className="f-18 bold p-3"> Case #34455 Progress Overview</h4>
              <div className="f-14 case-progress-view">
                <div className="evaluate-claim d-flex justify-content-between align-items-center">
                  <span>
                    <Image src={radio} className="radio-icon" alt="radio" />
                    Evaluate Claim Status
                  </span>
                  <span className="bold">Validated</span>
                </div>
                <div className="evaluate-claim d-flex justify-content-between align-items-center">
                  <span>
                    <Image src={radio} className="radio-icon" alt="radio" />
                    Assessment of claim potential
                  </span>
                  <span className="bold">In progress</span>
                </div>
                <div className="evaluate-claim d-flex justify-content-between align-items-center">
                  <span>
                    <Image src={radio} className="radio-icon" alt="radio" />
                    Streamline case details
                  </span>
                  <span className="bold">Pending</span>
                </div>
              </div>
            </div>
            <div className="active-case-steps next-steps bggray mb-4">
              <h4 className="f-18 bold p-3"> Active Case Details</h4>
              <div className="f-14 active-cases-deta">
                <div className="monitor-cases">
                  <span>
                    <Image src={clock} className="clock-icon" alt="clock" />
                  </span>
                  <Link href="#">
                    {" "}
                    <span className="bold effortless yellow-bg rounded text-black px-4 py-2">
                      Effortlessly Monitor and Manage Your Cases{" "}
                      <Image src={arrow} className="arrow-icon" alt="arrow" />
                    </span>
                  </Link>
                </div>
                <div className="monitor-cases">
                  <span>
                    <Image src={notify} className="clock-icon" alt="clock" />
                  </span>
                  <Link href="#">
                    {" "}
                    <span className="bold effortless yellow-bg rounded text-black px-4 py-2">
                      Stay updated on your cases progress{" "}
                      <Image src={arrow} className="arrow-icon" alt="arrow" />
                    </span>
                  </Link>
                </div>
                <div className="monitor-cases">
                  <span>
                    <Image src={graph} className="clock-icon" alt="clock" />
                  </span>
                  <Link href="#">
                    {" "}
                    <span className="bold effortless yellow-bg rounded text-black px-4 py-2">
                      Track, Analyze, and Report Litigation Risks{" "}
                      <Image src={arrow} className="arrow-icon" alt="arrow" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <div className="active-case-steps next-steps legal-resources bggray">
              <div className="legal-platforms d-flex gap-4">
                <div className="legal-guides  lightblue-btn  rounded">
                  <h6 className="f-16 bold">#Resources</h6>
                  <Link href="#">
                    <span className="bold effortless-guide f-14 d-flex justify-content-between align-items-center text-black">
                      Legal Guidance
                      <Image src={arrow} className="arrow-icon" alt="arrow" />
                    </span>
                  </Link>
                </div>
                <div className="legal-guides   lightblue-btn  rounded">
                  <h6 className="f-16 bold">#Platform</h6>
                  <Link href="#">
                    <span className="bold effortless-guide f-14 d-flex justify-content-between align-items-center text-black">
                      Legal status overview
                      <Image src={arrow} className="arrow-icon" alt="arrow" />
                    </span>
                  </Link>
                </div>
                <div className="legal-guides  lightblue-btn  rounded">
                  <h6 className="f-16 bold">#Support</h6>
                  <Link href="#">
                    <span className="bold effortless-guide f-14 d-flex justify-content-between align-items-center text-black">
                      Help center access
                      <Image src={arrow} className="arrow-icon" alt="arrow" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
