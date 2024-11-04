"use client";

import React, { useEffect, useState } from "react";
import "../../../client/client.css";
import { axios } from "@/utils/axios";

export const DocTracking = ({ data }: any) => {
  const [Claim, setClaim] = useState(0);
  const [Legal, setLegal] = useState(0);
  const [Lawyer, setLawyer] = useState(0);

  const GetClaimDocuments = () => {
    axios
      .get(`/api/cases/${data?._id}/documents?type=claim`)
      .then((res: any) => {
        setClaim(res?.data?.length);
      });
  };
  const GetLegalDocuments = () => {
    axios
      .get(`/api/cases/${data?._id}/documents?type=legal`)
      .then((res: any) => {
        setLegal(res?.data?.length);
      });
  };
  const GetLawyerDocuments = () => {
    axios
      .get(`/api/cases/${data?._id}/documents?type=lawyer`)
      .then((res: any) => {
        setLawyer(res?.data?.length);
      });
  };
  useEffect(() => {
    if (data?._id) {
      GetLegalDocuments();
      GetClaimDocuments();
      GetLawyerDocuments();
    }
  }, [data]);
  return (
    <div
      className="case-details-pre rounded-lg case-info financing-status"
      style={{ background: "#fff" }}
    >
      <div className="headr-pre p-4 pb-0 mb-2">
        <h3 className="f-18 semi-bold mb-0">Documents Tracking</h3>
      </div>
      <div className="financing-evalt row p-4 w-100 m-auto">
        <div className="row">
          <div className="col-12 col-md-4 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Client Documents</p>
              <div className="fin-status-count">{Claim ||0}</div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Legal Expert Documents</p>
              <div className="fin-status-count">{Legal ||0}</div>
            </div>
          </div>
          <div className="col-12 col-md-4 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Lawyer Documents</p>
              <div className="fin-status-count">{Lawyer||0}</div>
            </div>
          </div>
          {/* <div className="col-12 col-md-3 mb-4">
            <div className="bggray  rounded-lg p-3 text-center finance-colm">
              <p className="f-15 semi-bold">Personal Doc</p>
              <div className="fin-status-count">15</div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};
