"use client";

import React, { useEffect, useState } from "react";
import Table from "@/components/Table/Table";
import { useCases } from "@/queries/cases";
import view from "@/assets/view.png";
import del from "@/assets/delete.png";
import block from "@/assets/block.png";
// import "../../admin/admin.css";
import "../../expert/expert.css";

import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";

// import "./style.css";
import Image from "next/image";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";
import moment from "moment";
import { User, UserApiResponse } from "@/types/User";
import axios from "axios";
import { z } from "zod";
import { useHookForm } from "@/hooks/useHookForm";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import LoadingButton from "@mui/lab/LoadingButton";
import TextAreaField from "@/components/Form/TextArea";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import success from "@/assets/congo.png";
interface QuestionType {
  answer: string;
}
interface QuestionsArray {
  answer: QuestionType[];
}
type FormValues = {
  percentage_change: string;
  questions: QuestionsArray[];
  court_amount: string;

  winning_percentage: string;
  description: string;
};
const schema = z.object({
  // percentage_change: z.string({
  //   required_error: "Percentage Change is required",
  // }),
  winning_percentage: z
    .string({
      required_error: "Winning Percentage is required",
    })
    .min(1, "Winning Percentage is required")
    .refine(
      (val) => {
        const percnt = parseInt(val, 10);
        return !isNaN(percnt) && percnt >= 0 && percnt <= 100;
      },
      {
        message: "Percentage should be between 0 and 100",
      }
    )
    .transform((value) => parseInt(value, 10)),
    
  questions: z.array(
    z.object({
      answer: z
        .string({ required_error: "Answer is required" })
        .min(1, "Answer is required"),
    })
  ),

  // court_amount: z.string({ required_error: "Court Amount is required" }),
  description: z.string({
    required_error: "Description is required",
  }),
});

