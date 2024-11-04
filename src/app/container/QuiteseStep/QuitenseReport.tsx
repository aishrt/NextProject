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
  approvedAmount: string;
  expertAmount: string;
  lawyerAmount: string;
};
const schema = z.object({
  approvedAmount: z
    .string({ required_error: "Approved Amount is required" })
    .min(1, "Approved Amount is required"),
  expertAmount: z
    .string({ required_error: "Client Amount is required" })
    .min(1, "Payment method is required"),
  lawyerAmount: z
    .string({ required_error: "Lawyer Amount is required" })
    .min(1, "Lawyer Amount is required"),
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
  console.log(data, "=======data");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
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

  const HandleSubmit = (values: any) => {
    setLoading(true);
    if (data?.approvedAmount) {
      return setActiveStep(2);
    }
    axios.post("/api/quitense", { ...values, case_id }).then((res: any) => {
      if (res?.success) {
        setLoading(false);
        openSnackbar({
          message: "Pricing details updated successfully",
          type: "success",
        });
        router.back();
      }
    });
  };

  useEffect(() => {
    if (hide) {
      methods.clearErrors("approvedAmount");
      methods.clearErrors("lawyerAmount");
      methods.clearErrors("expertAmount");
    }
    if (data) {
      methods.setValue("approvedAmount", data?.approvedAmount?.toString());
      methods.setValue("lawyerAmount", data?.lawyerAmount?.toString());
      methods.setValue("expertAmount", data?.expertAmount?.toString());
    }
  }, [hide, data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4  gray">
        Provide Quittance Transactionnelle Details
      </h3>
      <p className="f-14">
        (This step would mirror the previous structure, guiding the user through
        questions specific to spousal support. It would include sections on
        their financial situation, their spouse&apos;s financial situation,
        asset division, etc.)
      </p>
      <div className="assess-link">
        <Form<FormValues> methods={methods} onSubmit={HandleSubmit}>
          <div className="row mt-3">
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["approvedAmount"]}
                label="Approved Amount"
                disabled={hide || data?.approvedAmount}
                name="approvedAmount"
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["expertAmount"]}
                label="Expert Amount"
                name="expertAmount"
                disabled={hide || data?.approvedAmount}
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["lawyerAmount"]}
                disabled={hide || data?.approvedAmount}
                label="Lawyer Amount"
                name="lawyerAmount"
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <LoadingButton
                variant="contained"
                loading={loading}
                type="submit"
                className="green-btn"
                // onClick={() => handleNext()}
              >
                <span className="f-16">
                  {data?.approvedAmount && role == "expert" && "Next"}
                  {!data?.approvedAmount && role == "expert" && "Submit"}

                  {role == "client" || role == "lawyer" ? "Next" : ""}
                </span>
              </LoadingButton>
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
