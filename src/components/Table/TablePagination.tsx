"use client";
import React from "react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const TablePagination = ({
  totalEntries,
  currentPage,
  dataPerPage=20,

}: {
  totalEntries: number;
  currentPage: number;
  dataPerPage:number;

}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(totalEntries / dataPerPage);
  const startPage = (currentPage - 1) * dataPerPage + 1;
  const isLastPage = totalPages <= currentPage;
  const endPage = isLastPage ? totalEntries : currentPage * dataPerPage;

  const handlePageChange = (
    e: React.ChangeEvent<unknown>,
    toGoPage: number
  ) => {
    const current = new URLSearchParams(Array.from(searchParams?.entries() ?? [])); // -> has to use this form
    current.set("page", toGoPage.toString());
    const search = current.toString();
    const query = search ? `?${search}` : "";
    window.location.href = `${pathname}${query}`;

    // router.push(`${pathname}${query}`);
  };

  return (
    <div className="d-flex justify-content-between m-3 pagination ">
      <Stack spacing={2}>
        <Pagination
          onChange={handlePageChange}
          count={totalPages}
          page={currentPage}
          variant="outlined"
          shape="circular"
        />
      </Stack>
      <span>
        Showing {startPage} to {endPage} of {totalEntries} entries
      </span>
    </div>
  );
};

export default TablePagination;
