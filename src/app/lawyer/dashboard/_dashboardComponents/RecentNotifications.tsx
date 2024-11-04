"use client";

import React, { useState } from "react";
import Image from "next/image";
import bell from "@/assets/bell.png";
import "../../../expert/expert.css";
import moment from "moment";

export const RecentNotifications = ({ data }: any) => {
  return (
    <div
      className="today-appoint recent-notifcation p-4 rounded-lg"
      style={{ background: "#E5ECF6" }}
    >
      <div className="appoint-title">
        <h3 className="f-18 semi-bold mb-0">Recent Notifications</h3>
      </div>

      <div className="recent-note-row">
        {data?.slice(0, 3)?.map((notification: any, index: any) => (
          <div className="row align-items-center" key={index}>
            <div className="col-12 col-md-3 col-lg-2">
              <Image className="notifyicon" src={bell} alt="bell" />
            </div>
            <div className="col-12 col-md-9 col-lg-10">
              <div className="notify-status">
                <div className="appoint-box">
                  <p className="f-13 gray mb-1">
                    Case ID-#{notification?.caseId?.referenceId}
                  </p>
                  <h4 className="f-16 semi-bold mb-1">
                    {notification.description}{" "}
                  </h4>
                  <p className="f-13 gray mb-2">
                    {moment(notification.createdAt).fromNow()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