const QestionTable = ({
  data,
  case_id,
}: {
  data: UserApiResponse | undefined;
  case_id: any;
}) => {
  const [show, setShow] = useState(false);
  const handleClickShow = () => {
    setShow(true);
  };
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleHide = () => {
    setShow(false);
  };

  const router = useRouter();
  const [QuestionData, setQustionData] = useState([
    { answer: "", _id: "", isLock: false },
  ]);

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const { formState, control, register } = methods;
  const [form, setform] = useState({
    winning_percentage: 0,
    court_amount: 0,
    percentage_change: 0,
  });

  const LockHandler = (e: any, itm: any, i: any) => {
    const arry = [...QuestionData];
    arry[i]["isLock"] = e;
    console.log(arry);
    setQustionData(arry);
  };
  const InputHandler = (e: any, i: any) => {
    const arry = [...QuestionData];
    arry[i]["answer"] = e;
    setQustionData(arry);
  };

  const HandleSubmit = (values: FormValues) => {
    setLoading(true);

    let value = {
      questions: QuestionData,
      case_id,
      // court_amount: values?.court_amount,
      winning_percentage: values?.winning_percentage,
      description: values?.description,
      // percentage_change: values?.percentage_change,
    };
    axios.post("/api/cer-report/add", value).then((res: any) => {
      if (res?.status == 200) {
        setLoading(false);
        setShow(true);
        // router.push("/expert/dashboard");
      }
    });
  };
  useEffect(() => {
    let arr: any = [];

    data?.data?.map((itm: any) => {
      arr.push({
        answer: "",
        _id: itm?._id,
        question: itm?.question,
        limit: itm?.limit,
      });
    });
    setQustionData(arr);
  }, [data]);

  return (
    <div className="evaluation-rrt">
      <div className="row mt-0">
        <Form<FormValues> onSubmit={HandleSubmit} methods={methods}>
          <div className="col-12 col-md-10 ">
            {QuestionData?.map((itm: any, i: any) => {
              return (
                <div key={i} className="graph_dev mt-0 mb-4">
                  <h3 className="f-16 dark semi-bold mt-4 pb-1">
                    {itm?.question}
                  </h3>

                  <div className="bglght border rounded-radius client-address p-3">
                    <div className="row align-items-center">
                      <div className="col-12 col-md-8 col-lg-9">
                        <InputField
                          key={i}
                          //label={itm?.question}
                          placeholder="Answer"
                          registration={register(
                            `questions.[${i}].answer` as const
                          )}
                          error={formState.errors?.questions?.[i]?.answer}
                          control={control}
                          name={`answer_${i}`}
                          emitChange={(e: any) => {
                            if (e == "") {
                              methods.setError(`questions.[${i}].answer`);
                            } else {
                              methods.clearErrors(`questions.[${i}].answer`);
                            }

                            InputHandler(e, i);
                          }}
                        />
                      </div>
                      <div className="col-12 col-md-4 col-lg-3">
                        <div className="success-rate-btns d-flex  align-items-center justify-content-end">
                          {itm?.isLock ? (
                            <FaLock
                              onClick={() => {
                                LockHandler(false, itm, i);
                              }}
                              style={{ marginLeft: "5px" }}
                            />
                          ) : (
                            <FaLockOpen
                              onClick={() => {
                                LockHandler(true, itm, i);
                              }}
                              style={{ marginLeft: "5px" }}
                            />
                          )}
                          <span className="ms-3 f-16 dark semi-bold">
                            Limit : {itm?.limit}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <InputField
                    key={i}
                     label={itm?.question}
                    placeholder="Answer"
                    control={control}
                    name={`answer_${i}`}
                    emitChange={(e: any) => {
                      InputHandler(e, i);
                    }}
                  /> */}
                  {/* {itm?.isLock ? (
                    <FaLock
                      onClick={() => {
                        LockHandler(false, itm, i);
                      }}
                      style={{ marginLeft: "5px" }}
                    />
                  ) : (
                    <FaLockOpen
                      onClick={() => {
                        LockHandler(true, itm, i);
                      }}
                      style={{ marginLeft: "5px" }}
                    />
                  )} */}
                  {/* <span className="ms-5">Limit : {itm?.limit}</span> */}
                </div>
              );
            })}

            <div className="row winning-percentage">
              <h3 className="f-16 dark semi-bold mt-4 pb-1">
                Winning Percentage
              </h3>
              <div className="col-12 col-md-10">
                <InputField
                  // label="Winning Percentage"
                  error={formState.errors["winning_percentage"]}
                  name="winning_percentage"
                  control={control}
                  type={"number"}
                />
              </div>

              <h3 className="f-16 dark semi-bold mt-4 pb-1">Description </h3>

              <div className="col-12 col-md-10">
                <TextAreaField
                  name="description"
                  //  label="Description"
                  placeholder="Description"
                  error={formState.errors["description"]}
                  control={control}
                  variant="filled"
                />
              </div>
            </div>

            {/* <div className="col-12 col-md-6 mt-3">
          <InputField
            label="Amount Used by Court"
            error={formState.errors["percentage_change"]}
            name="percentage_change"
            control={control}
            type={"number"}
          />
        </div> */}
            {/* <div className="col-12 col-md-6 mt-3">
          <InputField
            label="Percentage Change"
            error={formState.errors["court_amount"]}
            name="court_amount"
            control={control}
            type={"number"}
          />
        </div> */}
            <div className="col-12 col-md-6 mt-4 text-left">
              <LoadingButton
                loading={loading}
                variant="contained"
                type="submit"
                size="large"
              >
                <span>Prepare Graph</span>
              </LoadingButton>
            </div>
          </div>
        </Form>
      </div>

      {/* Success Modal */}
      <Dialog
        fullScreen={fullScreen}
        open={show}
        //onClose={handleHide}
        className="assgn-succes-modal success"
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
            {/* <CloseIcon /> */}
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <div className="assign-lawyer-success text-center">
            <div className="">
              <Image
                src={success}
                className="assign-trf-sucess"
                alt="success"
              />
              <div className="assign-law-cnt mt-4">
                <h4 className="f-24 semi-bold">Success!</h4>
                <p className="f-16 gray semi-bold">
                  Your graphs have been created sucessfully
                </p>
              </div>
              <div className="text-center mt-4 pb-4">
                <Button
                  variant="contained"
                  className="expert-btn px-5"
                  onClick={() => {
                    router.replace(`/expert/eval-report?id=${case_id}`);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QestionTable;
