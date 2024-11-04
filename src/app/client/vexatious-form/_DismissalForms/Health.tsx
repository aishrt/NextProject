"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import bubble from "@/assets/info.png";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Tooltip } from "@mui/material";
import DateField from "@/components/Form/DateField";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";
import { Vexatious } from "@/types/Vexatious";

type FormValues = {};

const Health = ({
  data,
  hide,
}: {
  data: Vexatious | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({});

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    healthErr: false,
    unfitErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!healthStatus) {
      isError = true;
      errorObj = { ...errorObj, healthErr: true };
    }
    if (!unfit) {
      isError = true;
      errorObj = { ...errorObj, unfitErr: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [healthStatus, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.healthErr = false;
      return newErrorObj;
    });
  };

  const [unfit, setUnfit] = React.useState("");
  const handleunfit = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnfit((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.unfitErr = false;
      return newErrorObj;
    });
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/vexatious/createVexatious",
        {
          caseId: caseId,
          progress: 20,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
      router.push(`/client/vexatious-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }
      let payload: any = {
        caseId: caseId,
        healthStatus,
        unfit,
      };

      if (!hide) {
        payload = { ...payload, progress: 40, nextProgress: 40 };
      }
      const { data } = await axios.post(
        "/api/client/category/vexatious/createVexatious",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "40");
        router.push(`/client/vexatious-form?${searchParam.toString()}`);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue(data?.healthStatus ?? "");
    setUnfit(data?.unfit ?? "");
  }, [data]);

  return (
    <div className="lease-form white-card rounded mt-4 indivi-form p-4">
      <h3 className="f-26 mt-4">Understanding Your Health Before Dismissal</h3>
      <p className="f-15 ">
        Your health plays a crucial role in assessing your situation. These
        questions will help us understand if your dismissal has impacted your
        physical or mental well-being.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                What was your health status before the dismissal?{" "}
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={healthStatus}
                  onChange={handleChange}
                >
                  <Tooltip title="Select this option if your health was good or if you are unsure. Ex: You were in good health or had no known health issues.">
                    <FormControlLabel
                      disabled={hide}
                      className="radio-light-ip"
                      value="Good or unknown"
                      control={<Radio />}
                      label="Good or unknown"
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if you had an illness not caused by work. Ex: You had a chronic illness like diabetes.">
                    <FormControlLabel
                      className="radio-light-ip"
                      disabled={hide}
                      value="Non-work-related illness"
                      control={<Radio />}
                      label="Non-work-related illness"
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if you had an illness caused by work. Ex: You developed tendinitis due to repetitive tasks.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Work-related illness"
                      disabled={hide}
                      control={<Radio />}
                      label="Work-related illness"
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if you have a legally recognized disability. Ex: You have a recognized status as a disabled worker (RQTH).)">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Recognized disability"
                      control={<Radio />}
                      label="Recognized disability"
                      disabled={hide}
                    />
                  </Tooltip>
                </RadioGroup>

                {errors.healthErr && (
                  <span className="text-danger">
                    Please select, the health status
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Were you declared unfit for work by a doctor before your
                dismissal?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Check this box only if a doctor declared you unfit for work
                  before your dismissal. Ex: An occupational doctor declared
                  that you could no longer perform your duties due to health
                  reasons.
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={unfit}
                  onChange={handleunfit}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="Yes"
                    control={<Radio />}
                    disabled={hide}
                    label="Yes"
                  />

                  <FormControlLabel
                    disabled={hide}
                    className="radio-light-ip"
                    value="No"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>

                {errors.unfitErr && (
                  <span className="text-danger">
                    Please select, if you declared unfit for work by a doctor
                  </span>
                )}
              </FormControl>
            </div>
          </div>
        </div>

        <div className="col-12 text-center mt-4">
          <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
            <Button
              variant="outline"
              size="lg"
              className={`next-btn f-16 ${hide ? "d-none" : "block"}`}
              onClick={() => handlePrevious()}
            >
              <span className="f-16">Previous</span>
            </Button>

            <Button
              type="submit"
              variant="contained"
              className={`client-btn vexatious-submit-btn ${
                hide ? "d-none" : "block"
              }`}
              size="lg"
              onClick={() => errHandle()}
            >
              <span className="f-16">Next</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Health;
