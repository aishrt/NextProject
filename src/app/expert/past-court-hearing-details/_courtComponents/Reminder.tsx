"use client";

import React from "react";
import "../../../expert/expert.css";
import { Link } from "@mui/material";
import Image from "next/image";
import doc from "@/assets/folder-open.png";
import { Button } from "@/components/Form/Button";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

export const Reminder = () => {
  return (
    <div>
      <div className="white-card p-3 mb-4">
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar />
        </LocalizationProvider>
      </div>
      <div className="case-details-pre rounded-lg doc-requests mb-4 reminder-details">
        <div className="border-purple rounded-full doc-requested p-4 bg-white mb-4">
          <div className="d-flex align-items-center justify-content-between reminder-time px-3">
            <h4 className="f-18 semi-bold">12th October 2024</h4>
            <span className="reminder purple f-14">Reminder</span>
          </div>
          <div className="pi-card-inner rounded">
            <div className="f-14 p-3 d-flex border-btm-lgt">
              <span className="title">Title</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer">Lorem ipsum</span>
            </div>
            <div className="f-14 p-3 d-flex  border-btm-lgt">
              <span className="title">Description</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              </span>
            </div>
            <div className="f-14 p-3  d-flex  border-btm-lgt">
              <span className="title">Time</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer">01:00PM</span>
            </div>
            <div className="f-14 p-3  d-flex  border-btm-lgt">
              <span className="title">Member</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer ">25</span>
            </div>

            <div className="f-14 p-3 view-uploads">
              <Button variant="contained" className="expert-btn px-5">
                Set
              </Button>
            </div>
          </div>
        </div>
        <div className="border-blue rounded-full doc-requested p-4 bg-white mb-4">
          <div className="d-flex align-items-center justify-content-between reminder-time px-3">
            <h4 className="f-18 semi-bold">12th October 2024</h4>
            <span className="reminder blue f-14">Reminder</span>
          </div>
          <div className="pi-card-inner rounded">
            <div className="f-14 p-3 d-flex border-btm-lgt">
              <span className="title">Title</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer">Lorem ipsum</span>
            </div>
            <div className="f-14 p-3 d-flex  border-btm-lgt">
              <span className="title">Description</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit,
              </span>
            </div>
            <div className="f-14 p-3  d-flex  border-btm-lgt">
              <span className="title">Time</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer">01:00PM</span>
            </div>
            <div className="f-14 p-3  d-flex  border-btm-lgt">
              <span className="title">Member</span>
              <span className="coln">:</span>
              <span className="semi-bold id-refer ">25</span>
            </div>

            <div className="f-14 p-3 view-uploads">
              <Button variant="contained" className="expert-btn px-5">
                Set
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
