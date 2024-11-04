"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../admin/admin.css";
import { CgUnblock } from "react-icons/cg";

import Link from "next/link";
import Image from "next/image";
import { Alert, Button, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { User, UserApiResponse } from "@/types/User";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";

const ManagersTable = ({ data }: { data: UserApiResponse | undefined }) => {
  const router = useRouter();
  const [loadingData, setDataLoading] = useState(false);
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const BlockManager = (id: any, isBlock: boolean) => {
    axios.post(`/api/admin/managers`, { id: id, isBlock }).then((res: any) => {
      if (res.success) {
        openSnackbar({
          message: "Expert Updated successully",
          type: "success",
        });
        router.refresh()
      }
    });
  };
  const DeleteManager = (id: any, isDeleted: boolean) => {
    axios
      .post(`/api/admin/managers`, { id: id, isDeleted })
      .then((res: any) => {
        if (res.success) {
          openSnackbar({
            message: "Expert Deleted successully",
            type: "success",
          });
          router.refresh()
        }
      });
  };
  return (
    <div className="cases-list-table expert-table">
      <Table<User>
        data={data?.data ?? []}
        currentPage={data?.currentPage ?? 1}
        totalEntries={data?.totalEntries ?? 10}
        handlePageChange={(e, page) => {
          console.log(page);
          setPage(page);
        }}
        columns={[
          {
            field: "firstName",
            title: "Name",
            Cell({ entry: { firstName } }) {
              return <span>{firstName||"--"}</span>;
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
            field: "phoneNumber",
            title: "Phone Number",
            Cell({ entry: { phoneNumber } }) {
              return <span>{phoneNumber}</span>;
            },
          },
          {
            field: "_id",
            title: "Total Active Cases",
            Cell({ entry: {} }) {
              return <span> 18</span>;
            },
          },

          {
            field: "_id",
            title: "Expertise",
            Cell({ entry: {} }) {
              return <span> Criminal Cases</span>;
            },
          },

          {
            field: "_id",
            title: "Total Prelitigation  Cases",
            Cell({ entry }) {
              return <span>10</span>;
            },
          },
          {
            field: "_id",
            title: "Total Litigation  Cases",
            Cell({ entry: {} }) {
              return <span> 21</span>;
            },
          },

          {
            field: "actions",
            title: "Action",
            Cell({ entry: { _id, isBlock, isDeleted } }: any) {
              return (
                <span className="admin-table-btns d-flex gap-2">
                  <span
                    onClick={() => BlockManager(_id, isBlock ? false : true)}
                  >
                    {isBlock ? (
                      <CgUnblock title="Unblock" color="green" size={20} />
                    ) : (
                      <Image
                        title="Block"
                        src={block}
                        alt=""
                        className="block-user"
                      />
                    )}
                  </span>
                  <span
                    onClick={() =>
                      router.push(`/admin/case-manager-details?id=${_id}`)
                    }
                  >
                    <Image src={view} alt="" className="" />
                  </span>
                  <span
                    onClick={() => DeleteManager(_id, isDeleted ? false : true)}
                  >
                    <Image src={del} alt="" className="" />
                  </span>
                </span>
              );
            },
          },
        ]}
      />
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
};

export default ManagersTable;
