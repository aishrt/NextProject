"use client";

import React from "react";
import "../../../expert/expert.css";
import { Link } from "@mui/material";
import Image from "next/image";
import doc from "@/assets/folder-open.png";
import { Button } from "@/components/Form/Button";

export const Conclusions = () => {
  return (
    <div
      className="case-details-pre rounded-lg doc-requests mb-4 hearing-details"
      style={{ background: "#FFF" }}
    >
      <div className="pre-card-details">
        <div className="pi-card-inner rounded">
          <div className="f-14 p-3 d-flex">
            <span className="title">Points discussed in hearing </span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer">Points discussed in hearing </span>
          </div>
          <div className="f-14 p-3 d-flex">
            <span className="title">Conclusion by the judge</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer">
              Lorem ipsum dolor sit amet,
            </span>
          </div>
          <div className="f-14 p-3  d-flex">
            <span className="title">Documents exchanged</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer">Lorem ipsum</span>
          </div>
          <div className="f-14 p-3  d-flex">
            <span className="title">Opposing party shared document</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer ">
              Opposing party shared document
            </span>
          </div>
          <div className="f-14 p-3  d-flex">
            <span className="title">Rate the winning chances</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer ">
              Rate the winning chances
            </span>
          </div>
          <div className="f-14 p-3 d-flex">
            <span className="title">Attendees Information</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer ">Lorem ipsum</span>
          </div>
          <div className="f-14 p-3 d-flex">
            <span className="title">Next Hearing Status</span>
            <span className="coln">:</span>
            <span className="semi-bold id-refer ">Lorem ipsum</span>
          </div>
        </div>
      </div>
    </div>
  );
};
