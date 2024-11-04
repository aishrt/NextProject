"use client";

import React, { useState } from "react";
import "../../admin/admin.css";

export const CasesCount = () => {
  return (
    <div className="for-query my-4 d-flex text-center flex-row-wrap cases-count gap-5">
      <div className="query-box yellowbg" style={{backgroundColor: "#FFF3D6"}}>
        <p className="f-15 mb-2">Total tasks for Case manager</p>
        <h3 className="bold f-20 mb-0">10
        </h3>
      </div>
      <div className="query-box greenbg" style={{backgroundColor: "#D6F4E5"}}>
        <p className="f-15 mb-2">Total tasks for Lawyer</p>
        <h3 className="bold f-20 mb-0">12
        </h3>
      </div>

      {/* <div className="query-box pinkbg" style={{backgroundColor: "#FFEFE8"}}>
        <p className="f-15 mb-2">Low activity Lawyers</p>
        <h3 className="bold f-20 mb-0">5
        </h3>
      </div>
      <div className="query-box purplebg" style={{backgroundColor: "#E7E7FF"}}>
        <p className="f-15 mb-2">Low Activity Case Managers</p>
        <h3 className="bold f-20 mb-0">3
        </h3>
      </div>
      <div className="query-box purplebg" style={{backgroundColor: "#FFF9F6"}}>
        <p className="f-15 mb-2">Total Appointments Scheduled</p>
        <h3 className="bold f-20 mb-0">3
        </h3>
      </div> */}
    </div>
  );
};
