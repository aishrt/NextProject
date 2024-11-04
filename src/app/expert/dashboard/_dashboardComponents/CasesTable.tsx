"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { CaseApiResponse, Cases } from "@/types/Cases";
import "../../../client/client.css";
import { upperFirst } from "lodash";
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
          //clientPagination={false}
          dataPerPage={3}
          handlePageChange={(e, page) => {
            console.log(page);
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
              field: "user",
              title: "User Name",
              Cell({ entry: { user } }) {
                return (
                  <span>
                    {upperFirst(
                      user?.firstName + " " + user?.firstName ?? "NA"
                    )}
                  </span>
                );
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
              field: "status",
              title: "Status",
              Cell({ entry: { status } }) {
                return (
                  <span className="pending-status">{upperFirst(status)}</span>
                );
              },
            },
            // {
            //   field: "date",
            //   title: "Last Updated Document",
            //   Cell({ entry }) {
            //     return (
            //       <span>
            //         <div className="date-table">
            //           <span className="d-block">11/01/2022</span>
            //           <span className="dark semi-bold">11:20 am</span>
            //         </div>
            //       </span>
            //     );
            //   },
            // },
            // {
            //   field: "action",
            //   title: "",
            //   Cell({ entry }) {
            //     return <Button className="expert-btn f-14 py-2">View </Button>;
            //   },
            // },
          ]}
        />
      )}
    </>
  );
};
