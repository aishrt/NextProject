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
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Tooltip } from "@mui/material";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";
import { Harassment } from "@/types/Harassment";

type FormValues = {};

const Health = ({
  data,
  hide,
}: {
  data: Harassment | undefined | null;
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

    if (!health) {
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
  const [health, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.healthErr = false;
      return newErrorObj;
    });
  };

  const [unfit, setUnfit] = React.useState("");
  const handleWork = (event: React.ChangeEvent<HTMLInputElement>) => {
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
        "/api/client/category/harassment/createHarassment",
        {
          caseId: caseId,
          progress: 20,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
      router.push(`/client/harassment-form?${searchParam.toString()}`);
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
        health,
        unfit,
      };

      if (!hide) {
        payload = { ...payload, progress: 40, nextProgress: 40 };
      }
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "40");
        router.push(`/client/harassment-form?${searchParam.toString()}`);
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
    setValue(data?.health ?? "");
    setUnfit(data?.unfit ?? "");
  }, [data]);

  return (
    <div className="lease-form white-card rounded p-4 mt-4 indivi-form">
       <h6 className="f-26  fw-400">Your Health Situation </h6>
      <p className="f-15 ">
        Now, let&apos;s talk about your health. Your health condition is an
        important aspect of your compensation request. Please provide details
        about your health before and after the harassment incidents.{" "}
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                How was your health before the incidents?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select the option that best describes your health status
                  before the harassment. If you were in good health before the
                  incidents, select &quot;Good or Unknown&quot;.
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={health}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    disabled={hide}

                    value="Good"
                    control={<Radio />}
                    label="Good or Unknown"
                  />
                  <FormControlLabel
                                  disabled={hide}

                    className="radio-light-ip"
                    value="Non-work"
                    control={<Radio />}
                    label="Non-work-related Illness"
                  />

                  <FormControlLabel
                    className="radio-light-ip"
                    disabled={hide}

                    value="Work"
                    control={<Radio />}
                    label="Work-related Illness"
                  />

                  <Tooltip title="Select this if you have official documentation (medical certificates, government recognition) classifying you as a worker with a disability.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Recognized"
                      disabled={hide}

                      control={<Radio />}
                      label="Recognized as a Disabled Worker"
                    />
                  </Tooltip>
                </RadioGroup>

                {errors.healthErr && (
                  <span className="text-danger">
                    Please select, if you have documentary evidence
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Have you ever been declared unfit for work by a doctor?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select if a medical professional has declared you temporarily
                  or permanently unfit to perform your usual job duties. You may
                  need to provide medical records as proof. If a doctor declared
                  you unfit before the harassment incidents, select
                  &quot;Yes&quot;.
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={unfit}
                  onChange={handleWork}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                    disabled={hide}

                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="no"
                    control={<Radio />}
                    label="No"
                    disabled={hide}

                  />
                </RadioGroup>

                {errors.unfitErr && (
                  <span className="text-danger">
                    Please select, if you ever been declared unfit for work by a
                    doctor
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
              className={`client-btn ${
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
