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
type FormValues = {
  method: string;
};
const schema = z.object({
  method: z
    .string({ required_error: "Payment method is required" })
    .min(1, "Payment method is required"),
});
function PaymentMethod({
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
    if (data?.method) {
      methods.setValue("method", data?.method);
      methods.clearErrors("method");
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
    if (!data?.method) {
      setLoading(true);

      let payload = {
        case_id,
        method: values?.method,
      };

      axios.post("/api/quitense", payload).then((res: any) => {
        if (res?.success) {
          setLoading(false);
          openSnackbar({
            message: "Payment method updated successfully",
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
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4  gray">Select Payment Method</h3>
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
              <div
                style={{ marginLeft: "15px" }}
                className="col-6 col-md-6 col-xl-6 mt-3"
              >
                <SelectField
                  className="col-8 row"
                  name="method"
                  disabled={hide || data?.method}
                  control={control}
                  error={formState.errors["method"]}
                  options={[
                    { label: "Check", value: "check" },
                    { label: "Online", value: "online" },
                  ]}
                />
              </div>
            </div>

            <div className="col-12 text-center mt-4">
              <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
                <LoadingButton
                  variant="contained"
                  loading={loadingBtn}
                  type="submit"
                  className="green-btn"
                  onClick={() => {
                    if (data?.method) {
                      handleNext();
                    }
                  }}
                >
                  <span className="f-16">
                    {data?.method ? "Next" : "Submit"}
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

export default PaymentMethod;
