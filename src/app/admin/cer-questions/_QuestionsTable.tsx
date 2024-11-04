"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/view.png";
import edit from "@/assets/edit.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../admin/admin.css";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { CerQestionsType, CerQestionsApiResponse } from "@/types/CerQuestions";
import { axios } from "@/utils/axios";

const QuestionsTable = ({
  data,
}: {
  data: CerQestionsApiResponse | undefined;
}) => {
  const router = useRouter();
  const [loadingData, setDataLoading] = useState(false);
  const [caseData, setCaseData] = React.useState({ _id: "", progress: "" });
  const [open, setOpen] = React.useState(false);
  const [ListData, setListData] = useState([]);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const DeleteQuestion = (id: any) => {
    axios
      .post(`/api/cer-question/delete-question?id=${id}`)
      .then((res: any) => {
        if (res?.status == 200) {
          window.location.reload();
        }
      });
  };
  useEffect(() => {
    const res: any = data?.data?.map((itm, i) => {
      return { ...itm, serial: i + 1 };
    });
    setListData(res);
  }, [data]);
  return (
    <div className="cases-list-table expert-table">
      <Table<CerQestionsType>
        data={ListData ?? []}
        currentPage={data?.currentPage ?? 1}
        totalEntries={data?.totalEntries ?? 10}
        handlePageChange={(e, page) => {
          console.log(page);
          setPage(page);
        }}
        columns={[
          // {
          //   field: "serial",
          //   title: "SR No.",
          //   Cell({ entry: { serial } }: any) {
          //     return <span>{serial}</span>;
          //   },
          // },
          {
            field: "question",
            title: "Question",
            Cell({ entry: { question } }) {
              return <span>{question}</span>;
            },
          },
          {
            field: "limit",
            title: "Limit",
            Cell({ entry: { limit } }: any) {
              return <span>{limit}</span>;
            },
          },

          {
            field: "actions",
            title: "Action",
            Cell({ entry: { _id } }: any) {
              return (
                <span className="admin-table-btns d-flex gap-2">
                  <span
                    onClick={() =>
                      router.push(
                        `/admin/cer-questions/edit-question?id=` + _id
                      )
                    }
                  >
                    <Image src={edit} alt="" className="block-user" />
                  </span>
                  <span
                    onClick={() =>
                      router.push(`/admin/cer-questions/details?id=` + _id)
                    }
                  >
                    <Image src={view} alt="" className="" />
                  </span>
                  <span onClick={() => DeleteQuestion(_id)}>
                    <Image src={del} alt="" className="" />
                  </span>
                </span>
              );
            },
          },
        ]}
      />
    </div>
  );
};

export default QuestionsTable;
