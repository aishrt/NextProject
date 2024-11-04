"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
import "../../../admin/admin.css";
import Link from "next/link";
import "./style.css";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { User, UserApiResponse } from "@/types/User";
import { axios } from "@/utils/axios";
// import axios from "";
const QuestionForm = ({ data }: { data: UserApiResponse | undefined }) => {
  const router = useRouter();
  const [QuestionData, setQustionData] = useState([{ answer: "", _id: "" }]);
  const [form, setform] = useState({ question: "", limit: 0, _id: "" });
  const [loadingData, setDataLoading] = useState(false);
  const [caseData, setCaseData] = React.useState({ _id: "", progress: "" });
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [page, setPage] = useState(1);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const formHandler = (e: any, itm: any, i: any) => {
    const arry = [...QuestionData];
    arry[i]["answer"] = e.target.value;
    arry[i]["_id"] = itm?._id;

    setQustionData(arry);
  };
  const InputHandler = (e: any) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const HandleSubmit = (e: any) => {
    e.preventDefault();
    axios
      .post("/api/cer-question/edit-question", {
        _id: form?._id,
        question: form?.question,
        limit: form?.limit,
      })
      .then((res: any) => {
        if (res.status == 200) {
          router.push("/admin/cer-questions");
        }
      });
  };
  useEffect(() => {
    if (data?.data) {
      setform({ ...form, ...data?.data });
    }
  }, [data]);

  return (
    <div className="cases-list-table expert-table">
      <form onSubmit={HandleSubmit}>
        <div className="question-edit-form">
          <div className="graph_dev">
            <h6 className="d-block">Question</h6>

            <input
              required
              className="form-control graph_input"
              name="question"
              value={form?.question}
              onChange={InputHandler}
              type="text"
              placeholder=""
            />
          </div>
          <div className="graph_dev mt-3">
            <h6 className="d-block">Limit</h6>
            <input
              required
              className="form-control graph_input"
              value={form?.limit}
              name="limit"
              onChange={InputHandler}
              type="number"
              placeholder=""
            />
          </div>
        </div>
        <div style={{ width: "20%", display: "flex" }} className="mt-5">
          <button
            className="client-btn text-white"
            type="reset"
            onClick={() => {
              router.back();
            }}
          >
            Back
          </button>
          <button className="submit-btn rounded bg-transparent ms-2" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuestionForm;
