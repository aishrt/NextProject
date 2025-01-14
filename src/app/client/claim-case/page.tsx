import { Metadata } from "next";
import React from "react";
import "../../client/client.css";
import Image from "next/image";
import plus from "@/assets/plus-icon.png";
import doc from "@/assets/folder-open.png";
import { Button, Link } from "@mui/material";
import { ClaimFilters } from "./_claimComponents/ClaimFilters";
import { ClaimTable } from "./_claimComponents/ClaimTable";
import { ReviewsTable } from "./_claimComponents/ReviewsTable";
import { DraftedDocs } from "./_claimComponents/DraftedDocs";

export const metadata: Metadata = {
  title: "Claim Case",
  description: "Generated by create next app",
};

export default function ClaimCase() {
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
      <h3 className="f-20 mt-5 pb-3">Client Uploaded Documents</h3>

      {/* Client Uploaded Documents */}
      <div className="res-tabs upload-dcos">
        <div className="res-tabs-box d-flex gap-3 align-items-center mb-4">
          <div className="tabs-uplaoded">
            <h4 className="f-15 semi-bold">Status</h4>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="pending-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#pending"
                  type="button"
                  role="tab"
                  aria-controls="pending"
                  aria-selected="true"
                >
                  Pending
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="approved-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#approved"
                  type="button"
                  role="tab"
                  aria-controls="approved"
                  aria-selected="false"
                >
                  Approved
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="both-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#both"
                  type="button"
                  role="tab"
                  aria-controls="both"
                  aria-selected="false"
                >
                  Both
                </button>
              </li>
            </ul>
          </div>
          <div className="client-docs res-tabs ">
            <h4 className="f-15 semi-bold">Category</h4>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="proof-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#proof"
                  type="button"
                  role="tab"
                  aria-controls="proof"
                  aria-selected="true"
                >
                  Proof of Damage
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="identity-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#identity"
                  type="button"
                  role="tab"
                  aria-controls="identity"
                  aria-selected="false"
                >
                  Proof of Identity
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="read-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#read"
                  type="button"
                  role="tab"
                  aria-controls="read"
                  aria-selected="false"
                >
                  Communication to Read
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="pending"
            role="tabpanel"
            aria-labelledby="pending-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive  mt-4">
                <ClaimTable />
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="approved"
            role="tabpanel"
            aria-labelledby="approved-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive mt-4">
                <ClaimTable />
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="both"
            role="tabpanel"
            aria-labelledby="both-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive mt-4">
                <ClaimTable />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="f-20 mt-5 pb-3">Idemnisez Moi-Reviewed Documents</h3>
      {/* Idemnisez Moi-Reviewed Documents */}
      <div className="res-tabs upload-dcos">
        <div className="res-tabs-box d-flex gap-3 align-items-center mb-4">
          <div className="tabs-uplaoded">
            <h4 className="f-15 semi-bold">Status</h4>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="pending-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#pending"
                  type="button"
                  role="tab"
                  aria-controls="pending"
                  aria-selected="true"
                >
                  Pending
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="approved-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#approved"
                  type="button"
                  role="tab"
                  aria-controls="approved"
                  aria-selected="false"
                >
                  Approved
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="both-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#both"
                  type="button"
                  role="tab"
                  aria-controls="both"
                  aria-selected="false"
                >
                  Both
                </button>
              </li>
            </ul>
          </div>
        </div>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="pending"
            role="tabpanel"
            aria-labelledby="pending-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive  mt-4">
                <ReviewsTable />
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="approved"
            role="tabpanel"
            aria-labelledby="approved-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive mt-4">
                <ReviewsTable />
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="both"
            role="tabpanel"
            aria-labelledby="both-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive mt-4">
                <ReviewsTable />
              </div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="f-20 mt-5 pb-3">Lawyer drafted document</h3>

      {/* Lawyer drafted document */}
      <div className="res-tabs upload-dcos">
        <div className="res-tabs-box d-flex gap-3 align-items-center mb-4">
          <div className="tabs-uplaoded">
            <h4 className="f-15 semi-bold">Status</h4>
            <ul className="nav nav-tabs" id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="pending-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#pending"
                  type="button"
                  role="tab"
                  aria-controls="pending"
                  aria-selected="true"
                >
                  Pending
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="approved-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#approved"
                  type="button"
                  role="tab"
                  aria-controls="approved"
                  aria-selected="false"
                >
                  Approved
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="both-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#both"
                  type="button"
                  role="tab"
                  aria-controls="both"
                  aria-selected="false"
                >
                  Both
                </button>
              </li>
            </ul>
          </div>
    
        </div>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="pending"
            role="tabpanel"
            aria-labelledby="pending-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive  mt-4">
                <DraftedDocs />
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="approved"
            role="tabpanel"
            aria-labelledby="approved-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive mt-4">
                <DraftedDocs />
              </div>
            </div>
          </div>
          <div
            className="tab-pane fade"
            id="both"
            role="tabpanel"
            aria-labelledby="both-tab"
          >
            <div className="res-table-box border-table">
              <div className="table-responsive mt-4">
                <DraftedDocs />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
