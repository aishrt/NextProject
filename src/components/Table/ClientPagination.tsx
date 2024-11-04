"use client";
import React from "react";
import Stack from "@mui/material/Stack";
import Pagination from "@mui/material/Pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const ClientPagination = ({
  totalEntries,
  currentPage,
  handlePageChange,
  dataPerPage,
}: {
  totalEntries: number;
  currentPage: number;
  handlePageChange: (e: React.ChangeEvent<unknown>, toGoPage: number) => void;
  dataPerPage: number;
}) => {
  const totalPages = Math.ceil(totalEntries / dataPerPage);
  const startPage = (currentPage - 1) * dataPerPage + 1;
  const isLastPage = totalPages <= currentPage;
  const endPage = isLastPage ? totalEntries : currentPage * dataPerPage;

  return (
    <div className="d-flex justify-content-between m-3 ">
      <span>
        Showing {startPage} to {endPage} of {totalEntries} entries
      </span>
      <Stack spacing={2}>
        <Pagination
          onChange={handlePageChange}
          count={totalPages}
          page={currentPage}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
    </div>
  );
};

export default ClientPagination;
