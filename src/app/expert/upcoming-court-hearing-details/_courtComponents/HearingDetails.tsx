"use client";

import React from "react";
import "../../../expert/expert.css";
import { Link } from "@mui/material";
import Image from "next/image";
import doc from "@/assets/folder-open.png";
import { Button } from "@/components/Form/Button";

export const HearingDetails = () => {
  return (
    <div
      className="case-details-pre rounded-lg doc-requests hearing-details"
      style={{ background: "#FFF" }}
    >
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 d-flex">
            <span className="title">Title</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer">Lorem ipsum</span>
          </div>
          <div className="f-14 p-3 d-flex">
            <span className="title">Description</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip.
            </span>
          </div>
          <div className="f-14 p-3  d-flex">
            <span className="title">Objective</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer">Lorem ipsum</span>
          </div>
          <div className="f-14 p-3  d-flex">
            <span className="title">Date</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer ">25th june 2024</span>
          </div>
          <div className="f-14 p-3  d-flex">
            <span className="title">Time</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer ">02:45 pm</span>
          </div>
          <div className="f-14 p-3 d-flex">
            <span className="title">Location</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer ">Lorem ipsum</span>
          </div>
          <div className="f-14 p-3 d-flex">
            <span className="title">Uploaded Documents </span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer hearing-docs">
              <Link href="/expert/pre-litigation-claim-document ">
                <div className="folder-card rounded recent-folder border w-max">
                  <Image src={doc} className="doc-icn" alt="doc" />
                  <div className="doc-filter-fl">
                    <h6 className="f-16 mb-0">ID Proof Folder</h6>
                    <p className="f-13 mb-0 gray">50 MB</p>
                  </div>
                </div>
              </Link>
            </span>
          </div>
        </div>

        <h4 className="f-16 semi-bold pt-4 pb-2">
        Documents Required from Client: 
        </h4>
        <div className="border rounded-full doc-requested p-4">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 d-flex">
            <span className="title">Title</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer">Lorem ipsum</span>
          </div>
          <div className="f-14 p-3 d-flex">
            <span className="title">Description</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, 
            </span>
          </div>
          <div className="f-14 p-3  d-flex">
            <span className="title">Last Submission Date</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer">25th june 2024</span>
          </div>
          <div className="f-14 p-3  d-flex">
            <span className="title">Valid Untill</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer ">25th june 2024</span>
          </div>
          <div className="f-14 p-3  d-flex">
            <span className="title">Status</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer ">Uploaded</span>
          </div>
          <div className="f-14 p-3 view-uploads">
            <Button variant="contained" className="expert-btn">View</Button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};
