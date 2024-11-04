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
import { NumberField } from "@/components/Form/NumberField";
import { InputField } from "@/components/Form/InputField";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";

type FormValues = {
  otherOutcome: string;
};

const DesiredOutcome = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");
  const [outcome, setValue] = React.useState("");
  const [overtimeData, setOvertimeData] = useState<any>({});

  const schema = z.object({
    otherOutcome:
      outcome == "other"
        ? z
            .string({ required_error: "Please describe the other statement" })
            .min(1, "Please describe the other statement")
        : z.string().optional(),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.outcomeErr = false;
      return newObj;
    });
  };

  const [errors, setErrors] = useState({
    outcomeErr: false,
  });
  const errHandle = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (!outcome) {
      isError = true;
      errorObj.outcomeErr = true;
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
        outcome,
        otherOutcome: outcome == "other" ? values.otherOutcome : "",
        progress: 60,
      };
      console.log(payload);

      const { data } = await axios.post(
        "/api/client/category/overtime/createOvertime",
        payload
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");

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
      otherOutcome: "",
    });
    setValue("");
  };

  useEffect(() => {
    const getCaseById = async () => {
      try {
        setLoading(true);
        if (caseId) {
          const { data } = await axios.get(
            `/api/client/category/overtime/getOvertime?caseId=${caseId}`
          );
          setOvertimeData(data.data);

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
        Step 4/6: Desired Outcome
      </h3>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                {overtimeData.role == "Employee" ? (
                  <label className="tooltip-title relative">
                    Please indicate your desired outcome for this claim:
                  </label>
                ) : (
                  <label className="tooltip-title relative">
                    To the best of your knowledge, what outcome is the employee
                    seeking in this claim?
                  </label>
                )}

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={outcome}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Financial compensation for unpaid overtime"
                      control={<Radio />}
                      label="Financial compensation for unpaid overtime"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="other"
                      control={<Radio />}
                      label="Other"
                    />
                    {outcome == "other" && (
                      <div className="lease-input mb-4">
                        {/* <label className="tooltip-title relative">Others</label> */}
                        <InputField
                          error={formState.errors["otherOutcome"]}
                          label="Others"
                          name="otherOutcome"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        />
                      </div>
                    )}
                  </RadioGroup>
                  {errors.outcomeErr && (
                    <span className="text-danger f-14">
                      {" "}
                      Please select the desired outcome
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            {/* <div className="col-12 col-md-12 mb-2">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
              To the best of your knowledge, what outcome is the employee seeking in this claim?
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={agreement}
                  onChange={agreementChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="Financial compensation for unpaid overtime"
                    control={<Radio />}
                    label="Financial compensation for unpaid overtime"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="Other (please specify)"
                    control={<Radio />}
                    label="Other (please specify)"
                  />
                
                </RadioGroup>
              </FormControl>
            </div>
            <div className="lease-input mb-4">
              <label className="tooltip-title relative">Others</label>
              <InputField
                error={formState.errors["others"]}
                label="Others"
                name="others"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div> */}
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

export default DesiredOutcome;
