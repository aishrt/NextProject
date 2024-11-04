"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import "../../admin/admin.css";
import eye from "@/assets/eye.png";
import { useTheme } from "@mui/material/styles";
import { useRouter } from "next/navigation";
import Image from "next/image";
import moment from "moment";
import { useLawyerDocs } from "@/queries/lawyerDocs";

const TableLoad = () => {
  const [page, setPage] = useState(1);
  const { data, refetch, isLoading } = useLawyerDocs({
    page: page.toString(),
  });
  console.log(data);
  const router = useRouter();
  const theme = useTheme();

  useEffect(() => {
    refetch();
  }, [page]);

  return (
    <div className="cases-list-table expert-table">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <Table<any>
          data={data?.data ?? []}   
          currentPage={data?.currentPage ?? 1}
          totalEntries={data?.totalEntries ?? 10}
          handlePageChange={(e, page) => {
            console.log(page);
            setPage(page);
          }}
          columns={[
            {
              field: "name",
              title: "Name",
              Cell({ entry: { name } }) {
                return <span>{name}</span>;
              },
            },
            {
              field: "email",
              title: "Email",
              Cell({ entry: { email } }) {
                return <span>{email}</span>;
              },
            },
            {
              field: "docStatus",
              title: "Doc Status",
              Cell({ entry: { docStatus } }) {
                return <span>{docStatus ?? "pending"}</span>;
              },
            },
            {
              field: "createdAt",
              title: "Joined On",
              Cell({ entry: { createdAt } }) {
                return <span>{moment(createdAt).format("DD MMM YYYY")}</span>;
              },
            },
            {
              field: "actions",
              title: "Action",
              Cell({ entry: { _id } }) {
                return (
                  <span className="admin-table-btns d-flex gap-2 cursor-pointer">
                    <span
                      className="cursor-pointer"
                      onClick={() => router.push(`/admin/lawyer-docs/${_id}`)}
                    >
                      <Image src={eye} alt="" className="" />
                    </span>
                  </span>
                );
              },
            },
          ]}
        />
      )}
    </div>
  );
};

export default TableLoad;
