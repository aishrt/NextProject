"use client";

import React, { useState } from "react";
import Image from "next/image";
import send from "@/assets/send.png";
import arrow from "@/assets/arrow-lg.png";
import appoint from "@/assets/appoint.png";
import "../../../admin/admin.css";

export const TodaysAppointments = () => {
  return (
    <div className="today-appoint white-card rounded-lg mb-4">
      <div className="appoint-title border-btm">
        <h3 className="f-18 semi-bold p-3 mb-0">Today’s Appointment</h3>
      </div>
      <div className="appoint-row  p-3 border-btm">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-9">
            <div className="appointment-status d-flex align-items-center gap-3">
              <div className="appont-date">
                <span className="d-block gray f-13">Jul</span>
                <span className="d-block semi-bold f-18">14</span>
              </div>
              <div className="appoint-box">
                <p className="f-13 gray mb-2">Case ID-2343</p>
                <h4 className="f-16 semi-bold mb-0">Gupta Party</h4>
                <p className="f-13 gray mb-0">Legal Advisor-Peter Parker</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-3">
            <p className="f-12 gray">03:30PM</p>
            <Image className="appointicon" src={appoint} alt="appoint" />
          </div>
        </div>
      </div>
      <div className="appoint-row  p-3 border-btm">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-9">
            <div className="appointment-status d-flex align-items-center gap-3">
              <div className="appont-date">
                <span className="d-block gray f-13">Jul</span>
                <span className="d-block semi-bold f-18">14</span>
              </div>
              <div className="appoint-box">
                <p className="f-13 gray mb-2">Case ID-2343</p>
                <h4 className="f-16 semi-bold mb-0">Gupta Party</h4>
                <p className="f-13 gray mb-0">Legal Advisor-Peter Parker</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-3">
            <p className="f-12 gray">03:30PM</p>
            <Image className="appointicon" src={appoint} alt="appoint" />
          </div>
        </div>
      </div>
      <div className="appoint-row  p-3 border-btm">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-9">
            <div className="appointment-status d-flex align-items-center gap-3">
              <div className="appont-date">
                <span className="d-block gray f-13">Jul</span>
                <span className="d-block semi-bold f-18">14</span>
              </div>
              <div className="appoint-box">
                <p className="f-13 gray mb-2">Case ID-2343</p>
                <h4 className="f-16 semi-bold mb-0">Gupta Party</h4>
                <p className="f-13 gray mb-0">Legal Advisor-Peter Parker</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-3">
            <p className="f-12 gray">03:30PM</p>
            <Image className="appointicon" src={appoint} alt="appoint" />
          </div>
        </div>
      </div>
      <div className="appoint-row  p-3 border-btm">
        <div className="row">
          <div className="col-12 col-md-8 col-lg-9">
            <div className="appointment-status d-flex align-items-center gap-3">
              <div className="appont-date">
                <span className="d-block gray f-13">Jul</span>
                <span className="d-block semi-bold f-18">14</span>
              </div>
              <div className="appoint-box">
                <p className="f-13 gray mb-2">Case ID-2343</p>
                <h4 className="f-16 semi-bold mb-0">Gupta Party</h4>
                <p className="f-13 gray mb-0">Legal Advisor-Peter Parker</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 col-lg-3">
            <p className="f-12 gray">03:30PM</p>
            <Image className="appointicon" src={appoint} alt="appoint" />
          </div>
        </div>
      </div>
    </div>
  );
};
