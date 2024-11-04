"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { CaseApiResponse, Cases } from "@/types/Cases";
import "../../../client/client.css";
import { upperFirst } from "lodash";
import { CircularProgress } from "@mui/material";
import moment from "moment";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";

export const CasesTable = ({
  data,
  setPage,
  caseLoading,
}: {
  data: CaseApiResponse | undefined;
  setPage: any;
  caseLoading: any;
}) => {
  const router = useRouter();
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
                        {moment(updatedAt).format("hh:mm a")}
                      </span>
                    </div>
                  </span>
                );
              },
            },
            {
              field: "_id",
              title: "",
              Cell({ entry: { _id } }) {
                return (
                  <Button
                    className="expert-btn f-14 py-2"
                    onClick={() =>
                      router.push(`/lawyer/case-overview?id=${_id}`)
                    }
                  >
                    View{" "}
                  </Button>
                );
              },
            },
          ]}
        />
      )}
    </>
  );
};
