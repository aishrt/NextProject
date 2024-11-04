"use client";
import React, { useState } from "react";
import { Metadata } from "next";
import "../../expert/expert.css";
import down from "@/assets/down.png";
import lock from "@/assets/lock2.png";
import edit from "@/assets/edit-2.png";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import lockbg from "@/assets/lockbg.png";

import winning from "@/assets/winning.png";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import success from "@/assets/congo.png";

import { PaginateData } from "@/types/Paginate";
import { User as UserType } from "@/types/User";
import db from "@/utils/connectDB";
import CerQuestions from "@/models/cerQuestion.model";
import ClaimReportModel from "@/models/cer_Report.model";
import { FaLock } from "react-icons/fa";
import { Tooltip } from "@mui/material";

import { TotalIncome } from "./_reportCharts/TotalIncome";
import { DailyAverage } from "./_reportCharts/DailyAverage";
import { Expenses } from "./_reportCharts/Expenses";
import { AddProduct } from "./_reportCharts/AddProduct";
import { WinningPercent } from "./_reportCharts/WinningPercent";
import { CircularProgress, Box, Typography } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import LoadingButton from "@mui/lab/LoadingButton";

export const metadata: Metadata = {
  title: "Claim Evaluation Report",
  description: "Generated by create next app",
};

