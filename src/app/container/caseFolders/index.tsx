"use client";

import React, { useEffect, useState, useCallback } from "react";
import FolderIcon from "@/assets/folder-open.png";
import { CircularProgress } from "@mui/material";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
// Debounce utility function
const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timer: NodeJS.Timeout;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

export const CaseFolders = () => {
  const [cases, setCases] = useState<any>([]);
  const [searchTerm, setSearchTerm] = useState<string>(""); // State to hold search term
  const [loading, setLoading] = useState(false);
  const { openSnackbar } = useSnackbar();
  const router = useRouter();
  const { data } = useSession();
  const role = data?.user?.role;

  const getCases = async (search?: string) => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/cases`, {
        params: { search }, // Send search term as query param
      });
      setCases(res?.data ?? []);
      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching cases:", err);
      openSnackbar({ message: err?.message, type: "error" });
    } finally {
    }
  };

  useEffect(() => {
    getCases();
  }, []);

  // Debounced search function (wrapped using useCallback for memoization)
  const debouncedGetCases = useCallback(
    debounce((value: string) => {
      getCases(value); // Trigger search API with debounce
    }, 300),
    []
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    debouncedGetCases(value); // Trigger the debounced search function
  };

  return (
    <div className="case-folders-clinet mt-4">
      <div className="row mb-4">
        <div className="col-12">
          {/* Search input field */}
          <input
            type="number"
            className="form-control bg-white p-3"
            placeholder="Search by Case ID"
            value={searchTerm}
            onChange={handleSearch} // Handle search input change with debounce
          />
        </div>
      </div>

      {!loading && cases.length === 0 ? (
        <center>
          <p>No active cases found.</p>
        </center>
      ) : (
        <div className="row">
          {loading ? (
            <center>
              <CircularProgress />
            </center>
          ) : (
            <>
              {cases.map((caseItem: any, index: number) => (
                <div
                  key={index}
                  className="col-12 col-md-6 col-xl-3 col-xxl-2 mb-3 cursor-pointer"
                  onClick={() => {
                    router.push(`/${role}/case-documents/${caseItem._id}`);
                  }}
                >
                  <div className="card text-center p-3">
                  
                    <div className="card-body p-0 read-doc-card ">
                    <Image src={FolderIcon} className="first-line:folder-icon-ico" alt=""   />
                      <h5 className="card-title f-14 mb-0">
                        #{caseItem?.referenceId ?? "Unknown"}
                      </h5>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};
