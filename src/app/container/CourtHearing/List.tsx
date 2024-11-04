import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import "../../expert/expert.css";
import down from "@/assets/down.png";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import { Link } from "@mui/material";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Details } from "@mui/icons-material";
import ArchiveIcon from "@mui/icons-material/ArchiveTwoTone";
import { axios } from "@/utils/axios";

export const metadata: Metadata = {
  title: "Court Hearing",
  description: "Generated by create next app",
};

export default function CourtHearingList({ role, data, loading, id }: any) {
  const router = useRouter();
  const [caseDetails, setDetails]: any = useState({});

  const getCaseDetails = () => {
    axios.get(`/api/client/case/get-case?caseId=${id}`).then((res: any) => {
      setDetails(res);
    });
  };
  useEffect(() => {
    if (id) {
      getCaseDetails();
    }
  }, []);
  return (
    <div className="main-content expert-cases case-updates court-hearing">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24 pb-3">Court Hearing</h2>
        {role == "lawyer" && (
          <button
            onClick={() =>
              router.push(
                `/${role}/court-hearing/add?case_id=${id}&caseType=${caseDetails?.caseType}`
              )
            }
            className="btn btn-primary"
          >
            Add Court Hearing
          </button>
        )}
      </div>
      {loading ? (
        <div className="d-flex justify-content-around">
          <div style={{ width: "100%" }} className="mt-5">
            <p className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </p>

            <p className="placeholder-wave">
              <span className="placeholder col-6"></span>
            </p>
            <p aria-hidden="true" className="placeholder-wave">
              <span className="placeholder col-6"></span>
            </p>

            <a
              className="btn btn-primary disabled placeholder-wave col-4"
              aria-hidden="true"
            ></a>
          </div>
          <div style={{ width: "100%" }} className="mt-5">
            <p className="placeholder-glow">
              <span className="placeholder col-6"></span>
            </p>

            <p className="placeholder-wave">
              <span className="placeholder col-6"></span>
            </p>
            <p aria-hidden="true" className="placeholder-wave">
              <span className="placeholder col-6"></span>
            </p>

            <a
              className="btn btn-primary disabled placeholder-wave col-4"
              aria-hidden="true"
            ></a>
          </div>
        </div>
      ) : (
        <div className="row">
          {data?.map((itm: any, i: any) => {
            return (
              <div key={i} className="col-12 col-md-6">
                <div
                  className="case-details-pre rounded-lg doc-requests mb-4"
                  style={{ background: "#FFF" }}
                >
                  <div className="pre-card-details">
                    <div className="pi-card-inner rounded">
                      <div className="f-14 p-3 border-btm-lgt d-flex">
                        <span className="title">Case</span>
                        <span className="coln">:</span>
                        <span className="semi-bold id-refer text-end">
                          #{itm?.case_id?.referenceId}
                        </span>
                      </div>
                      <div className="f-14 p-3 border-btm-lgt d-flex">
                        <span className="title">Title</span>
                        <span className="coln">:</span>
                        <span className="semi-bold id-refer text-end">
                          {itm?.title}
                        </span>
                      </div>
                      <div className="f-14 p-3 border-btm-lgt d-flex">
                        <span className="title">Description</span>
                        <span className="coln">:</span>
                        <span className="semi-bold id-refer text-end">
                          {itm?.description}
                        </span>
                      </div>
                      <div className="f-14 p-3 border-btm-lgt d-flex">
                        <span className="title">Date</span>
                        <span className="coln">:</span>
                        <span className="semi-bold id-refer text-end">
                          {moment(itm?.date).format("DD-MMM-YYYY")}
                        </span>
                      </div>
                      <div className="f-14 p-3 border-btm-lgt d-flex">
                        <span className="title">Time</span>
                        <span className="coln">:</span>
                        <span className="semi-bold id-refer text-end">
                          {itm?.time}
                        </span>
                      </div>
                      {/* <div className="f-14 p-3 border-btm-lgt d-flex">
                      <span className="title">Attendees</span>
                      <span className="coln">:</span>
                      <span className="semi-bold id-refer text-end">4</span>
                    </div> */}
                      <div className="f-14 p-3 border-btm-lgt d-flex">
                        <span className="title">Address</span>
                        <span className="coln">:</span>
                        <span className="semi-bold id-refer text-end">
                          {itm?.address || "NA"}
                        </span>
                      </div>
                    </div>
                    <div className="view-gray-btns d-flex gap-2 py-4 px-3 align-items-center">
                      <Button
                        onClick={() =>
                          router.push(
                            `/${role}/court-hearing/detail?id=${itm?._id}`
                          )
                        }
                        className="expert-btn"
                        variant="contained"
                      >
                        View More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {!loading && data?.length == 0 ? (
            <div
              className="flex flex-col items-center justify-center text-gray-500 w-100 h-80"
              style={{ backgroundColor: "rgb(219 230 245)" }}
            >
              <center style={{ paddingTop: "80px", paddingBottom: "80px" }}>
                <ArchiveIcon
                  fontSize="large"
                  style={{ height: "30px", width: "30px" }}
                />
                <h4>No Entries Found</h4>
              </center>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}