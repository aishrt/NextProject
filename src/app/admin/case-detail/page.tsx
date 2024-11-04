import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import { Metadata } from "next";
import { Button, Link } from "@mui/material";

import CaseDetail from "@/app/container/case-details/page";

export const metadata: Metadata = {
  title: "Cases-Detail",
  description: "Generated by create next app",
};

export default function CasesDetail() {
  return (
    <ContentWrapper>
      <div className="row mt-4">
        <div className="col-12 ">
          <CaseDetail />
        </div>
      </div>
    </ContentWrapper>
  );
}