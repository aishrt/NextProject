"use client";

import React, { useEffect, useState } from "react";
import "../../client/client.css";
import { Alert, Link, Snackbar } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Child } from "@/types/Child";
import { Button } from "@/components/Form/Button";
import SelectField from "@/components/Form/SelectField";
import Form from "@/components/Form/Form";
import { z } from "zod";
import { useHookForm } from "@/hooks/useHookForm";
import { InputField } from "@/components/Form/InputField";
import { axios } from "@/utils/axios";
import LoadingButton from "@mui/lab/LoadingButton";
import useSnackbar from "@/hooks/useSnackbar";
type FormValues = {
  awardedAmount: string;
  percentageCharged: string;
};
const schema = z.object({
  awardedAmount: z
    .string({ required_error: "Approved Amount is required" })
    .min(1, "Approved Amount is required"),
  percentageCharged: z
    .string({ required_error: "Client Amount is required" })
    .min(1, "Payment method is required"),
});
function QuitenseReport({
  progress,
  setProgress,
  hide,
  setActiveStep,
  role,
  activeStep,
  data,
  case_id,
}: any) {
  const router = useRouter();
  const [loading, setLoading] = useState({ accept: false, appeal: false });
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, register } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId")!;

  const handleNext = async () => {
    // let previousData: any = localStorage.getItem("quitense");
    // let data = {
    //   ...JSON.parse(previousData),
    //   ...values,
    // };
    // localStorage.setItem("quitense", JSON.stringify(data));
    setActiveStep(2);
    return setProgress(40);
  };

  const HandleSubmit = (status: any) => {
    setLoading({ ...loading, [status]: true });
    if (data?.status) {
      return setActiveStep(2);
    }
    axios
      .post("/api/litigation-complete", { status, case_id })
      .then((res: any) => {
        if (res?.success) {
          setLoading({ ...loading, [status]: true });
          openSnackbar({
            message: "Request status updated successfully",
            type: "success",
          });
          router.back();
        }
      });
  };

  useEffect(() => {
    if (hide) {
      methods.clearErrors("awardedAmount");
      methods.clearErrors("percentageCharged");
    }
    if (data) {
      methods.setValue("awardedAmount", data?.awardedAmount?.toString());
      methods.setValue(
        "percentageCharged",
        data?.percentageCharged?.toString()
      );
    }
  }, [hide, data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4  gray">Update Request Status</h3>
      <p className="f-14">
        (This step would mirror the previous structure, guiding the user through
        questions specific to spousal support. It would include sections on
        their financial situation, their spouse&apos;s financial situation,
        asset division, etc.)
      </p>
      <div className="assess-link">
        <Form<FormValues>
          methods={methods}
          onSubmit={(e: any) => {
            console.log(e);
          }}
        >
          <div className="row mt-3">
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["awardedAmount"]}
                label="Awarded Amount"
                name="awardedAmount"
                type="number"
                disabled={hide || data?.percentageCharged}
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["percentageCharged"]}
                disabled={hide || data?.percentageCharged}
                label="Percentage Charged"
                type="number"
                name="percentageCharged"
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
            {data?.status && (
              <div className="col-12 col-md-12 col-xxl-6 mt-3">
                <label>Request Status</label>
                <input
                  disabled
                  value={data?.status == "accept" ? "Accepted" : "Appeal"}
                  className="bglight-ip rounded w-100 form-control"
                />
              </div>
            )}
          </div>

          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              {!data?.status && role == "expert" ? (
                <>
                  <LoadingButton
                    variant="contained"
                    loading={loading?.accept}
                    type="submit"
                    className="green-btn"
                    onClick={() => HandleSubmit("accept")}
                  >
                    <span className="f-16">Accept</span>
                  </LoadingButton>
                  <LoadingButton
                    variant="contained"
                    loading={loading?.appeal}
                    type="submit"
                    className="green-btn"
                    onClick={() => HandleSubmit("appeal")}
                  >
                    <span className="f-16">Appeal</span>
                  </LoadingButton>
                </>
              ) : (
                <>
                  <LoadingButton
                    variant="contained"
                    // loading={loading}
                    type="submit"
                    className="green-btn"
                    onClick={() => handleNext()}
                  >
                    <span className="f-16">Next</span>
                  </LoadingButton>
                </>
              )}
            </div>
          </div>
        </Form>
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
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
}

export default QuitenseReport;
