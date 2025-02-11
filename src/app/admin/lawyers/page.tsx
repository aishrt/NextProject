"use client";
import { PaginateData } from "@/types/Paginate";

import React, { useEffect, useState } from "react";
import "../../admin/admin.css";
import { useUserQuery } from "@/queries/users";
import { useRouter } from "next/navigation";
import { useTheme } from "@emotion/react";
import axios from "axios";
import useDebounce from "@/queries/DebounceHook";
import LawyerTable from "./_LawyerTable";
import { useLawyerListQuery } from "@/queries/lawyerList";

export default function Lawyers() {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const theme = useTheme();
  const [filter, setFilter] = useState({ page: 1, search: "" });
  const DebounceSearch = useDebounce(filter.search, 500);
  const { data, refetch, isLoading } = useLawyerListQuery({
    page: page.toString(),
    search: filter.search.toString(),
    isBlock: false,
    isDeleted: false,
  });

  useEffect(() => {
    refetch();
  }, [page]);
  useEffect(() => {
    if (DebounceSearch) {    
      refetch();
    }
  }, [DebounceSearch]);

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Lawyer List</h2>
      </div>
      <div className="res-table-box">
        <div className="table-responsive mt-4">
          <LawyerTable
            refetch={refetch}
            filter={filter}
            setFilter={setFilter}
            setPage={setPage}
            page={page}
            data={data}
          />
        </div>
      </div>
    </div>
  );
}
