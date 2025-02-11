import { Metadata } from "next";
import React from "react";
import "../../admin/admin.css";
import Image from "next/image";
import loan from "@/assets/loan.png";
import line from "@/assets/line.png";
import complete from "@/assets/complete.png";
import pending from "@/assets/pending.png";
import litigate from "@/assets/litigate.png";
import profile from "@/assets/profile.png";
import { Button, Link } from "@mui/material";
import LitigationTable from "./_LitigationTable";
import { StatusType } from "./_charts/StatusType";
import { ProgressCases } from "./ProgressCases";
import TaskTable from "./_TaskTable";
import db from "@/utils/connectDB";
import User from "@/models/user.model";
import CasesTable from "./CasesTable";

export const metadata: Metadata = {
  title: "User Details",
  description: "Generated by create next app",
};

export default async function UserDetails({
  searchParams,
}: {
  searchParams: { id: string };
}) {
  let id: string = searchParams?.id;
  const fetchData = async (id: string) => {
    await db.connectDB();
    const userData = await User.findById(id);
    return {
      data: userData,
    };
  };

  const data = await fetchData(id);

  console.log(data?.data?.image, "datadatadata");

  return (
    <div className="main-content">
      {/* <!--- profile row  ----------> */}
      <div className="row dashboard-main-rw">
        <div className="col-12 col-md-5 col-lg-4 mb-4">
          <div className="user-profile-image white-card   rounded-lg p-4">
            <img
              src={data?.data?.image}
              alt=""
              className="user-details-icon w-100"
            />
          </div>
        </div>
        <div className="col-12 col-md-7 col-lg-8 mb-4">
          <div
            className="case-details-pre rounded-lg case-info"
            style={{ background: "#fff" }}
          >
            <div
              className="headr-pre p-3"
              style={{ background: "#A6D5CC", borderRadius: "10px 10px 0 0 " }}
            >
              <h3 className="f-18 semi-bold mb-0">Profile Information</h3>
            </div>
            <div className="pre-card-details">
              <div className="pi-card-inner rounded">
                <div className="f-14 p-3 border-btm-lgt d-flex">
                  <span className="title">User Name</span>
                  <span className="coln">:</span>
                  <span className="semi-bold id-refer text-end">
                    {data?.data?.firstName}
                  </span>
                </div>
                <div className="f-14 p-3 border-btm-lgt d-flex">
                  <span className="title">Email</span>
                  <span className="coln">:</span>
                  <span className="semi-bold id-refer text-end">
                    {data?.data?.email}
                  </span>
                </div>
                <div className="f-14 p-3 border-btm-lgt d-flex">
                  <span className="title">Phone Number</span>
                  <span className="coln">:</span>
                  <span className="semi-bold id-refer text-end">
                    {data?.data?.phoneNumber}
                  </span>
                </div>
                <div className="f-14 p-3 border-btm-lgt d-flex">
                  <span className="title">Address</span>
                  <span className="coln">:</span>
                  <span className="semi-bold id-refer text-end">
                    {data?.data?.location}
                  </span>
                </div>
                <div className="f-14 p-3 border-btm-lgt d-flex">
                  <span className="title">No of Prelitigation Registered</span>
                  <span className="coln">:</span>
                  <span className="semi-bold id-refer text-end">10</span>
                </div>
                <div className="f-14 p-3 border-btm-lgt d-flex">
                  <span className="title">No of litigation Registered</span>
                  <span className="coln">:</span>
                  <span className="semi-bold id-refer text-end">7</span>
                </div>
                <div className="f-14 p-3 border-btm-lgt d-flex">
                  <span className="title">Total Active Cases</span>
                  <span className="coln">:</span>
                  <span className="semi-bold id-refer text-end">7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row dashboard-users">
        <div className="col-12 col-md-4 col-lg-3 mb-4">
          <div className=" dash-total-users white-card rounded-lg">
            <div className="dash-line relative pb-1">
              <div className="row">
                <div className="col-12 col-md-7 pending-case">
                  <p className="f-13">Active Loan</p>
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
        </div>
        <div className="col-12 col-md-4 col-lg-3 mb-4">
          <div className=" dash-total-users white-card rounded-lg">
            <div className="dash-line relative pb-1">
              <div className="row">
                <div className="col-12 col-md-7 pending-case">
                  <p className="f-13">Completed Cases</p>
                  <h5 className="bold f-24 mb-0">30</h5>
                </div>
                <div className="col-12 col-md-5 user-total-right text-end">
                  <Image alt="loan" className="total-lefticon" src={complete} />
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
        </div>
        <div className="col-12 col-md-4 col-lg-3 mb-4">
          <div className=" dash-total-users white-card rounded-lg">
            <div className="dash-line relative pb-1">
              <div className="row">
                <div className="col-12 col-md-7 pending-case">
                  <p className="f-13">Pending Cases</p>
                  <h5 className="bold f-24 mb-0">12</h5>
                </div>
                <div className="col-12 col-md-5 user-total-right text-end">
                  <Image alt="loan" className="total-lefticon" src={pending} />
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
        </div>
        <div className="col-12 col-md-4 col-lg-3 mb-4">
          <div className=" dash-total-users white-card rounded-lg">
            <div className="dash-line relative pb-1">
              <div className="row">
                <div className="col-12 col-md-7 pending-case">
                  <p className="f-13">Total Litigation</p>
                  <h5 className="bold f-24 mb-0">10</h5>
                </div>
                <div className="col-12 col-md-5 user-total-right text-end">
                  <Image alt="loan" className="total-lefticon" src={litigate} />
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
        </div>
        <div className="col-12 col-md-4 col-lg-3 mb-4">
          <div className=" dash-total-users white-card rounded-lg">
            <div className="dash-line relative pb-1">
              <div className="row">
                <div className="col-12 col-md-7 pending-case">
                  <p className="f-13">Claim Submitted</p>
                  <h5 className="bold f-24 mb-0">30</h5>
                </div>
                <div className="col-12 col-md-5 user-total-right text-end">
                  <Image alt="loan" className="total-lefticon" src={complete} />
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
        </div>
        <div className="col-12 col-md-4 col-lg-3 mb-4">
          <div className=" dash-total-users white-card rounded-lg">
            <div className="dash-line relative pb-1">
              <div className="row">
                <div className="col-12 col-md-7 pending-case">
                  <p className="f-13">Total Mandates</p>
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
        </div>
        <div className="col-12 col-md-4 col-lg-3 mb-4">
          <div className=" dash-total-users white-card rounded-lg">
            <div className="dash-line relative pb-1">
              <div className="row">
                <div className="col-12 col-md-7 pending-case">
                  <p className="f-13">Cancelled Claim</p>
                  <h5 className="bold f-24 mb-0">10</h5>
                </div>
                <div className="col-12 col-md-5 user-total-right text-end">
                  <Image alt="loan" className="total-lefticon" src={litigate} />
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
        </div>
        <div className="col-12 col-md-4 col-lg-3 mb-4">
          <div className=" dash-total-users white-card rounded-lg">
            <div className="dash-line relative pb-1">
              <div className="row">
                <div className="col-12 col-md-7 pending-case">
                  <p className="f-13">Funded Claim</p>
                  <h5 className="bold f-24 mb-0">12</h5>
                </div>
                <div className="col-12 col-md-5 user-total-right text-end">
                  <Image alt="loan" className="total-lefticon" src={pending} />
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
        </div>
      </div>
      {/* <!------Cases tabs--------> */}
      <div className="comm-tools req-tracking my-4">
        <h3 className="f-18 semi-bold">Cases</h3>
        <div className="res-tabs pt-4">
          <div className="res-tabs-box d-flex gap-3 align-items-center mb-4">
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link "
                  id="prelitigation-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#prelitigation"
                  type="button"
                  role="tab"
                  aria-controls="prelitigation"
                  aria-selected="false"
                >
                  Prelitigation
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="litigation-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#litigation"
                  type="button"
                  role="tab"
                  aria-controls="litigation"
                  aria-selected="true"
                >
                  Litigation
                </button>
              </li>
            </ul>
          </div>
          <div className="tab-content" id="myTabContent">
            <div
              className="tab-pane fade "
              id="prelitigation"
              role="tabpanel"
              aria-labelledby="prelitigation-tab"
            >
              <div className="doc-requets">
                <div className="res-table-box">
                  <div className="table-responsive mt-4">
                    <CasesTable />
                  </div>
                </div>
              </div>
            </div>
            <div
              className="tab-pane fade show active"
              id="litigation"
              role="tabpanel"
              aria-labelledby="litigation-tab"
            >
              <div className="doc-requets">
                <div className="row">
                  <div className="col-12">
                    <LitigationTable />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cases types */}
      <div className="row cases-type mt-4">
        <div className="col-12 col-md-7 mb-4">
          <div className="status-type">
            <div className="white-card rounded-lg">
              <div className="status-title border-btm p-3">
                <h3 className="f-18 semi-bold mb-0">Cases status by type</h3>
              </div>
              <div className="status-chart p-3">
                <StatusType />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-5 mb-4">
          <ProgressCases />
        </div>
      </div>

      {/* task Management */}
      <div className="task-managment row">
        <div className="col-12 col-md-5 col-lg-4">
          <div className="white-card rounded-lg activity-logs p-4">
            <h4 className="f-20">Last Activity Logs</h4>
            <div className="bggray activity-tasks p-3 rounded-lg my-2">
              <p className="mb-0 f-14 d-flex justify-content-between">
                <span className="fw-500">Case Id:</span>
                <span className="">#34324</span>
              </p>
              <p className="mb-0 f-14 d-flex justify-content-between">
                <span className="fw-500">Date & Time:</span>
                <span className="">12-01-22 10:00AM</span>
              </p>
              <p className="mb-0 f-14 d-flex justify-content-between">
                <span className="fw-500">Description:</span>
                <span className="">Lorem ipsum</span>
              </p>
            </div>
            <div className="bggray activity-tasks p-3 rounded-lg my-2">
              <p className="mb-0 f-14 d-flex justify-content-between">
                <span className="fw-500">Case Id:</span>
                <span className="">#34324</span>
              </p>
              <p className="mb-0 f-14 d-flex justify-content-between">
                <span className="fw-500">Date & Time:</span>
                <span className="">12-01-22 10:00AM</span>
              </p>
              <p className="mb-0 f-14 d-flex justify-content-between">
                <span className="fw-500">Description:</span>
                <span className="">Lorem ipsum</span>
              </p>
            </div>
            <div className="bggray activity-tasks p-3 rounded-lg my-2">
              <p className="mb-0 f-14 d-flex justify-content-between">
                <span className="fw-500">Case Id:</span>
                <span className="">#34324</span>
              </p>
              <p className="mb-0 f-14 d-flex justify-content-between">
                <span className="fw-500">Date & Time:</span>
                <span className="">12-01-22 10:00AM</span>
              </p>
              <p className="mb-0 f-14 d-flex justify-content-between">
                <span className="fw-500">Description:</span>
                <span className="">Lorem ipsum</span>
              </p>
            </div>
            <div className="activity-view text-end">
              <Link
                href="/"
                className="activity-link f-15 semi-bold dark text-decoration-underline"
              >
                View All
              </Link>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-7 col-lg-8">
          <div className="white-card table-card rounded-lg p-4">
            <h4 className="f-20">Task Management</h4>
            <div className="table-responsive mt-4">
              <TaskTable id={data?.data?._id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
