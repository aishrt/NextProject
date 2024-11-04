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
import DigitalSignature from "../DigitalSignature/page";
import LoadingButton from "@mui/lab/LoadingButton";
import { axios } from "@/utils/axios";
import useSnackbar from "@/hooks/useSnackbar";
type FormValues = {
  method: string;
  approvedAmount: string;
  expertAmount: string;
  lawyerAmount: string;
  clientSignature: string;
};
const schema = z.object({
  method: z
    .string({ required_error: "Payment method is required" })
    .min(1, "Payment method is required"),
  clientSignature: z
    .string({ required_error: "Client Signature is required" })
    .min(1, "Client Signature is required"),
});
function ClientSignature({
  progress,
  setProgress,
  hide,
  setActiveStep,
  activeStep,
  role,
  data,
  session,
  loading,
  case_id,
}: any) {
  const router = useRouter();
  const [loadingBtn, setLoading] = useState(false);
  const [clientSignature, setClientSignature] = useState("");
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, register } = methods;
  const { openSnackbar, snackProps, alertProps } = useSnackbar();

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId")!;

  const handleNext = async () => {
    return setProgress(40);
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          progress: 100,
          nextProgress: 100,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "100");
      router.push(
        `/client/child-support-calculation-form?${searchParam.toString()}`
      );

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const HandleSubmit = (values: any) => {
    if (
      data?.clientSignature &&
      session?.user?.role == "client" &&
      data?.step == 4
    ) {
      return setActiveStep(4);
    }
    if (data?.clientSignature) {
      return setActiveStep(3);
    }
    setLoading(true);
    let payload = {
      case_id,
      clientSignature,
    };
    axios.post("/api/quitense", payload).then((res: any) => {
      if (res?.success) {
        setLoading(false);
        openSnackbar({
          message: "Signature  added successfully",
          type: "success",
        });
        router.back();
      }
      setLoading(false);
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
      methods.setValue("method", data?.method);
      methods.setValue("lawyerAmount", data?.lawyerAmount?.toString());
      methods.setValue("expertAmount", data?.expertAmount?.toString());
    }
    if (data?.clientSignature) {
      methods.setValue("clientSignature", data?.clientSignature);
      setClientSignature(data?.clientSignature);
    }
  }, [hide, data]);
  useEffect(() => {
    if (clientSignature) {
      methods.setValue("clientSignature", clientSignature);
      methods.clearErrors("clientSignature");
    }
  }, [clientSignature]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4  gray">Provide Pricing Details</h3>
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
                error={formState.errors["method"]}
                label="Payment Method"
                disabled
                name="method"
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["approvedAmount"]}
                label="Approved Amount"
                name="approvedAmount"
                disabled
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["expertAmount"]}
                label="Expert Amount"
                name="expertAmount"
                disabled
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
            <div className="col-12 col-md-12 col-xxl-6 mt-3">
              <InputField
                error={formState.errors["lawyerAmount"]}
                label="Lawyer Amount"
                disabled
                name="lawyerAmount"
                className="bglight-ip rounded w-100"
                control={control}
              />
            </div>
            <div className="row  mb-4 ">
              <div className="col-12 col-md-2 d-flex">
                {role == "client" && !data?.clientSignature && (
                  <DigitalSignature setSignature={setClientSignature} />
                )}
                {clientSignature && (
                  <img
                    style={{ width: "150px", marginLeft: "10px" }}
                    src={clientSignature}
                    alt=""
                  />
                )}{" "}
              </div>
              {formState.errors["clientSignature"] && (
                <p className="text-danger">Please add signature</p>
              )}{" "}
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <LoadingButton
                variant="contained"
                type="submit"
                className="green-btn"
                loading={loadingBtn}
                // onClick={() => handleNext()}
              >
                <span className="f-16">
                  {role == "client" && !data?.clientSignature
                    ? "Submit"
                    : "Next"}
                </span>
              </LoadingButton>
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
