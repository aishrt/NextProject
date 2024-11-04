"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../admin/admin.css";
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
import { CgUnblock } from "react-icons/cg";

const LawyerTable = ({
  data,
  refetch,
  page,
  setPage,
  filter,
  setFilter,
}: {
  data: any;
  filter: any;
  setFilter: any;
  refetch: any;
  page: any;
  setPage: any;
}) => {
  console.log(data?.data);

  const router = useRouter();
  const [loadingData, setDataLoading] = useState(false);
  const [caseData, setCaseData] = React.useState({ _id: "", progress: "" });
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const [ListData, setListdata] = useState({
    data: [],
    currentPage: 0,
    totalEntries: 0,
  });
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  // const [page, setPage] = useState(1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (data) {
      setListdata(data);
    }
  }, [data]);

  const BlockUser = (id: any, isBlock: boolean) => {
    axios
      .post(`/api/admin/lawyers/update`, { id: id, isBlock })
      .then((res: any) => {
        if (res.success) {
          openSnackbar({
            message: "User Updated successully",
            type: "success",
          });
          refetch();
        }
      });
  };
  const DeleteUser = (id: any, isDeleted: boolean) => {
    axios
      .post(`/api/admin/lawyers/update`, { id: id, isDeleted })
      .then((res: any) => {
        if (res.success) {
          openSnackbar({
            message: "User Deleted successully",
            type: "success",
          });
          refetch();
        }
      });
  };

  return (
    <div className="cases-list-table expert-table">
      <div className="col-3 mb-3">
        <input
          onChange={(e: any) => {
            setFilter({ ...filter, search: e.target.value });
          }}
          placeholder="Search Here"
          type="text"
          className="form-control"
          name="search"
          id=""
        />
      </div>
      <Table<User>
        data={ListData?.data ?? []}
        currentPage={ListData?.currentPage ?? 1}
        totalEntries={ListData?.totalEntries ?? 10}
        handlePageChange={(e, page) => {
          console.log(page);
          setPage(page);
          setFilter({ ...filter, page: page });
        }}
        columns={[
          {
            field: "firstName",
            title: "Name",
            Cell({ entry: { name } }) {
              return <span>{name || "--"}</span>;
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
            field: "location",
            title: "Address",
            Cell({ entry: { location } }) {
              return <span>{location ?? "NA"}</span>;
            },
          },

          // {
          //   field: "_id",
          //   title: "No of Prelitigation  Registered",
          //   Cell({ entry }) {
          //     return <span>10</span>;
          //   },
          // },
          // {
          //   field: "_id",
          //   title: "No of litigation  Registered",
          //   Cell({ entry: {} }) {
          //     return <span> 21</span>;
          //   },
          // },
          // {
          //   field: "_id",
          //   title: "Total Active Cases",
          //   Cell({ entry: {} }) {
          //     return <span> 18</span>;
          //   },
          // },

          {
            field: "actions",
            title: "Action",
            Cell({ entry: { _id, isDeleted, isBlock } }: any) {
              return (
                <span className="admin-table-btns d-flex gap-2">
                  <span onClick={() => BlockUser(_id, isBlock ? false : true)}>
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
                    onClick={() => router.push(`/admin/user-details?id=${_id}`)}
                  >
                    <Image src={view} alt="" className="" />
                  </span>
                  <span
                    onClick={() => DeleteUser(_id, isDeleted ? false : true)}
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

export default LawyerTable;
