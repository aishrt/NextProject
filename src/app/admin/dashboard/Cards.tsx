"use client";
import React from "react";
import "../../admin/admin.css";
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
    <div className="row">
      <div className="col-12 col-md-12">
        <div className="row dashboard-users admin-cards">
          <div className="col-12 col-md-4 col-lg-3 mb-4">
            <div className=" dash-total-users white-card rounded-lg">
              <div className="dash-line relative pb-1">
                <div className="row">
                  <div className="col-12 col-md-7 pending-case">
                    <p className="f-13">Total Registered Users</p>
                    <h5 className="bold f-24 mb-0">{data?.totalUser}</h5>
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
                    <p className="f-13">Active Users</p>
                    <h5 className="bold f-24 mb-0">30</h5>
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
                    <p className="f-13">Case Managers</p>
                    <h5 className="bold f-24 mb-0">{data?.caseManagers}</h5>
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
                    <p className="f-13">Total Lawyers Registered</p>
                    <h5 className="bold f-24 mb-0">{data?.totalLawyers}</h5>
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
                    <p className="f-13">Total Prelitigation Cases Registered</p>
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
                    <p className="f-13">Total Litigation Cases Registered</p>
                    <h5 className="bold f-24 mb-0">{data?.litigation}</h5>
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
                    <p className="f-13">Total Resolved Cases </p>
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
                    <p className="f-13">Total Unresolved Cases</p>
                    <h5 className="bold f-24 mb-0">{data?.notResolved}</h5>
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
                    <p className="f-13">Total Active Litigation Cases</p>
                    <h5 className="bold f-24 mb-0">{data?.activeLitigation}</h5>
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
                    <p className="f-13">Total Active PreLitigation Cases</p>
                    <h5 className="bold f-24 mb-0">{data?.activePreLitigation}</h5>
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
                    <p className="f-13">Total PreLitigation Lawyers</p>
                    <h5 className="bold f-24 mb-0">12</h5>
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
                    <p className="f-13">Total Revenue Generated</p>
                    <h5 className="bold f-24 mb-0">12</h5>
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
  );
}
