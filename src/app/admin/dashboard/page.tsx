"use client";
// import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import "../../admin/admin.css";
import Image from "next/image";
import loan from "@/assets/loan.png";
import line from "@/assets/line.png";
import complete from "@/assets/complete.png";
import pending from "@/assets/pending.png";
import litigate from "@/assets/litigate.png";
import { Button, Link } from "@mui/material";
// import { PrelitigationChart } from "./_charts/PrelitigationChart";
// import { RegisteredUsers } from "./_charts/RegisteredUsers";
// import { PrelitigationCases } from "./_charts/PrelitigationCases";
// import { LitigationCases } from "./_charts/LitigationCases";
// import { PrelitigationDocs } from "./_charts/PreLitigationDocs";
// import { LitigationDocs } from "./_charts/LitigationDocs";
// import { RevenueChart } from "./_charts/RevenueChart";
import { CasesCount } from "./CasesCount";
import { axios } from "@/utils/axios";
import { DashboardData } from "@/types/Dashboard";
import { upperFirst } from "lodash";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/queries/notifications";
import { useCases } from "@/queries/cases";
import Cards from "./Cards";
// export const metadata: Metadata = {
//   title: "Dashboard",
//   description: "Generated by create next app",
// };

export default function Dashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData>();
  const [loading, setLoading] = useState<boolean>(false);

  const { data: NotificationData, isLoading, refetch } = useNotifications();

  const [page, setPage] = useState(1);
  const {
    data: caseData,
    isLoading: caseLoading,
    isFetching,
    refetch: caseRefetch,
  } = useCases({
    page,
    role: "expert",
    dataPerPage: 3,
  });

  const getDashboardData = () => {
    axios
      .get(`/api/admin/dashboard`)
      .then((res: any) => {
        setData(res);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    caseRefetch();
  }, [page]);

  useEffect(() => {
    setLoading(true);
    getDashboardData();
  }, []);

  return (
    <div className="main-content">
      <Cards data={data} />

      {/* <!--- dahsboard main row  ----------> */}
      {/* <div className="row dashboard-main-rw">
        <div className="col-12 col-md-6 col-lg-5 mb-4">
          <div className="cases-chart cases-chrt white-card p-4 rounded-lg">
            <div className="chart-top  d-flex align-items-center justify-content-between">
              <p className="f-18 semi-bold">No. of Cases</p>
              <select className="chart-select">
                <option>Hourly</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <PrelitigationChart />
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-7 mb-4">
          <div className="cases-chart white-card p-4 rounded-lg">
            <div className="chart-top d-flex align-items-center justify-content-between">
              <p className="f-18 semi-bold">Registered Mangagers and lawyers</p>
              <select className="chart-select">
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <RegisteredUsers />
          </div>
        </div>
      </div> */}

      {/* <!--- dahsboard main row  ----------> */}
      {/* <div className="row dashboard-main-rw">
        <div className="col-12 col-md-6 col-lg-6 mb-4">
          <div className="cases-chart white-card p-4 rounded-lg">
            <div className="chart-top d-flex align-items-center justify-content-between">
              <p className="f-18 semi-bold">Prelitigation Cases</p>
              <select className="chart-select">
                <option>Hourly</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <PrelitigationCases />
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-6 mb-4">
          <div className="cases-chart white-card p-4 rounded-lg">
            <div className="chart-top d-flex align-items-center justify-content-between">
              <p className="f-18 semi-bold">Litigation Cases</p>
              <select className="chart-select">
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <LitigationCases />
          </div>
        </div>
      </div> */}
      <div className="row count-cases">
        <div className="col-12">
          <CasesCount />
        </div>
      </div>
      {/* <!--- documents row  ----------> */}
      {/* <div className="row dashboard-main-rw">
        <div className="col-12 col-md-6 col-lg-6 mb-4">
          <div className="cases-chart white-card p-4 rounded-lg">
            <div className="chart-top d-flex align-items-center justify-content-between">
              <p className="f-18 semi-bold">Prelitigation Documents</p>
              <select className="chart-select">
                <option>Hourly</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <PrelitigationDocs />
          </div>
        </div>
        <div className="col-12 col-md-6 col-lg-6 mb-4">
          <div className="cases-chart white-card p-4 rounded-lg">
            <div className="chart-top d-flex align-items-center justify-content-between">
              <p className="f-18 semi-bold">Litigation Documents</p>
              <select className="chart-select">
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Yearly</option>
              </select>
            </div>
            <LitigationDocs />
          </div>
        </div>
      </div> */}
      {/* <!--- revenue row  ----------> */}
      {/* <div className="row dashboard-main-rw">
        <div className="col-12 col-md-12 mb-4">
          <div className="cases-chart white-card p-4 rounded-lg">
            <div className="chart-top">
              <p className="f-18 semi-bold">Total Revenue Generated</p>
            </div>
            <RevenueChart />
          </div>
        </div>
      </div> */}
    </div>
  );
}
