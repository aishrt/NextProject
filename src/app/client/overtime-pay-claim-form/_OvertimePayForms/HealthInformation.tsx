"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import { InputField } from "@/components/Form/InputField";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

type FormValues = {
  illness: string;
  disabledWorker: string;
  otherHealthStatus: string;
  describe: string;
};

const HealthInformation = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [healthStatus, setHealth] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHealth((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.healthErr = false;
      return newObj;
    });
  };
  const [workAccident, setWork] = React.useState("");
  const handleWork = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWork((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.workErr = false;
      return newObj;
    });
  };

  const schema = z.object({
    illness:
      healthStatus == "Work-related-illness"
        ? z
            .string({
              required_error: "Please describe the work related illness",
            })
            .min(1, "Please describe the work related illness")
        : z.string().optional(),
    disabledWorker:
      healthStatus == "disabledWorker"
        ? z
            .string({ required_error: "Please describe the disabled worker" })
            .min(1, "Please describe the disabled worker")
        : z.string().optional(),

    otherHealthStatus:
      healthStatus == "other"
        ? z
            .string({ required_error: "Please describe the other statement" })
            .min(1, "Please describe the other statement")
        : z.string().optional(),

    describe:
      workAccident == "yes"
        ? z
            .string({
              required_error: "Please describe the incident and provide dates",
            })
            .min(1, "Please describe the incident and provide dates")
        : z.string().optional(),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [errors, setErrors] = useState({
    healthErr: false,
    workErr: false,
  });
  const errHandle = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (!healthStatus) {
      isError = true;
      errorObj.healthErr = true;
    }
    if (!workAccident) {
      isError = true;
      errorObj.workErr = true;
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [action, setAction] = useState("");

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }

      const payload = {
        caseId: caseId,
        describe: workAccident == "yes" ? values.describe : "",
        illness: healthStatus == "Work-related-illness" ? values.illness : "",
        disabledWorker:
          healthStatus == "disabledWorker" ? values.disabledWorker : "",
        otherHealthStatus:
          healthStatus == "other" ? values.otherHealthStatus : "",
        healthStatus,
        workAccident,
        progress: 50,
      };

      const { data } = await axios.post(
        "/api/client/category/overtime/createOvertime",
        payload
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");

      if (action == "next") {
        router.push(
          `/client/overtime-pay-claim-form?${searchParam.toString()}`
        );
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setValues({
      illness: "",
      disabledWorker: "",
      otherHealthStatus: "",
      describe: "",
    });
    setHealth("");
    setWork("");
  };

  const [data, setOvertimeData] = useState<any>({});

  useEffect(() => {
    const getCaseById = async () => {
      try {
        setLoading(true);
        if (caseId) {
          const { data } = await axios.get(
            `/api/client/category/overtime/getOvertime?caseId=${caseId}`
          );
          setOvertimeData(data.data);
          console.log(data.data);

          if (data.data) {
            // setIndividual(data.data.isIndividual);
          }
        }
        setLoading(false);
      } catch (error) {
        console.log("err", error);
        setLoading(false);
      }
    };
    getCaseById();
  }, [caseId]);

  return (
    <div className="lease-form white-card p-4 mt-4 rounded">
      <h3 className="f-22 bold mt-4 pb-3 gray">
        Step 3/6: Health Information{" "}
      </h3>
      <p className="f-14 gray">
        {data.role == "Employee"
          ? "To assess the potential impact of overtime on your health, please provide the following details:"
          : "To understand the employee`s health situation in relation to the claim, please provide the following details:"}
      </p>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Health Status Before the Claim
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={healthStatus}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Good"
                      control={<Radio />}
                      label="Good"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Fair"
                      control={<Radio />}
                      label="Fair"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Poor"
                      control={<Radio />}
                      label="Poor"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Work-related-illness"
                      control={<Radio />}
                      label="Work-related illness (please specify below)"
                    />

                    {healthStatus == "Work-related-illness" && (
                      <div className="lease-input mb-4">
                        {/* <label className="tooltip-title relative">
                          Work Related Illness
                        </label> */}
                        <InputField
                          error={formState.errors["illness"]}
                          label="Work Related Illness"
                          name="illness"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        />
                      </div>
                    )}
                    <FormControlLabel
                      className="radio-light-ip"
                      value="disabledWorker"
                      control={<Radio />}
                      label="Recognized as a Disabled Worker (please specify below)"
                    />
                    {healthStatus == "disabledWorker" && (
                      <div className="lease-input mb-4">
                        {/* <label className="tooltip-title relative">
                          Recognized as a Disabled Worker
                        </label> */}
                        <InputField
                          error={formState.errors["disabledWorker"]}
                          label="Recognized as a Disabled Worker"
                          name="disabledWorker"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        />
                      </div>
                    )}

                    <FormControlLabel
                      className="radio-light-ip"
                      value="other"
                      control={<Radio />}
                      label="Other (please specify below)"
                    />

                    {healthStatus == "other" && (
                      <div className="lease-input mb-4">
                        {/* <label className="tooltip-title relative">
                          Recognized as a Disabled Worker
                        </label> */}
                        <InputField
                          error={formState.errors["otherHealthStatus"]}
                          label="Recognized as a Disabled Worker"
                          name="otherHealthStatus"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        />
                      </div>
                    )}
                  </RadioGroup>
                  {errors.healthErr && (
                    <span className="text-danger f-14">
                      Please select the health status
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-12 mb-2">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Work Accident/Declared Unfit:
                </label>

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={workAccident}
                    onChange={handleWork}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />

                    {workAccident == "yes" && (
                      <div className="lease-input mb-4">
                        {/* <label className="tooltip-title relative">
                          Please describe
                        </label> */}
                        <InputField
                          error={formState.errors["describe"]}
                          label="Please describe the incident and provide dates"
                          name="describe"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        />
                      </div>
                    )}
                    <FormControlLabel
                      className="radio-light-ip"
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Pending decision"
                      control={<Radio />}
                      label="Pending decision"
                    />
                  </RadioGroup>
                  {errors.workErr && (
                    <span className="text-danger f-14">
                      Please select the work accident
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="col-12 text-center mt-4">
              <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
                <Button
                  type="submit"
                  variant="contained"
                  size="lg"
                  className="client-btn"
                  onClick={() => {
                    errHandle();
                    setAction("edit");
                  }}
                >
                  <span className="f-16">Edit Section</span>
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  className="next-btn f-16"
                  onClick={() => {
                    errHandle();
                    setAction("next");
                  }}
                >
                  <span className="f-16">Next</span>
                </Button>
                <Button
                  variant="contained"
                  className="client-btn"
                  size="lg"
                  onClick={handleReset}
                >
                  Reset Form
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default HealthInformation;
