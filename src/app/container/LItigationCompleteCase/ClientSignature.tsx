"use client";

import React, { useEffect, useState } from "react";
import "../../client/client.css";
import { Alert, Link, Snackbar, Tooltip } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { Child } from "@/types/Child";
import { Button } from "@/components/Form/Button";
import SelectField from "@/components/Form/SelectField";
import Form from "@/components/Form/Form";
import { z } from "zod";
import { useHookForm } from "@/hooks/useHookForm";
import { InputField } from "@/components/Form/InputField";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";
type FormValues = {
  paymentMethod: string;
};
const schema = z.object({
  paymentMethod: z
    .string({ required_error: "Payment method is required" })
    .min(1, "Payment method is required"),
});
function ClientSignature({
  progress,
  setProgress,
  hide,
  data,
  setActiveStep,
  activeStep,
  role,
}: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, register } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("case_id");

  useEffect(() => {
    if (data?.paymentMethod) {
      methods.setValue("paymentMethod", data?.paymentMethod);
      methods.clearErrors("paymentMethod");
    }
  }, [data]);
  const HandleSubmit = (values: any) => {
    if (data?.paymentMethod && role == "client" && data?.carpaDocument) {
      return setActiveStep(4);
    }
    if (data?.paymentMethod && role == "client" && !data?.carpaDocument) {
      return;
    }
    if (data?.paymentMethod) {
      return setActiveStep(3);
    }
    setLoading(true);

    axios
      .post(`/api/litigation-complete`, {
        paymentMethod: values?.paymentMethod,
        case_id: caseId,
      })
      .then((res: any) => {
        if (res.success) {
          setLoading(false);
          openSnackbar({
            message: "Payment method updated successfully",
            type: "success",
          });
          router.back();
        }
      });
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
        <Form<FormValues> methods={methods} onSubmit={HandleSubmit}>
          <div className="row mt-3">
            <div
              className="col-12 col-md-12 col-xxl-6 mt-3"
              style={{ marginLeft: "16px" }}
            >
              <SelectField
                className="col-8 row"
                name="paymentMethod"
                label="Payment Method"
                disabled={hide || data?.paymentMethod}
                control={control}
                error={formState.errors["paymentMethod"]}
                options={[
                  { label: "Check", value: "check" },
                  { label: "Online", value: "online" },
                ]}
              />
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Tooltip
                title={`${
                  data?.paymentMethod && !data?.carpaDocument
                    ? "Expert has not uploaded Carpa instruction yet."
                    : ""
                }`}
              >
                <Button
                  variant="contained"
                  size="lg"
                  type="submit"
                  className="green-btn"
                  // onClick={() => handleNext()}
                >
                  <span className="f-16">
                    {data?.paymentMethod ? "Next" : "Submit"}
                  </span>
                </Button>
              </Tooltip>
            </div>
          </div>
        </Form>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </div>
  );
}

export default ClientSignature;
