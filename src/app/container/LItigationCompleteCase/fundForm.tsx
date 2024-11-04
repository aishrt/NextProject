"use client";

import React, { useEffect, useState } from "react";
import "../../client/client.css";
import { CircularProgress, Link, Tooltip } from "@mui/material";
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
import TextAreaField from "@/components/Form/TextArea";
type FormValues = {
  description: string;
  transactionId: string;
  fundAmount: string;
};
const schema = z.object({
  transactionId: z
    .string({ required_error: "Transaction ID is required" })
    .min(1, "Transaction ID is required"),
  fundAmount: z
    .string({ required_error: "Fund Amount is required" })
    .min(1, "Fund Amount is required"),
});
function FundForm({
  progress,
  setProgress,
  hide,
  setActiveStep,
  role,
  activeStep,
  loading,

  data,
  case_id,
  fund,
}: any) {
  const router = useRouter();
  const [loadingBtn, setLoading] = useState(false);
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, register } = methods;

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
      return setActiveStep(4);
    }
    axios.post("/api/quitense", { ...values, case_id }).then((res: any) => {
      if (res?.success) {
        setLoading(false);
        router.back();
      }
    });
  };

  useEffect(() => {
    if (hide) {
      methods.clearErrors("fundAmount");
      methods.clearErrors("transactionId");
    }
    if (data) {
      methods.setValue("transactionId", data?.transactionId);
      methods.setValue("fundAmount", data?.fundAmount?.toString());
      methods.setValue("description", data?.descriptions);
    }
  }, [hide, data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4  gray">Fund Details</h3>

      {loading ? (
        <CircularProgress />
      ) : (
        <div className="assess-link">
          {fund?.length == 0 && (
            <h3 className="f-22 bold mt-4">No fund details found</h3>
          )}
          {fund &&
            fund?.map((itm: any, i: any) => {
              return (
                // <Form<FormValues> methods={methods} onSubmit={HandleSubmit}>
                <div key={i} className="row mt-3">
                  <div className="col-12 col-md-12 col-xxl-6 mt-3">
                    <InputField
                      label="Fund Amount"
                      name="fundAmount"
                      type="number"
                      value={itm?.fundAmount}
                      disabled
                      className="bglight-ip rounded w-100 form-control"
                    />
                  </div>
                  <div className="col-12 col-md-12 col-xxl-6 mt-3">
                    <InputField
                      label="Transaction ID"
                      name="transactionId"
                      value={itm?.transactionId}
                      disabled
                      className="bglight-ip rounded w-100 form-control"
                    />
                  </div>
                  <div className="col-12 col-md-12 col-xxl-6 mt-3">
                    <TextAreaField
                      disabled
                      label="Description"
                      value={itm?.description}
                      placeholder="Description"
                      name="description"
                      className="bglight-ip rounded w-100 form-control"
                    />
                  </div>
                </div>

                // </Form>
              );
            })}
          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Tooltip
                title={`${
                  fund?.length == 0
                    ? "No fund added yet."
                    : data?.step == 4 && role != "expert"
                    ? "Expert has not updated Carpa Instruction yet"
                    : ""
                }`}
              >
                {fund?.length == 0 ? null : (
                  <LoadingButton
                    variant="contained"
                    loading={loadingBtn}
                    type="submit"
                    onClick={() => {
                      if (role == "expert") {
                        return setActiveStep(4);
                      }
                      if (fund?.length > 0 && data?.carpaDocument) {
                        setActiveStep(4);
                      }
                    }}
                    className="green-btn"
                    // onClick={() => handleNext()}
                  >
                    <span className="f-16">Next</span>
                  </LoadingButton>
                )}
                {role == "lawyer" && (
                  <LoadingButton
                    variant="contained"
                    style={{ marginLeft: "6px" }}
                    onClick={() => {
                      router.push(
                        `/lawyer/funds/add?case_id=${case_id}&isLitigation=true`
                      );
                    }}
                    className="green-btn"
                    // onClick={() => handleNext()}
                  >
                    <span className="f-16">Add</span>
                  </LoadingButton>
                )}
              </Tooltip>
            </div>
          </div>
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
      )}
    </div>
  );
}

export default FundForm;
