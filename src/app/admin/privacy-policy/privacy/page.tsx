import { Metadata } from "next";
import React, { useState } from "react";
import "../../../admin/admin.css";
import Privacy from "./_PrivacyForm";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Generated by create next app",
};

export default function PrivacyPolicy() {
  return (
    <div className="main-content expert-cases">
      <div className="top-br">
        <h2 className="f-24 pb-3">Privacy Policy</h2>
      </div>
      <div className="white-card rounded-lg profile-exp-docs p-4 privacy-forms">
        <Privacy />
      </div>
    </div>
  );
}
