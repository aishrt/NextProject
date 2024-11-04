"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import down from "@/assets/down.png";
import view from "@/assets/eye.png";
import "../../admin/admin.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";

const LitigationTable = () => {
  const router = useRouter();
  const [loadingData, setDataLoading] = useState(false);
  const [caseData, setCaseData] = React.useState({ _id: "", progress: "" });
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);

  const { data, refetch, isLoading } = useCases({ page });
  console.log(data?.data);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePreviousCase = () => {
    setOpen(false);
    router.push(
      `create-cases?progress=${caseData.progress}&caseId=${caseData._id}`
    );
  };

  const createNewCase = () => {
    setOpen(false);
    router.push("/client/create-case");
  };

  return (
    <div className="cases-list-table">
      <Table<any>
        data={data?.data ?? []}
        columns={[
          {
            field: "referenceId",
            title: "Reference ID",
            Cell({ entry: { referenceId } }) {
              return <span>{"#" + referenceId}</span>;
            },
          },
          {
            field: "category",
            title: "Category",
            Cell({ entry }) {
              return <span>Civil</span>;
            },
          },
          {
            field: "type",
            title: "Type",
            Cell({ entry }) {
              return <span>Financed Party</span>;
            },
          },
          {
            field: "represent",
            title: "Representative",
            Cell({ entry }) {
              return <span>Directly Affected Party </span>;
            },
          },

          {
            field: "adversary",
            title: "Assigned Lawyer",
            Cell({ entry: {} }) {
              return <span> Jackie Brown</span>;
            },
          },
          {
            field: "case_type",
            title: "Case Type",
            Cell({ entry: {} }) {
              return <span> Litigation</span>;
            },
          },

          {
            field: "createdAt",
            title: "Creation On",
            Cell({ entry: createdAt }) {
              return (
                <span>
                  <div className="date-table">
                    <span className="d-block">
                      {moment(createdAt).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </span>
              );
            },
          },
          {
            field: "updatedAt",
            title: "Last Updated",
            Cell({ entry: updatedAt }) {
              return (
                <span>
                  <div className="date-table">
                    <span className="d-block">
                      {moment(updatedAt).format("DD/MM/YYYY")}
                    </span>
                  </div>
                </span>
              );
            },
          },

          {
            field: "status",
            title: "Status",
            Cell({ entry }) {
              return (
                <span>
                  <span className="pending-status">Pending</span>
                </span>
              );
            },
          },
          {
            field: "actions",
            title: "Action",
            Cell({ entry: { _id } }) {
              return (
                <span className="text-center">
                  {/* <Link href="/client/case-details"> */}
                  <span style={{cursor: "pointer"}}
                    className="text-center"
                    onClick={() => router.push(`/client/litigation-case-details`)}
                  >
                    <Image src={view} alt="" className="m-auto" />
                  </span>
                  {/* </Link> */}
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
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title"></DialogTitle>
        <DialogContent>
          <p className="f-15 gray bold text-center">
            Do you want to continue the previous case or want to create new one
            ?
          </p>
        </DialogContent>
        <DialogActions className="justify-content-center pb-4">
          <Button variant="contained" onClick={handlePreviousCase} autoFocus>
            Continue previous case
          </Button>

          <Button variant="contained" onClick={createNewCase} autoFocus>
            Create new case
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default LitigationTable;
