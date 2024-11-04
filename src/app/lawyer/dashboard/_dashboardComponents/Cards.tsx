"use client";
import React from "react";
import "../../../expert/expert.css";
import Image from "next/image";
import send from "@/assets/assign.png";
import line from "@/assets/line.png";
import complete from "@/assets/complete.png";
import pending from "@/assets/pending.png";
import loan from "@/assets/loan.png";
import litigate from "@/assets/litigate.png";
import { DashboardData } from "@/types/Dashboard";

export default function Cards({ data }: { data: DashboardData | undefined }) {
  return (
    <>
      <div className="row">
        <div className="col-12 col-md-12">
          <div className="row dashboard-users">
            <div className="col-12 col-md-4 col-lg-3 mb-4">
              <div className=" dash-total-users white-card rounded-lg">
                <div className="dash-line relative pb-1">
                  <div className="row">
                    <div className="col-12 col-md-7 pending-case">
                      <p className="f-13">Active Cases</p>
                      <h5 className="bold f-24 mb-0">{data?.activeCases}</h5>
                    </div>
                    <div className="col-12 col-md-5 user-total-right text-end">
                      <Image alt="loan" className="total-lefticon" src={loan} />
                    </div>
                  </div>
                </div>
                {/* <h5 className="f-13 mb-0">
                <span className="green f-13 semi-bold me-2">
                  <Image alt="line" className="line-icon" src={line} /> 8.5%
                </span>
                up from yesterday
              </h5> */}
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3 mb-4">
              <div className=" dash-total-users white-card rounded-lg">
                <div className="dash-line relative pb-1">
                  <div className="row">
                    <div className="col-12 col-md-7 pending-case">
                      <p className="f-13">Prelitigation</p>
                      <h5 className="bold f-24 mb-0">{data?.preLitigation}</h5>
                    </div>
                    <div className="col-12 col-md-5 user-total-right text-end">
                      <Image
                        alt="loan"
                        className="total-lefticon"
                        src={complete}
                      />
                    </div>
                  </div>
                </div>
                {/* <h5 className="f-13 mb-0">
                <span className="green f-13 semi-bold me-2">
                  <Image alt="line" className="line-icon" src={line} /> 8.5%
                </span>
                up from yesterday
              </h5> */}
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3 mb-4">
              <div className=" dash-total-users white-card rounded-lg">
                <div className="dash-line relative pb-1">
                  <div className="row">
                    <div className="col-12 col-md-7 pending-case">
                      <p className="f-13">Litigation</p>
                      <h5 className="bold f-24 mb-0">{data?.litigation}</h5>
                    </div>
                    <div className="col-12 col-md-5 user-total-right text-end">
                      <Image
                        alt="loan"
                        className="total-lefticon"
                        src={pending}
                      />
                    </div>
                  </div>
                </div>
                {/* <h5 className="f-13 mb-0">
                <span className="green f-13 semi-bold me-2">
                  <Image alt="line" className="line-icon" src={line} /> 8.5%
                </span>
                up from yesterday
              </h5> */}
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3 mb-4">
              <div className=" dash-total-users white-card rounded-lg">
                <div className="dash-line relative pb-1">
                  <div className="row">
                    <div className="col-12 col-md-7 pending-case">
                      <p className="f-13">Resolved Cases</p>
                      <h5 className="bold f-24 mb-0">{data?.resolved}</h5>
                    </div>
                    <div className="col-12 col-md-5 user-total-right text-end">
                      <Image
                        alt="loan"
                        className="total-lefticon"
                        src={litigate}
                      />
                    </div>
                  </div>
                </div>
                {/* <h5 className="f-13 mb-0">
                <span className="green f-13 semi-bold me-2">
                  <Image alt="line" className="line-icon" src={line} /> 8.5%
                </span>
                up from yesterday
              </h5> */}
              </div>
            </div>
            <div className="col-12 col-md-4 col-lg-3 mb-4">
              <div className=" dash-total-users white-card rounded-lg">
                <div className="dash-line relative pb-1">
                  <div className="row">
                    <div className="col-12 col-md-7 pending-case">
                      <p className="f-13">Closed Cases</p>
                      <h5 className="bold f-24 mb-0">{data?.notResolved}</h5>
                    </div>
                    <div className="col-12 col-md-5 user-total-right text-end">
                      <Image
                        alt="loan"
                        className="total-lefticon"
                        src={complete}
                      />
                    </div>
                  </div>
                </div>
                {/* <h5 className="f-13 mb-0">
                <span className="green f-13 semi-bold me-2">
                  <Image alt="line" className="line-icon" src={line} /> 8.5%
                </span>
                up from yesterday
              </h5> */}
              </div>
            </div>
            {/* <div className="col-12 col-md-4 col-lg-3 mb-4">
            <div className=" dash-total-users white-card rounded-lg">
              <div className="dash-line relative pb-1">
                <div className="row">
                  <div className="col-12 col-md-7 pending-case">
                    <p className="f-13">Mandates Cases</p>
                    <h5 className="bold f-24 mb-0">10</h5>
                  </div>
                  <div className="col-12 col-md-5 user-total-right text-end">
                    <Image alt="loan" className="total-lefticon" src={loan} />
                  </div>
                </div>
              </div>
              <h5 className="f-13 mb-0">
                <span className="green f-13 semi-bold me-2">
                  <Image alt="line" className="line-icon" src={line} /> 8.5%
                </span>
                up from yesterday
              </h5>
            </div>
          </div> */}

            {/* <div className="col-12 col-md-4 col-lg-3 mb-4">
            <div className=" dash-total-users white-card rounded-lg">
              <div className="dash-line relative pb-1">
                <div className="row">
                  <div className="col-12 col-md-7 pending-case">
                    <p className="f-13">Submitted Claims</p>
                    <h5 className="bold f-24 mb-0">10</h5>
                  </div>
                  <div className="col-12 col-md-5 user-total-right text-end">
                    <Image
                      alt="loan"
                      className="total-lefticon"
                      src={litigate}
                    />
                  </div>
                </div>
              </div>
              <h5 className="f-13 mb-0">
                <span className="green f-13 semi-bold me-2">
                  <Image alt="line" className="line-icon" src={line} /> 8.5%
                </span>
                up from yesterday
              </h5>
            </div>
          </div> */}
            <div className="col-12 col-md-4 col-lg-3 mb-4">
              <div className=" dash-total-users white-card rounded-lg">
                <div className="dash-line relative pb-1">
                  <div className="row">
                    <div className="col-12 col-md-7 pending-case">
                      <p className="f-13">Submitted Claims</p>
                      <h5 className="bold f-24 mb-0">{data?.submitted}</h5>
                    </div>
                    <div className="col-12 col-md-5 user-total-right text-end">
                      <Image
                        alt="loan"
                        className="total-lefticon"
                        src={pending}
                      />
                    </div>
                  </div>
                </div>
                {/* <h5 className="f-13 mb-0">
                <span className="green f-13 semi-bold me-2">
                  <Image alt="line" className="line-icon" src={line} /> 8.5%
                </span>
                up from yesterday
              </h5> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
