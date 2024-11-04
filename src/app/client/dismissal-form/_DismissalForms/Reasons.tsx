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
import { Dismissal } from "@/types/Dismissal";
import { Tooltip } from "@mui/material";
import DateField from "@/components/Form/DateField";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";

type FormValues = {
  notificationDate: string;
  dismissalReason: string;

  constructiveDate: string;
  otherConstructive: string;
};

const dismissal = [
  { label: "Serious misconduct", value: "Serious misconduct" },
  { label: "Gross misconduct", value: "Gross misconduct" },
  { label: "Very serious misconduct", value: "Very serious misconduct" },
  { label: "Illness or physical unfitness", value: "Illness" },
  {
    label: "Other serious personal reason",
    value: "Other serious personal reason",
  },
  { label: "Economic difficulties", value: "Economic difficulties" },
  { label: "Technological changes", value: "Technological changes" },
  { label: "Reorganization", value: "Reorganization" },
  { label: "Cessation of activity", value: "Cessation of activity" },
  { label: "Judicial termination", value: "Judicial termination" },
  { label: "Recognition of termination", value: "Recognition of termination" },
  {
    label: "Reclassification of contract",
    value: "Reclassification of contract",
  },
  { label: "Other reason", value: "Other reason" },
];

let constructiveArr: any = [
  {
    label: "Non-payment of part of the salary",
    value: "Non-payment",
    tooltip:
      "My employer did not pay my year-end bonuses despite several reminders. I worked for three months without receiving my full salary.",
  },
  {
    label: "Change in salary structure",
    value: "Change in salary",
    tooltip:
      "My employer changed my salary structure by removing sales commissions without my agreement, which significantly reduced my salary.",
  },
  {
    label: "Refusal to recognize overtime worked",
    value: "overtime worked",
    tooltip:
      "I regularly worked overtime that was never recognized or paid despite my repeated requests.",
  },

  {
    label: "Violation of the principle of equal treatment",
    value: "Violation",
    tooltip:
      "I noticed that my male colleagues, occupying similar positions, were receiving higher pay than me.",
  },

  {
    label: "Reduction in responsibilities",
    value: "Reduction",
    tooltip:
      "My responsibilities were reduced without explanation, from project manager to simple assistant.",
  },
  {
    label: "Isolation",
    value: "Isolation",
    tooltip:
      "I was isolated from the team, had all my important files taken away, and was no longer invited to meetings.",
  },
  {
    label: "Other",
    value: "Other",
    tooltip: "",
  },
];

