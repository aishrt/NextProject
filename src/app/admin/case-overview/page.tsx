import React from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import { Metadata } from "next";
import { Button, Link } from "@mui/material";
import "../../client/client.css";
import CaseOverview from "@/app/container/case-overview/page";

export const metadata: Metadata = {
  title: "Cases Summary",
  description: "Generated by create next app",
};

export default async function CasesOverview() {
  return (
    <ContentWrapper>
      <div className="cases-summary-box">
        <div className="row">
          <div className="col-12 ">
            <CaseOverview role="admin" />
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
