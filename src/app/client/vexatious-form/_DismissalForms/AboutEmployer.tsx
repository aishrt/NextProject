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
  Autocomplete,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Tooltip } from "@mui/material";
import DateField from "@/components/Form/DateField";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";
import { Vexatious } from "@/types/Vexatious";

type FormValues = {
  peopleWorked: string;
  otherReason: string;
};

const AboutEmployer = ({
  data,
  hide,
}: {
  data: Vexatious | undefined | null;
  hide: boolean;
}) => {
  const [employerReason, setReason] = React.useState("");

  const schema = z.object({
    peopleWorked: z
      .string({
        required_error:
          "Please enter the people worked at the time of dismissal",
      })
      .min(1, "Please enter the people worked at the time of dismissal"),

    otherReason:
      employerReason == "Other"
        ? z
            .string({
              required_error: "Please describe the other reason",
            })
            .min(1, "Please describe the other reason")
        : z.string().optional(),
  });

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    err: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!employerReason) {
      isError = true;
      errorObj = { ...errorObj, err: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setReason((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.err = false;
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
          progress: 30,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");
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
        ...values,
        employerReason,
        otherReason: employerReason == "Other" ? values.otherReason : "",
      };

      if (!hide) {
        payload = { ...payload, progress: 50, nextProgress: 50 };
      }
      const { data } = await axios.post(
        "/api/client/category/vexatious/createVexatious",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "50");
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
    setValues({
      peopleWorked: data?.peopleWorked?.toString(),
      otherReason: data?.otherReason,
    });
    setReason(data?.employerReason ?? "");
  }, [data]);

  return (
    <div className="lease-form white-card rounded mt-4 indivi-form p-4">
      <h3 className="f-26 mt-4">Let&apos;s Learn About Your Employer</h3>
      <p className="f-15">
        To assess the circumstances of your dismissal, we need some information
        about your former employer. These details will help us understand your
        company&apos;s context.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative my-3">
                How many people worked at the company at the time of your
                dismissal?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Estimate the total number of employees at the company. Ex:
                  50-100
                </span>
              </label>
              <InputField
                type="number"
                error={formState.errors["peopleWorked"]}
                label=""
                name="peopleWorked"
                variant="filled"
                className="bglight-ip"
                disabled={hide}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-612 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                What reason did your employer give for your dismissal?{" "}
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={employerReason}
                  onChange={handleChange}
                >
                  <Tooltip title="Select this option if your employer cited serious misconduct. Ex: Repeated negligence in performing your duties.">
                    <FormControlLabel
                      className="radio-light-ip"
                      disabled={hide}
                      value="Serious misconduct"
                      control={<Radio />}
                      label="Serious misconduct"
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if your employer cited gross misconduct. Ex: Violation of safety rules endangering colleagues.">
                    <FormControlLabel
                      className="radio-light-ip"
                      disabled={hide}
                      value="Gross misconduct"
                      control={<Radio />}
                      label="Gross misconduct"
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if your employer cited insufficient performance. Ex: Failing to meet sales targets repeatedly.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Professional incompetence"
                      disabled={hide}
                      control={<Radio />}
                      label="Professional incompetence"
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if your employer cited illness or unfitness. Ex: Inability to perform your job following a fitness declaration.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Illness/Unfitness"
                      control={<Radio />}
                      disabled={hide}
                      label="Illness/Unfitness"
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if your employer cited a personal reason. Ex: Personal conflict with a superior.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Personal reason"
                      disabled={hide}
                      control={<Radio />}
                      label="Personal reason"
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if your employer cited economic difficulties. Ex: Significant drop in the company's revenue.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Economic difficulties"
                      control={<Radio />}
                      label="Economic difficulties"
                      disabled={hide}
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if your employer cited company reorganization. Ex: Merger requiring staff reduction.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Reorganization"
                      control={<Radio />}
                      label="Reorganization"
                      disabled={hide}
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if your employer cited company closure. Ex: Company liquidation.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Business closure"
                      disabled={hide}
                      control={<Radio />}
                      label="Business closure"
                    />
                  </Tooltip>

                  <Tooltip title="Select this option if your employer cited another economic reason. Ex: Offshoring of activities.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Other"
                      control={<Radio />}
                      disabled={hide}
                      label="Other economic reason"
                    />
                  </Tooltip>
                </RadioGroup>

                {errors.err && (
                  <span className="text-danger">
                    Please select, the employer reason
                  </span>
                )}

                {employerReason == "Other" && (
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="tooltip-title relative my-3">
                        Please, specify
                      </label>
                      <InputField
                        error={formState.errors["otherReason"]}
                        label=""
                        disabled={hide}
                        name="otherReason"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>
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

export default AboutEmployer;
