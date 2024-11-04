"use client";

import React, { useEffect, useState } from "react";
import { SidebarComponent } from "./Sidebar/SidebarComponent";
import TopBar from "./TopBar/TopBar";
import Image from "next/image";
import chat from "@/assets/chatIcn.png";
import axios from "axios";
import { useSession } from "next-auth/react";

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);
  const [chatCount, setchatCount] = React.useState(0);
  const { data: session } = useSession();
  const GetUnseenCount = () => {
    axios.post("/api/chat/unseen").then((res: any) => {
      let val = res?.data?.data?.count[0]?.total;
      setchatCount(val);
      // countdata?.count = res?.data?.data?.count;
    });
  };
  useEffect(() => {
    GetUnseenCount();
  }, [session]);
  return (
    <div
      className="clien-main-side"
      style={{
        display: "flex",
      }}
    >
      <SidebarComponent
        toggled={toggled}
        setToggled={setToggled}
        chatCount={chatCount}
        setBroken={setBroken}
      />
      <main className="client-main">
        <TopBar toggled={toggled} setToggled={setToggled} broken={broken} />
        <div
          className="client-flow"
          style={{ height: "90vh", overflow: "auto" }}
        >
          {children}
        </div>
        <div
          className=""
          style={{ marginLeft: "93%", marginBottom: "2px", position: "sticky" }}
        >
          <Image
            className="float-right"
            src={chat}
            alt="image"
            width={50}
            height={50}
          />
        </div>
      </main>
    </div>
  );
};

export default ClientLayout;
