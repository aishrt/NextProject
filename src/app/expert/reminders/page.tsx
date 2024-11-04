import React, { useState } from "react";
import { Metadata } from "next";
import "../../expert/expert.css";
import { Button } from "@mui/material";
import SendReminders from "./_SendReminders";
import CustomisedReminder from "./_CustomisedReminder";

export const metadata: Metadata = {
  title: "Reminders",
  description: "Generated by create next app",
};

export default function Reminders() {
  return (
    <div className="main-content expert-cases case-members request-doc-upload">
      <div className="top-br">
        <h2 className="f-24">Reminders</h2>
      </div>
      <div className="res-tabs pt-4">
        <div className="res-tabs-box d-flex gap-3 align-items-center mb-4">
          <ul className="nav nav-tabs" id="myTab" role="tablist">
            <li className="nav-item" role="presentation">
              <button
                className="nav-link active"
                id="schedule-tab"
                data-bs-toggle="tab"
                data-bs-target="#schedule"
                type="button"
                role="tab"
                aria-controls="schedule"
                aria-selected="false"
              >
                Scheduled Reminder
              </button>
            </li>
            <li className="nav-item" role="presentation">
              <button
                className="nav-link "
                id="reminder-tab"
                data-bs-toggle="tab"
                data-bs-target="#reminder"
                type="button"
                role="tab"
                aria-controls="reminder"
                aria-selected="true"
              >
                Send Customised Reminder
              </button>
            </li>
          </ul>
        
        </div>
        <div className="tab-content" id="myTabContent">
          <div
            className="tab-pane fade show active"
            id="schedule"
            role="tabpanel"
            aria-labelledby="schedule-tab"
          >
            <div className="doc-requets">
             <SendReminders />
            </div>
          </div>
          <div
            className="tab-pane fade "
            id="reminder"
            role="tabpanel"
            aria-labelledby="reminder-tab"
          >
            <div className="doc-requets">
             <CustomisedReminder />
            </div>
          </div>
        </div>

      
      </div>
    </div>
  );
}