"use client";

import React, { useEffect } from "react";
import { SidebarComponent } from "./Sidebar/SidebarComponent";
import TopBar from "./TopBar/TopBar";
import { useSession } from "next-auth/react";
import axios from "axios";
const LawyerLayout = ({ children }: { children: React.ReactNode }) => {
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);
  const { data: session } = useSession();
  const [chatCount, setchatCount]: any = React.useState(0);

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
      className="clien-main-side expert"
      style={{
        display: "flex",
      }}
    >
      <SidebarComponent
        toggled={toggled}
        chatCount={chatCount}
        setToggled={setToggled}
        setBroken={setBroken}
      />
      <main className="client-main expert">
        <TopBar toggled={toggled} setToggled={setToggled} broken={broken} />
        <div
          className="client-flow exp"
          style={{ height: "90vh", overflow: "auto" }}
        >
          {children}
        </div>
      </main>
    </div>
  );
};

export default LawyerLayout;
