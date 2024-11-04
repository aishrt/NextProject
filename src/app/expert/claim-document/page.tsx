import { Metadata } from "next";
import React from "react";
import "../../client/client.css";
import Image from "next/image";
import plus from "@/assets/plus-icon.png";
import doc from "@/assets/folder-open.png";
import { Button, Link } from "@mui/material";
import { ClaimFilters } from "./_claimComponents/ClaimFilters";
import { ReviewsTable } from "./_claimComponents/ReviewsTable";
import { DraftedDocs } from "./_claimComponents/DraftedDocs";
import { ClientApproved } from "./_claimComponents/ClientApproved";
import { EditRequest } from "./_claimComponents/EditRequest";

export const metadata: Metadata = {
  title: "Claim Document",
  description: "Generated by create next app",
};

export default function ClaimDocument() {
  return (
    <div className="main-content client-docs">
      <div className="top-bx d-flex align-items-center justify-content-between">
        <h2 className="f-24">Claim case ID: 465</h2>
        <Button
          variant="contained"
          className="p-0 border-0 bg-transparent shadow-none"
        >
          <Image src={plus} className="plus-icon" alt="" />
        </Button>
      </div>
      <ClaimFilters />
      <h3 className="f-20 mt-4 pb-3">Personal Information</h3>
      <div className="row pi-card">
        <div className="col-12 col-md-5 col-lg-4">
          <div className="pi-card-inner bg-white rounded">
            <div className="f-14 p-4 border-btm d-flex">
              <span className="title">Case ID</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">#qw2322</span>
            </div>
            <div className="f-14 p-4 border-btm d-flex">
              <span className="title">Uploaded on</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">
                24th June 2024
              </span>
            </div>
            <div className="f-14 p-4 border-btm d-flex">
              <span className="title">Doc Name</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">#qw2322</span>
            </div>
            <div className="f-14 p-4 border-btm d-flex">
              <span className="title">Category</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">#qw2322</span>
            </div>
            <div className="f-14 p-4 d-flex">
              <span className="title">Doc Type</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer text-end">#qw2322</span>
            </div>
          </div>
        </div>
      </div>

      <h3 className="f-20 mt-5 pb-3">Idemnisez Moi-Reviewed Documents</h3>
      {/* Idemnisez Moi-Reviewed Documents */}
      <div className="res-tabs upload-dcos">
        <div className="tab-content">
          <div className="res-table-box border-table">
            <div className="table-responsive  mt-4">
              <ReviewsTable />
            </div>
          </div>
        </div>
      </div>

      <h3 className="f-20 mt-5 pb-3">Document Request for Approval</h3>

      {/* Document Request for Approval */}
      <div className="res-tabs upload-dcos">
        <div className="res-tabs-box d-flex gap-3 align-items-center mb-4">
          <div className="tabs-uplaoded">
            <h4 className="f-15 semi-bold">Category</h4>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="client-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#client"
                  type="button"
                  role="tab"
                  aria-controls="client"
                  aria-selected="true"
                >
                  Client
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="lawyer-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#lawyer"
                  type="button"
                  role="tab"
                  aria-controls="lawyer"
                  aria-selected="false"
                >
                  Lawyer
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="client"
            role="tabpanel"
            aria-labelledby="client-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive  mt-4">
                <ReviewsTable />
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="lawyer"
            role="tabpanel"
            aria-labelledby="lawyer-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive mt-4">
                <ReviewsTable />
              </div>
            </div>
          </div>
        </div>
      </div>

       {/*Lawyer drafted document */}
       <h3 className="f-20 mt-5 pb-3">Lawyer drafted document </h3>
      <div className="res-table-box border-table">
        <div className="table-responsive mt-4">
          <DraftedDocs />
        </div>
      </div>
      {/*Edit Request by Client  */}
      <h3 className="f-20 mt-5 pb-3">Edit Request by Client </h3>
      <div className="res-table-box border-table">
        <div className="table-responsive mt-4">
          <EditRequest />
        </div>
      </div>

      {/*Client Approved Document */}
      <h3 className="f-20 mt-5 pb-3">Client Approved Document</h3>
      <div className="res-table-box border-table">
        <div className="table-responsive mt-4">
          <ClientApproved />
        </div>
      </div>
    </div>
  );
}