const Reasons = ({
  data,
  hide,
}: {
  data: Dismissal | undefined | null;
  hide: boolean;
}) => {
  const dismissalData = data;
  console.log(dismissalData);

  const [constructiveReason, setReason] = React.useState<string[]>([]);

  const schema = z.object({
    notificationDate:
      data?.situation == "Termination"
        ? z
            .string({
              required_error:
                "Please enter the date of the dismissal notification",
            })
            .min(1, "Please enter the date of the dismissal notification")
        : z.string().optional(),

    dismissalReason:
      data?.situation == "Termination"
        ? z
            .string({
              required_error: "Please select the reason for the dismissal",
            })
            .min(1, "Please select the reason for the dismissal")
        : z.string().optional(),

    constructiveDate:
      data?.situation == "Constructive Dismissal"
        ? z
            .string({
              required_error:
                "Please enter the date of the constructive dismissal",
            })
            .min(1, "Please enter the date of the constructive dismissal")
        : z.string().optional(),

    otherConstructive:
      data?.situation == "Constructive Dismissal" &&
      constructiveReason.includes("Other")
        ? z
            .string({
              required_error: "Please specify the other reason",
            })
            .min(1, "Please specify the other reason")
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
    warningErr: false,
    meetingErr: false,
    reasonErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (data?.situation == "Termination" && !warning) {
      isError = true;
      errorObj = { ...errorObj, warningErr: true };
    }
    if (data?.situation == "Termination" && !meetings) {
      isError = true;
      errorObj = { ...errorObj, meetingErr: true };
    }
    if (
      data?.situation == "Constructive Dismissal" &&
      constructiveReason.length == 0
    ) {
      isError = true;
      errorObj = { ...errorObj, reasonErr: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [warning, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.warningErr = false;
      return newErrorObj;
    });
  };

  const handleReasons = (label: number) => {
    setReason((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.reasonErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const [meetings, setMeeting] = React.useState("");
  const handleMeeting = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeeting((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.meetingErr = false;
      return newErrorObj;
    });
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/dismissal/createDismissal",
        {
          caseId: caseId,
          progress: 40,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
      router.push(`/client/dismissal-form?${searchParam.toString()}`);
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
      let payload;
      if (dismissalData?.situation == "Termination") {
        payload = {
          caseId: caseId,
          notificationDate: values.notificationDate,
          dismissalReason: values.dismissalReason,
          warning,
          meetings,
        };
      }

      if (dismissalData?.situation == "Constructive Dismissal") {
        payload = {
          caseId: caseId,
          constructiveDate: values.constructiveDate,
          constructiveReason,
          otherConstructive: constructiveReason.includes("Other")
            ? values.otherConstructive
            : "",
        };
      }

      if (!hide) {
        payload = { ...payload, progress: 60, nextProgress: 60 };
      }
      const { data } = await axios.post(
        "/api/client/category/dismissal/createDismissal",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "60");
        router.push(`/client/dismissal-form?${searchParam.toString()}`);
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
    setValue(data?.warning ?? "");
    setMeeting(data?.meetings ?? "");
    setReason(data?.constructiveReason ?? []);
    setValues({ ...data });
  }, [data]);

  return (
    <div className="lease-form white-card p-4 mt-4 indivi-form rounded">
      <h3 className="f-26  mt-4">
        Reasons for{" "}
        {data?.situation == "Termination"
          ? "Termination Dismissal"
          : "Constructive Dismissal"}
      </h3>
      <p className="f-15">
        We need to understand the specifics of your{" "}
        {data?.situation == "Termination"
          ? "Dismissal"
          : "Constructive Dismissal"}
        . This helps us determine if there was a valid reason for your
        termination and if you are entitled to compensation.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        {data?.situation == "Termination" && (
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4 date-input">
              <div className="lease-input">
                <label className="tooltip-title relative">
                  What is the date of the dismissal notification?{" "}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Indicate the date you were informed of your dismissal.
                  </span>
                </label>
                <DateField
                  error={formState.errors["notificationDate"]}
                  label=""
                  disabled={hide}
                  name="notificationDate"
                  control={control}
                  variant="filled"
                  className="bglight-area p-2"
                />
              </div>
            </div>

            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input">
                <label className="tooltip-title relative">
                  What is the reason for the dismissal?{" "}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Choose the reason that best describes the dismissal. If you
                    are unsure, seek advice.{" "}
                  </span>
                </label>

                <SelectField
                  options={dismissal}
                  label=""
                  disabled={hide}
                  name="dismissalReason"
                  className="bglight-select"
                  error={formState.errors["dismissalReason"]}
                  control={control}
                />
              </div>
            </div>

            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Did you receive a warning before the dismissal?{" "}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Select &quot;Yes&quot; if you received a formal warning
                    before the dismissal{" "}
                  </span>
                </label>

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={warning}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      disabled={hide}
                      className="radio-light-ip"
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="no"
                      disabled={hide}
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>

                  {errors.warningErr && (
                    <span className="text-danger">
                      Please select, did you receive a warning
                    </span>
                  )}
                </FormControl>
              </div>
            </div>

            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Were there disciplinary meetings before the dismissal?{" "}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Select &quot;Yes&quot; if disciplinary meetings took place
                    before the dismissal.
                  </span>
                </label>

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={meetings}
                    onChange={handleMeeting}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="yes"
                      disabled={hide}
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="no"
                      disabled={hide}
                      label="No"
                    />
                  </RadioGroup>

                  {errors.meetingErr && (
                    <span className="text-danger">
                      Please select, were there disciplinary meetings
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
          </div>
        )}

        {data?.situation == "Constructive Dismissal" && (
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4 date-input">
              <div className="lease-input">
                <label className="tooltip-title relative">
                  What is the date of the constructive dismissal?{" "}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Indicate the date you took constructive dismissal of your
                    employment contract.{" "}
                  </span>
                </label>
                <DateField
                  error={formState.errors["constructiveDate"]}
                  label=""
                  name="constructiveDate"
                  disabled={hide}
                  control={control}
                  variant="filled"
                  className="bglight-area"
                />
              </div>
            </div>

            <div className="col-12 col-md-12 mb-4">
              <div className="lease-input">
                <label className="tooltip-title relative">
                  What are the reasons for the constructive dismissal?{" "}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Select the reasons that motivated the constructive
                    dismissal. You can choose multiple reasons. The more details
                    you provide, the more precise your request will be.
                  </span>
                </label>

                <FormGroup>
                  {constructiveArr.map((i: any, index: number) => {
                    return (
                      <Tooltip
                        key={index}
                        title={i.tooltip}
                        placement="bottom"
                        arrow
                      >
                        <FormControlLabel
                          key={index}
                          className="radio-light-ip"
                          control={<Checkbox />}
                          label={i.label}
                          disabled={hide}
                          onChange={() => handleReasons(i.value)}
                          checked={
                            constructiveReason.includes(i.value) ?? false
                          }
                        />
                      </Tooltip>
                    );
                  })}
                </FormGroup>
                {errors.reasonErr && (
                  <span className="text-danger">
                    Please select the reasons for the constructive dismissal
                  </span>
                )}
              </div>

              {constructiveReason.includes("Other") && (
                <div className="col-md-6 lease-input mb-4">
                  <label className="tooltip-title relative">Others</label>

                  <InputField
                    error={formState.errors["otherConstructive"]}
                    label=""
                    name="otherConstructive"
                    variant="filled"
                    className="bglight-ip"
                    disabled={hide}
                    control={control}
                  />
                </div>
              )}
            </div>
          </div>
        )}

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
              className={`client-btn dismissal-submit-btn ${
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

export default Reasons;
