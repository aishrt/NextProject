"use client";

import React, { useState } from "react";
import Image from "next/image";
import send from "@/assets/send.png";
import arrow from "@/assets/arrow-lg.png";
import "../../../admin/admin.css";

export const Query = () => {
  return (
    <div className="for-query my-4 d-flex flex-row-wrap">
      <div className="query-box yellowbg" style={{backgroundColor: "#FFF3D6"}}>
        <p className="f-14 mb-2"><Image  className="send-icon" src={send} alt="send" /> Send Message</p>
        <h3 className="bold f-20 mb-0">For Query <Image  className="arrow-lg" src={arrow} alt="arrow" />
        </h3>
      </div>
      <div className="query-box greenbg" style={{backgroundColor: "#D6F4E5"}}>
        <p className="f-14 mb-2"><Image  className="send-icon" src={send} alt="send" /> Upload</p>
        <h3 className="bold f-20 mb-0">Document <Image  className="arrow-lg" src={arrow} alt="arrow" />
        </h3>
      </div>
      <div className="query-box pinkbg" style={{backgroundColor: "#FFEFE8"}}>
        <p className="f-14 mb-2"><Image  className="send-icon" src={send} alt="send" /> Schedule</p>
        <h3 className="bold f-20 mb-0">Appointment <Image  className="arrow-lg" src={arrow} alt="arrow" />
        </h3>
      </div>
      <div className="query-box purplebg" style={{backgroundColor: "#E7E7FF"}}>
        <p className="f-14 mb-2"><Image  className="send-icon" src={send} alt="send" /> Submit</p>
        <h3 className="bold f-20 mb-0">The Claim <Image  className="arrow-lg" src={arrow} alt="arrow" />
        </h3>
      </div>
    </div>
  );
};
