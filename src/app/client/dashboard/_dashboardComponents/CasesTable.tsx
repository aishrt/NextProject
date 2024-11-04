"use client";

import React, { useState } from "react";
import Table from "@/components/Table/Table";
import { CaseApiResponse, Cases } from "@/types/Cases";
import "../../../client/client.css";
import { upperFirst } from "lodash";
import moment from "moment";
import { CircularProgress } from "@mui/material";

export const CasesTable = ({
  data,
  setPage,
  caseLoading,
}: {
  data: CaseApiResponse | undefined;
  setPage: any;
  caseLoading: any;
}) => {
  return (
    <>
      {caseLoading ? (
        <p className="text-center mt-5">
          <CircularProgress />
        </p>
      ) : (
        <Table<Cases>
          currentPage={data?.currentPage ?? 1}
          totalEntries={data?.totalEntries ?? 3}
          data={data?.data ?? []}
          dataPerPage={3}
          handlePageChange={(e, page) => {
            setPage(page);
          }}
          columns={[
            {
              field: "referenceId",
              title: "Reference Id",
              Cell({ entry: { referenceId } }) {
                return <span>{"#" + referenceId}</span>;
              },
            },
            {
              field: "caseType",
              title: "Case Type",
              Cell({ entry: { caseType } }) {
                return <span>{upperFirst(caseType ?? "NA")}</span>;
              },
            },

            {
              field: "category",
              title: "Case Category",
              Cell({ entry: { category } }) {
                return <span>{category ?? "NA"}</span>;
              },
            },

            {
              field: "lawyer",
              title: "Assigned Lawyer",
              Cell({ entry: { lawyer } }) {
                return (
                  <span>{upperFirst(lawyer?.name) || "Not Assigned"}</span>
                );
              },
            },

            {
              field: "updatedAt",
              title: "Last Updated",
              Cell({ entry: { updatedAt } }) {
                return (
                  <span>
                    <div className="date-table">
                      <span className="d-block">
                        {moment(updatedAt).format("DD/MM/YYYY")}
                      </span>
                      <span className="dark semi-bold">
                        {moment(updatedAt).format("hh:mm A")}
                      </span>
                    </div>
                  </span>
                );
              },
            },

            {
              field: "status",
              title: "Status",
              Cell({ entry: { status } }) {
                return (
                  <span className="pending-status">{upperFirst(status)}</span>
                );
              },
            },
          ]}
        />
      )}
    </>
  );
};