export default function EvaluationReport({
  role,
  data,
}: {
  role: any;
  data: any;
}) {
  console.log(data);

  const params = useSearchParams();
  const router = useRouter();
  const id = params?.get("id");
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleHide = () => {
    setShow(false);
  };

  return (
    <div className="evaluation-rrt">
      <div className="row">
        <div className="col-12 col-md-10">
          {data?.questions?.map((itm: any, i: any) => {
            return (
              <div key={i} className="flex flex-col graph_dev mt-3">
                <h3 className="f-16 dark semi-bold mt-4 pb-1">
                  {itm?.question}{" "}
                </h3>

                <div className="bglght border rounded-radius client-address p-3">
                  <div className="row">
                    <div className="col-12 col-md-8 col-lg-9">
                      <Tooltip
                        key={i}
                        placement="top"
                        title={`${
                          role == "client" &&
                          itm?.isLock &&
                          data?.status !== "accept" &&
                          !data?.isPurchased
                            ? "You don't have subscription to view this."
                            : ""
                        }`}
                      >
                        <p className="f-15 mb-0">
                          {role == "client" &&
                          itm?.isLock &&
                          data?.status !== "accept" &&
                          !data?.isPurchased
                            ? itm?.answer?.substr(0, itm?.limit) + "..."
                            : itm?.answer}
                        </p>
                      </Tooltip>
                    </div>
                    <div className="col-12 col-md-4 col-lg-3">
                      <div className="success-rate-btns d-flex gap-2 align-items-center justify-content-end">
                        {itm?.isLock &&
                          !(
                            role === "client" &&
                            (data?.status === "accept" ||
                              (data?.status === "reject" && data?.isPurchased))
                          ) && (
                            <Image
                              src={lock}
                              className="down-link"
                              alt="lock"
                            />
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="row">
        <div className="col-12 col-md-8">
          {role !== "client" && (
            <div className="row align-items-center write-percent mt-4">
              <div className="col-12 col-md-3">
                <p className="f-16 dark mb-0">Winning Percentage</p>
              </div>
              <div className="col-12 col-md-6">
                <input
                  className="form-control"
                  disabled
                  value={data?.winning_percentage}
                />
              </div>
              {/* <div className="col-12 col-md-3">
              <Link href="/">
                <Image src={lockbg} className="lockbg" alt="" />
              </Link>
            </div> */}
            </div>
          )}
          {/* <p className="f-16 dark mb-0">Description</p>
          <p className="f-14 gray">{data?.description}</p> */}
          {/* <div className="row align-items-center write-percent mb-3">
            <div className="col-12 col-md-3">
              <p className="f-16 dark mb-0">Amount Used by Court</p>
            </div>
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="bggray border p-2 form-control"
                placeholder=""
              ></input>
            </div>
            <div className="col-12 col-md-3">
              <Link href="/">
                <Image src={lockbg} className="lockbg" alt="" />
              </Link>
            </div>
          </div> */}
          {/* <div className="row align-items-center write-percent mb-3">
            <div className="col-12 col-md-3">
              <p className="f-16 dark mb-0">Percentage Change</p>
            </div>
            <div className="col-12 col-md-6">
              <input
                type="text"
                className="bggray border p-2 form-control"
                placeholder=""
              ></input>
            </div>
            <div className="col-12 col-md-3">
              <Link href="/">
                <Image src={lockbg} className="lockbg" alt="" />
              </Link>
            </div>
          </div> */}
          {/* <h4 className="f-18 semi-bold mt-5 pb-3">Prepare Graph</h4> */}
        </div>
      </div>

      {/* Graphs */}
      <div className="row">
        <div className="col-12 col-md-9 mt-5">
          <div className="row">
            <div className="col-12 col-md-12 col-lg-8 col-xl-5 col-xxl-4">
              <div className="winning-percent ">
                {role == "client" &&
                data?.status !== "accept" &&
                !data?.isPurchased ? (
                  <div className=" mb-3">
                    <Image src={winning} alt="Winning" className="winning" />
                  </div>
                ) : (
                  <div
                    className="p-3 rounded mb-3 text-center"
                    style={{ backgroundColor: "#D6F4E5" }}
                  >
                    <h3 className="f-20">Wining Percentage</h3>

                    <Box
                      position="relative"
                      display="inline-flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {/* Background Circle */}
                      <CircularProgress
                        variant="determinate"
                        value={100} // Full circle
                        size={200}
                        thickness={6}
                        sx={{
                          color: "lightgrey", // Set your background color
                          position: "absolute",
                          zIndex: 1,
                        }}
                      />

                      <CircularProgress
                        color="success"
                        variant="determinate"
                        value={data?.winning_percentage}
                        size={200}
                        thickness={6}
                        sx={{
                          position: "relative",
                          zIndex: 2,
                        }}
                      />
                      <Box
                        position="absolute"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        width="100%"
                        height="100%"
                      >
                        <Typography
                          variant="caption"
                          component="div"
                          color="dark"
                          sx={{
                            fontSize: "22px",
                            fontWeight: "800",
                          }}
                        >
                          {data?.winning_percentage}
                          {"%"}
                        </Typography>
                      </Box>
                    </Box>
                  </div>
                )}

                <div
                  className="p-3 rounded mb-2"
                  style={{ backgroundColor: "#D6F4E5" }}
                >
                  <h3 className="f-18 mb-1">Description </h3>
                  <p className="mb-0 f-14 gray">{data?.description}</p>
                </div>
              </div>
            </div>
            {/* <div className="col-12 col-md-4">
              <div className="winning-percent ">
                <div
                  className="p-3 rounded mb-3 text-center"
                  style={{ backgroundColor: "#FFEEC6" }}
                >
                  <h3 className="f-20">Amount used by court</h3>
                </div>
                <div
                  className="p-3 rounded mb-2"
                  style={{ backgroundColor: "#FFEEC6" }}
                >
                  <h3 className="f-18 mb-1">Description </h3>
                  <p className="mb-0 f-14 gray">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididun
                  </p>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div className="winning-percent ">
                <div
                  className="p-3 rounded mb-3 text-center"
                  style={{ backgroundColor: "#EED6F4" }}
                >
                  <h3 className="f-20">Wining Percentage</h3>
                </div>
                <div
                  className="p-3 rounded mb-2"
                  style={{ backgroundColor: "#EED6F4" }}
                >
                  <h3 className="f-18 mb-1">Description </h3>
                  <p className="mb-0 f-14 gray">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididun
                  </p>
                </div>
              </div>
            </div> */}
          </div>
          {/* <div className="white-card total-income mt-4 p-4">
            <h3 className="f-18 semi-bold">Product add by month</h3>
            <AddProduct />
          </div>
          <div className="white-card total-income mt-4 p-4">
            <h3 className="f-18 semi-bold">Total income</h3>
            <TotalIncome />
          </div>
          <div className="white-card total-income mt-4 p-4">
            <Expenses />
          </div>
          <div className="white-card total-income mt-4 p-4">
            <h3 className="f-16 semi-bold">Daily Average</h3>
            <DailyAverage />
          </div> */}
        </div>
      </div>

      <div className="prepare-btns d-flex gap-3 align-items-center mt-3">
        {data?.isFinancialReport && (
          <LoadingButton
            loading={load}
            variant="contained"
            type="submit"
            className="load-btn"
            size="large"
            onClick={() => {
              setLoad(true);
              router.push(`/${role}/financial-report?id=` + id);
            }}
          >
            View Financial Report
          </LoadingButton>
        )}

        {role === "expert" && !data?.isFinancialReport && (
          <LoadingButton
            loading={load}
            variant="contained"
            type="submit"
            className="load-btn"
            size="large"
            onClick={() => {
              setLoad(true);
              router.push(`/expert/create-financial-report?id=` + id);
            }}
          >
            Create Financial Report
          </LoadingButton>
        )}
      </div>
    </div>
  );
}
