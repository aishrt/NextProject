import React, { useState } from "react";
import { Metadata } from "next";
import "../../expert/expert.css";
import Notifications from "@/app/container/notifications/page";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Generated by create next app",
};

export default function Notification() {
  return (
    <>
    <Notifications  role={"expert"} />
  </>
  );
}
