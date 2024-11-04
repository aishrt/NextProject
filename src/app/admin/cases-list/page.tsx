import React from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import { Metadata } from "next";
import "../../expert/expert.css";
import { Button } from "@/components/Form/Button";
import Cases from "@/app/container/cases/page";

export const metadata: Metadata = {
  title: "Cases",
  description: "Generated by create next app",
};

export default async function CasesList() {
  return (
    <ContentWrapper>
      <div className="main-content">
        {/* <Cases role="expert" /> */}
        <Cases role="admin" />
      </div>

      {/*         
        <Paper
          component="form"
          sx={{
            p: "2px 4px",
            display: "flex",
            alignItems: "center",
            width: 400,
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Cases"
            inputProps={{ "aria-label": "search cases" }}
          />
          <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper> */}
    </ContentWrapper>
  );
}