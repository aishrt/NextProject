"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import bubble from "@/assets/info.png";
import Image from "next/image";
import axios from "axios";
import { Wrongful } from "@/types/Wrongful";

const HealthStatus = ({
  data,
  hide,
}: {
  data: Wrongful | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "40");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [healthStatus, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.healthErr = false;
      return newObj;
    });
  };
  const [unfit, setUnfit] = React.useState("");
  const unfitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUnfit((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.unfitErr = false;
      return newObj;
    });
  };

  const [errors, setErrors] = useState({ healthErr: false, unfitErr: false });
  const errHandle = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (!healthStatus) {
      isError = true;
      errorObj.healthErr = true;
    }
    if (!unfit) {
      isError = true;
      errorObj.unfitErr = true;
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleClick = async () => {
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
        payload = { ...payload, progress: 60, nextProgress: 60 };
      }
      const { data } = await axios.post(
        "/api/client/category/wrongful/createWrongful",
        payload
      );

      let id = data.data.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "60");

        router.push(`/client/wrongful-termination?${searchParam.toString()}`);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/wrongful/createWrongful",
        {
          caseId: caseId,
          progress: 40,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
      router.push(`/client/wrongful-termination?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setUnfit(data?.unfit ?? "");
    setValue(data?.healthStatus ?? "");
  }, [data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray pb-2">
        Health Status at the Time of Termination
      </h3>
      <p className="f-14 gray">
        {data?.role == "Employee"
          ? "Please provide information about your health status before the termination. These details can be crucial for evaluating your claim."
          : "Please provide details about the employee's health status before the termination. This information can be important for evaluating discrimination claims."}
      </p>

      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  {data?.role == "Employee"
                    ? "What was your health status before the termination?"
                    : "What was the employee's health status before the termination?"}

                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    {data?.role == "Employee"
                      ? `Select your health status before the termination. A recognized disability can influence a discrimination claim. For example, 'Work-related illness.'`
                      : `Select the employee's health status before the termination. A recognized disability can influence a discrimination claim. For example, 'Work-related illness.'`}
                  </span>
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
                      value="Good or unknown"
                      control={<Radio />}
                      label="Good or unknown"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Non-work-related illness"
                      control={<Radio />}
                      label="Non-work-related illness"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Work-related illness"
                      control={<Radio />}
                      label="Work-related illness"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Disability (recognized by law)"
                      control={<Radio />}
                      label="Disability (recognized by law)"
                    />
                  </RadioGroup>
                  {errors.healthErr && (
                    <span className="text-danger f-14">
                      Please select the health status{" "}
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  {data?.role == "Employee"
                    ? `Were you on medical leave or declared unfit for work before the termination?`
                    : `Was the employee on medical leave or declared unfit for work before the termination? `}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    {data?.role == "Employee"
                      ? `Indicate if you were on medical leave or declared unfit for work before the termination. This can be relevant for a discrimination claim.`
                      : "Indicate if the employee was on medical leave or declared unfit for work before the termination. This can be relevant for a discrimination claim."}
                  </span>
                </label>

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={unfit}
                    onChange={unfitChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="No"
                      control={<Radio />}
                      label="No"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="I don't know"
                      control={<Radio />}
                      label="I don't know"
                    />
                  </RadioGroup>
                  {errors.unfitErr && (
                    <span className="text-danger f-14"> Please select </span>
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
                className={`green-border f-16 ${hide ? "d-none" : "block"}`}
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                variant="contained"
                className={`green-btn wrongful-submit-btn ${
                  hide ? "d-none" : "block"
                }`}
                size="lg"
                onClick={handleClick}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthStatus;
