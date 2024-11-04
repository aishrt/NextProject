"use client";
import { PaginateData } from "@/types/Paginate";
import { User as UserType } from "@/types/User";
import db from "@/utils/connectDB";
import { Metadata } from "next";
import React, { useEffect, useState } from "react";
import "../../admin/admin.css";
import CerQuestions from "@/models/cerQuestion.model";
import ClaimReportModel from "@/models/cer_Report.model";
import { FaLock } from "react-icons/fa";
import { Alert, Snackbar, Tooltip } from "@mui/material";
import ClaimFinancialModel from "@/models/claim_financial.model";
import moment from "moment";
import { axios } from "@/utils/axios";
import { useRouter } from "next/navigation";
import useSnackbar from "@/hooks/useSnackbar";
import LoadingButton from "@mui/lab/LoadingButton";

const FundDetails = ({ data, role }: { data: any; role?: any }) => {
  const router = useRouter();
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Fund Details</h2>
        <button
          onClick={() => router.back()}
          className="submit-btn bg-white rounded"
        >
          <a style={{ textDecoration: "none", color: "#000" }}>Back</a>
        </button>

        {/* <button className="form-control " onClick={()=>{
      }} style={{width:'140px'}}> <a href="/add-question" style={{textDecoration:'none'}}>Add Question</a> </button> */}
      </div>
      {!data?.fundAmount ? (
        <>
          <div className="">
            <p className="placeholder-glow">
              <span className="placeholder col-12"></span>
            </p>

            <p className="placeholder-wave">
              <span className="placeholder col-12"></span>
            </p>
            <p aria-hidden="true">
              <span className="placeholder col-6"></span>
            </p>

            <a
              className="btn btn-primary disabled placeholder col-4"
              aria-hidden="true"
            ></a>
          </div>
        </>
      ) : (
        <div className="">
          <div className="  mt-4 indivi-form">
            <div className="cases-list-table expert-table">
              <div className="row mt-5">
                <div className="col-12 col-lg-8 white-card p-5 rounded">
                  <div className="flex flex-col graph_dev mt-3">
                    <h6 className="flex">Fund Amount </h6>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        required
                        className=" bglight-ip w-100 rounded  graph_input"
                        value={data?.fundAmount}
                        disabled
                        name="question"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="flex flex-col graph_dev mt-3">
                    <h6 className="flex">Transaction ID</h6>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        required
                        className=" bglight-ip w-100 rounded  graph_input"
                        value={data?.transactionId}
                        disabled
                        name="question"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="flex flex-col graph_dev mt-3">
                    <h6 className="flex">Description</h6>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        required
                        className=" bglight-ip w-100 rounded  graph_input"
                        value={data?.description}
                        disabled
                        name="question"
                        type="text"
                        placeholder=""
                      />
                    </div>
                  </div>
                  <div className="flex flex-col graph_dev mt-3">
                    <h6 className="flex">Created Date</h6>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <input
                        required
                        className=" bglight-ip w-100 rounded  graph_input"
                        value={moment(data?.createdAt).format("DD MMM YYYY")}
                        disabled
                        name="question"
                        placeholder=""
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
};

export default FundDetails;
