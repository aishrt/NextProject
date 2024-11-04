"use client";

import React, { useState } from "react";
import Image from "next/image";
import send from "@/assets/send.png";
import arrow from "@/assets/arrow-lg.png";
import "../../../client/client.css";

export const Query = () => {
  return (
    <div className="for-query liti-finance my-4 d-flex flex-row-wrap">
      <div className="query-box yellowbg" style={{backgroundColor: "#FFF3D6"}}>
        <p className="f-14 mb-2"><Image  className="send-icon" src={send} alt="send" /> Send Message</p>
        <h3 className="bold f-20 mb-0">New Message <Image  className="arrow-lg" src={arrow} alt="arrow" />
        </h3>
      </div>
      <div className="query-box greenbg" style={{backgroundColor: "#D6F4E5"}}>
        <p className="f-14 mb-2"><Image  className="send-icon" src={send} alt="send" /> Upload</p>
        <h3 className="bold f-20 mb-0">File <Image  className="arrow-lg" src={arrow} alt="arrow" />
        </h3>
      </div>
      <div className="query-box pinkbg" style={{backgroundColor: "#FFEFE8"}}>
        <p className="f-14 mb-2"><Image  className="send-icon" src={send} alt="send" /> Schedule</p>
        <h3 className="bold f-20 mb-0">Meeting <Image  className="arrow-lg" src={arrow} alt="arrow" />
        </h3>
      </div>
      <div className="query-box purplebg" style={{backgroundColor: "#E7E7FF"}}>
        <p className="f-14 mb-2"><Image  className="send-icon" src={send} alt="send" /> Get</p>
        <h3 className="bold f-20 mb-0">Notification<Image  className="arrow-lg" src={arrow} alt="arrow" />
        </h3>
      </div>
      <div className="query-box purplebg" style={{backgroundColor: "#D8F1FF"}}>
        <p className="f-14 mb-2"><Image  className="send-icon" src={send} alt="send" /> Ask Question</p>
        <h3 className="bold f-20 mb-0">FAQ’s<Image  className="arrow-lg" src={arrow} alt="arrow" />
        </h3>
      </div>
      <div className="query-box purplebg" style={{backgroundColor: "#FFE1FC"}}>
        <p className="f-14 mb-2"><Image  className="send-icon" src={send} alt="send" /> Change</p>
        <h3 className="bold f-20 mb-0">Setting<Image  className="arrow-lg" src={arrow} alt="arrow" />
        </h3>
      </div>
    </div>
  );
};
