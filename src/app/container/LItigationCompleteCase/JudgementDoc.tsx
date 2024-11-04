"use client";

import React, { useEffect, useState } from "react";
import "../../client/client.css";
import {
  Alert,
  CircularProgress,
  Link,
  Snackbar,
  Tooltip,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Child } from "@/types/Child";
import { Button } from "@/components/Form/Button";
import SelectField from "@/components/Form/SelectField";
import Form from "@/components/Form/Form";
import { z } from "zod";
import { useHookForm } from "@/hooks/useHookForm";
import { axios } from "@/utils/axios";
import LoadingButton from "@mui/lab/LoadingButton";
import useSnackbar from "@/hooks/useSnackbar";
import { InputField } from "@/components/Form/InputField";
import { method } from "lodash";
type FormValues = {
  judgementDocument: string;
  awardedAmount: string;
  percentageCharged: string;
};
const schema = z.object({
  judgementDocument: z
    .string({ required_error: "Judgement Document is required" })
    .min(1, "Judgement Document is required"),
  percentageCharged: z
    .string({ required_error: "Percentage Charged is required" })
    .min(1, "Percentage Charged is required")
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
  awardedAmount: z
    .string({ required_error: "Awarded Amount is required" })
    .min(1, "Awarded Amount is required"),
});
function JudgementDoc({
  progress,
  setProgress,
  hide,
  setActiveStep,
  activeStep,
  data,
  role,
  loading,
  case_id,
}: any) {
  const router = useRouter();
  const [loadingBtn, setLoading] = useState(false);
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, register } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId")!;
  useEffect(() => {
    if (data?.judgementDocument) {
      methods.setValue("judgementDocument", data?.judgementDocument);
      methods.setValue("awardedAmount", data?.awardedAmount?.toString());
      methods.setValue(
        "percentageCharged",
        data?.percentageCharged?.toString()
      );

      methods.clearErrors("judgementDocument");
      methods.clearErrors("awardedAmount");
      methods.clearErrors("percentageCharged");
    }
  }, [data]);

  const handleNext = async () => {
    setActiveStep(1);
    return setProgress(40);
    try {
      setLoading(true);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const HandleSubmit = (values: any) => {
    if (!data?.judgementDocument) {
      setLoading(true);

      let payload = {
        case_id,
        judgementDocument: values?.judgementDocument,
        awardedAmount: values?.awardedAmount,
        percentageCharged: values?.percentageCharged,
      };

      axios.post("/api/litigation-complete", payload).then((res: any) => {
        if (res?.success) {
          setLoading(false);
          openSnackbar({
            message: "Judgement Document uploaded successfully",
            type: "success",
          });
          router.back();
        }

        setLoading(false);
      });
    } else {
      if (role == "expert") {
        setActiveStep(1);
      }
      if (data?.step > 2) {
        setActiveStep(1);
      }
    }
  };
  const UploadFile = (e: any) => {
    setLoading(true);
    let file = e.target.files[0];
    let formdata = new FormData();
    formdata.append("file", file);
    axios.post("/api/uploads", formdata).then((res: any) => {
      setLoading(false);
      methods.setValue("judgementDocument", res?.filePath);
      methods.clearErrors("judgementDocument");
    });
  };
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4  gray">Upload Judgement Document</h3>
      <p className="f-14">
        (This step would mirror the previous structure, guiding the user through
        questions specific to spousal support. It would include sections on
        their financial situation, their spouse&apos;s financial situation,
        asset division, etc.)
      </p>
      <div className="assess-link">
        {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <CircularProgress />
          </div>
        ) : (
          <Form<FormValues> methods={methods} onSubmit={HandleSubmit}>
            <div className="row mt-3">
              <div className="col-6 col-md-6 col-xxl-6 mt-3">
                <InputField
                  error={formState.errors["awardedAmount"]}
                  label="Awarded Amount"
                  disabled={hide || data?.awardedAmount}
                  name="awardedAmount"
                  type="number"
                  className="bglight-ip rounded w-100"
                  control={control}
                />
              </div>
              <div className="col-6 col-md-6 col-xxl-6 mt-3">
                <InputField
                  error={formState.errors["percentageCharged"]}
                  label="Percentage Charged"
                  name="percentageCharged"
                  type="number"
                  disabled={hide || data?.percentageCharged}
                  className="bglight-ip rounded w-100"
                  control={control}
                />
              </div>
              <div className="col-6 col-md-6 col-xxl-6 mt-3">
                {!data?.judgementDocument ? (
                  <input
                    onChange={UploadFile}
                    type="file"
                    name=""
                    className="form-control"
                    id=""
                  />
                ) : (
                  <>
                    {" "}
                    <img
                      style={{ width: "200px" }}
                      src="https://cdn-icons-png.flaticon.com/512/180/180327.png"
                      alt=""
                    />
                  </>
                )}
              </div>
              {formState.errors["judgementDocument"] && (
                <p className="text-danger mt-3 form-error form-text">
                  Judgement Document is required
                </p>
              )}
              {data?.judgementDocument && (
                <div className="agree-btn mt-4 text-center d-flex justify-content-start align-items-center gap-3">
                  <Button
                    variant="contained"
                    onClick={() => {
                      let BASE_URL = process.env.NEXT_PUBLIC_PDF_URL;
                      let a = document.createElement("a");
                      a.href = `${BASE_URL}${data?.judgementDocument}`;
                      a.target = "__blank";
                      a.click();
                    }}
                    className="green-btn"
                  >
                    View Document
                  </Button>
                </div>
              )}
            </div>

            <div className="col-12 text-center mt-4">
              <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
                <LoadingButton
                  variant="contained"
                  loading={loadingBtn}
                  type="submit"
                  className="green-btn"
                  onClick={() => {
                    if (data?.judgementDocument) {
                      handleNext();
                    }
                  }}
                >
                  <span className="f-16">
                    {data?.judgementDocument ? "Next" : "Submit"}
                  </span>
                </LoadingButton>
              </div>
            </div>
          </Form>
        )}
        {/* {data?.approvedAmount || role!=='expert' && (
          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Button
                variant="contained"
                size="lg"
                type="submit"
                className="green-btn"
                onClick={() => handleNext()}
              >
                <span className="f-16">Next</span>
              </Button>
            </div>
          </div>
        )} */}
      </div>
      {/* <div className="assess-link">
        <Form<FormValues> methods={methods} onSubmit={HandleSubmit}>
          <div className="row mt-3"></div>

          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Tooltip
                title={`${
                  data?.step < 2 && role != "expert"
                    ? "Expert has not updated Pricing details yet."
                    : ""
                }`}
              >
                <LoadingButton
                  variant="contained"
                  loading={loading}
                  type="submit"
                  className="green-btn"

                  // onClick={() => handleNext()}
                >
                  <span className="f-16">
                    {!data?.method && role == "client" ? "Submit" : "Next"}
                  </span>
                </LoadingButton>
              </Tooltip>
            </div>
          </div>
        </Form>
    
      </div> */}
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
}

export default JudgementDoc;
