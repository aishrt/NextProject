import { Metadata } from "next";
import React, { useState } from "react";
import "../../admin/admin.css";
import Content from "./_Content";

export const metadata: Metadata = {
  title: "Terms&Conditions",
  description: "Generated by create next app",
};

export default function PrivacyPolicy() {
  return (
    <div className="main-content expert-cases">
      <div className="top-br">
        <h2 className="f-24 pb-3">Terms & Conditions</h2>
      </div>

      <div className="white-card rounded-lg profile-exp-docs p-4 privacy-forms">
        <Content />
      </div>
    </div>
  );
}