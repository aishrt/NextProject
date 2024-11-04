import React from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import "../../client/client.css";
import Cases from "@/app/container/cases/page";

export default function CasesList() {
  return (
    <ContentWrapper>
      <div className="main-content client-docs">
        <div className="top-br d-flex justify-content-between align-items-center">
          {/* <Button className="client-btn f-14 py-3" variant="contained" size="lg">Create New Case</Button> */}
        </div>
        <div className="res-table-box">
          <div className="table-responsive mt-4">
            <Cases role="lawyer" />
          </div>
        </div>
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
