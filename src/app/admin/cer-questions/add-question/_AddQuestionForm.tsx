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
import { Alert, Button, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import moment from "moment";
import { User, UserApiResponse } from "@/types/User";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";
import { z } from "zod";
import { useHookForm } from "@/hooks/useHookForm";
import { InputField } from "@/components/Form/InputField";
import LoadingButton from "@mui/lab/LoadingButton";
import Form from "@/components/Form/Form";
import TextAreaField from "@/components/Form/TextArea";
// import axios from "";
type FormValues = {
  question: string;
  limit: string;
};

const schema = z.object({
  question: z
    .string({ required_error: "Question is required" })
    .regex(/^.*\S.*$/, "Question is required")
    .min(1, "Question is required"),
  limit: z
    .string({ required_error: "Limit is required" })
    .min(1, "Limit is required"),
});
const QestionForm = ({ data }: { data: UserApiResponse | undefined }) => {
  const router = useRouter();
  const [QuestionData, setQustionData] = useState([{ answer: "", _id: "" }]);
  const [form, setform] = useState({ question: "", limit: 0 });
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);

  const [loadingData, setDataLoading] = useState(false);
  const [caseData, setCaseData] = React.useState({ _id: "", progress: "" });
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const { openSnackbar, snackProps, alertProps } = useSnackbar();
  const { formState, control } = methods;
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

  const HandleSubmit = (values: any) => {
    setLoading(true);
    axios.post("/api/cer-question/add-question", values).then((res: any) => {
      if (res.status == 200) {
        openSnackbar({
          message: "Question created successully",
          type: "success",
        });
        setLoading(false);

        router.push("/admin/cer-questions");
      }
    });
  };

  return (
    <div className="cases-list-table expert-table">
      <Form<FormValues> onSubmit={HandleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-12 mt-3">
            <TextAreaField
              error={formState.errors["question"]}
              label="Question"
              name="question"
              control={control}
            />
          </div>
          <div className="col-12 col-md-12 mt-3">
            <InputField
              label="Limit"
              type="number"
              error={formState.errors["limit"]}
              name="limit"
              control={control}
            />
          </div>

          <div className="col-12 col-md-6 mt-4 text-right">
            <LoadingButton
              loading={loading}
              variant="contained"
              type="submit"
              size="large"
            >
              <span>{"Create"}</span>
            </LoadingButton>
          </div>
        </div>
      </Form>
      {/* <form onSubmit={HandleSubmit}>
        <div className="flex flex-col mt-5 w-1/2">
          <div className="flex flex-col graph_dev">
            <h6 className="flex">Question</h6>

            <input
              required
              className="form-control graph_input"
              value={form?.question}
              name="question"
              onChange={InputHandler}
              type="text"
              placeholder=""
            />
          </div>
          <div className="flex flex-row graph_dev mt-3">
            <h6 className="flex">Limit</h6>
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
        <div style={{ width: "20%", display: "flex" }} className="mt-5 flex">
          <button
            className="form-control"
            type="reset"
            onClick={() => {
              router.back();
            }}
          >
            Back
          </button>
          <button className="form-control ml-3" type="submit">
            Submit
          </button>
        </div>
      </form> */}
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
};

export default QestionForm;
