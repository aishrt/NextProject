"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import message from "@/assets/device-message.png";
import "../../../expert/expert.css";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import moment from "moment";
import { Button } from "@/components/Form/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Cases } from "@/types/Cases";
import CloseIcon from "@mui/icons-material/Close";

const options = [
  { label: "Status", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Active", value: "active" },
  { label: "Resolved", value: "resolved" },
  { label: "Not resolved", value: "notResolved" },
];

const SharedDoc = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [referenceId, setReference] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [lawyer, setLawyer] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [submissionDate, setSubmission] = useState<string>("");
  const [updatedDate, setUpdated] = useState<string>("");
  const [show, setShow] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [subVal, setDateVal] = useState<string>("");
  const [uploadedBy, setUploadedBy] = useState<string>("");
  const [clearFilter, setClearFilter] = useState<boolean>(false);
  const handleHide = () => {
    setShow(false);
  };

  const { data, isLoading, isFetching, refetch } = useCases({
    referenceId,
    name,
    lawyer,
    status,
    submissionDate,
    updatedDate,
    uploadedBy,
    page,
    role: "expert",
  });
  const handleClickShow = () => {
    setShow(true);
  };
  useEffect(() => {
    refetch();
  }, [page, clearFilter, uploadedBy]);

  const handleSearch = () => {
    setClearFilter(false);
    refetch();
  };
  const staticData = [
    {
      referenceId: "",
      f_name: "",
      ph_number: "",
      email: "",
      address: "",
      message: "",
      purpose: "",
      actions: "",
      status: ""
    },
    {
        referenceId: "",
        f_name: "",
        ph_number: "",
        email: "",
        address: "",
        message: "",
        purpose: "",
        actions: "",
        status: ""
      },
  ];
  return (
    <div className="cases-list-table expert-table">
      <div className="doc-filters-form mb-3">
        <div className="row mt-4">
          <div className="col-12 col-md-12">
            <div className="row filter-docs">
              <div className="col-12 col-md-2 mb-3">
                <div className="filter-input">
                  <input
                    type="number"
                    className="form-control filter-ip"
                    placeholder="Reference Id"
                    value={referenceId}
                    onChange={(e) => setReference(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12 col-md-2 mb-3">
                <div className="filter-input">
                  {/* <label className="date-label">Submission Date:</label> */}
                  <input
                    type="date"
                    className="form-control filter-ip"
                    placeholder="Submission Date"
                    value={subVal}
                    onChange={(e) => {
                      let date = e.target.value;
                      setDateVal(date);
                      const [year, month, day] = date.split("-");
                      // return `${day}/${month}/${year}`;
                      setSubmission(`${day}/${month}/${year}`);
                    }}
                  />
                </div>
              </div>
              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <input
                    type="text"
                    className="form-control filter-ip"
                    placeholder="Representative Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-3 mb-3">
                <div className="filter-input">
                  <input
                    type="text"
                    className="form-control filter-ip"
                    placeholder="Assigned Lawyer"
                    value={lawyer}
                    onChange={(e) => setLawyer(e.target.value)}
                  />
                </div>
              </div>

              <div className=" col-12 col-md-2 mb-3 filter-btn">
                <Button
                  variant="contained"
                  size="sm"
                  className="expert-btn"
                  onClick={handleSearch}
                >
                  <span className="f-16">Search</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Table<any>
        clientPagination={false}
        data={staticData}
        columns={[
          {
            field: "f_name",
            title: "Full Name",
            Cell({ entry }) {
              return (
                <span>
                Lorem Ipsum
                </span>
              );
            },
          },
          {
            field: "ph_number",
            title: "Phone Number",
            Cell({ entry }) {
              return (
                <span>
                546575676767
                </span>
              );
            },
          },
          {
            field: "email",
            title: "Email",
            Cell({ entry }) {
              return (
                <span>
                dummy@gmail.com
                </span>
              );
            },
          },
          {
            field: "address",
            title: "Address",
            Cell({ entry: {} }) {
              return (
                <span>
                234 Boston
                </span>
              );
            },
          },
          {
            field: "purpose",
            title: "Purpose",
            Cell({ entry }) {
              return (
                <span>
                 Lorem Ipsum
                </span>
              );
            },
          },
          {
            field: "status",
            title: "Status",
            Cell({ entry }) {
              return (
                <span className="status-pending">
                 Pending
                </span>
              );
            },
          },
          {
            field: "shared_on",
            title: "Shared On",
            Cell({ entry }) {
              return (
                <span>
                 12-01-2023
                </span>
              );
            },
          },
          {
            field: "deadline",
            title: "Deadline",
            Cell({ entry }) {
              return (
                <span>
                 12-01-2023
                </span>
              );
            },
          },
        ]}
        currentPage={data?.currentPage ?? 1}
        totalEntries={data?.totalEntries ?? 10}
        handlePageChange={(e, page) => {
          console.log(page);
          setPage(page);
          refetch();
        }}
      />

      {/*  Modal */}
      <Dialog
        fullScreen={fullScreen}
        open={show}
        onClose={handleHide}
        className="assgn-succes-modal request-modal"
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          <IconButton
            aria-label="close"
            onClick={handleHide}
            sx={(theme) => ({
              position: "absolute",
              right: 8,
              top: 8,
              color: theme.palette.grey[500],
            })}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="assign-lawyer-success text-center">
            <div className="">
              <div className="assign-law-cnt ">
                <h4 className="f-24 semi-bold pb-3">Private Note</h4>
                <p className="f-13 gray text-left mb-1">
                  Add a private message
                </p>
                <form>
                  <textarea
                    className="form-control bggray rounded f-14"
                    rows={4}
                    placeholder="Write Here"
                  ></textarea>
                </form>
              </div>
              <div className="text-center mt-4 pb-4">
                <Button
                  variant="contained"
                  className="expert-btn px-5"
                  onClick={() => {
                    router.push(`/expert`);
                  }}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SharedDoc;
