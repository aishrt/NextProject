'use client'

import React from "react";
import { SidebarComponent } from "./Sidebar/SidebarComponent";
import TopBar from "./TopBar/TopBar";
import Image from "next/image";
import chat from "@/assets/chatIcn.png";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [toggled, setToggled] = React.useState(false);
  const [broken, setBroken] = React.useState(false);

  return (
    <div
     className="clien-main-side admin-side"
      style={{
        display: "flex",
      }}
    >
      <SidebarComponent
        toggled={toggled}
        setToggled={setToggled}
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

export default AdminLayout;
