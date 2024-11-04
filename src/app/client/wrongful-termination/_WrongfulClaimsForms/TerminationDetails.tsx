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
import { InputField } from "@/components/Form/InputField";
import TextAreaField from "@/components/Form/TextArea";
import axios from "axios";
import { Wrongful } from "@/types/Wrongful";
import Image from "next/image";
import bubble from "@/assets/info.png";
type FormValues = {
  description: string;
  reason: string;
  // contact: string;
};

const TerminationDetails = ({
  data,
  hide,
}: {
  data: Wrongful | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId")!;

  const [witnesses, setDismissal] = React.useState("");

  const schema = z.object({
    description: z
      .string({
        required_error:
          "Please provide a detailed description of the circumstances.",
      })
      .min(1, "Please provide a detailed description of the circumstances"),
    reason: z
      .string({
        required_error: "Please enter the official reason for dismissal",
      })
      .min(1, "Please enter the official reason for dismissal"),
    // contact:
    //   witnesses == "Yes"
    //     ? z
    //         .string({
    //           required_error:
    //             "Please provide the names and contact information",
    //         })
    //         .min(1, "Please provide the names and contact information")
    //     : z.string().optional(),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const { formState, control } = methods;
  const router = useRouter();

  const [legally, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.legalErr = false;
      return newObj;
    });
  };

  const dismissalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDismissal((event.target as HTMLInputElement).value);
    // if (event.target.value !== "Yes") {
    //   setValues({
    //     contact: "",
    //   });
    // }
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.witnessErr = false;
      return newObj;
    });
  };

  const [errors, setErrors] = useState({ legalErr: false, witnessErr: false });
  const errHandle = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (!legally) {
      isError = true;
      errorObj.legalErr = true;
    }
    if (!witnesses) {
      isError = true;
      errorObj.witnessErr = true;
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
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
        legally,
        witnesses,
      };

      if (!hide) {
        payload = { ...payload, progress: 70, nextProgress: 70 };
      }
      const { data } = await axios.post(
        "/api/client/category/wrongful/createWrongful",
        payload
      );
      let id = data.data.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "70");

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
          progress: 50,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");
      router.push(`/client/wrongful-termination?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  useEffect(() => {
    setValue(data?.legally ?? "");
    setDismissal(data?.witnesses ?? " ");
    setValues({
      description: data?.description,
      reason: data?.reason,
    });
  }, [data]);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray pb-2">Details of the Termination </h3>

      <p className="f-14 gray">
        Your detailed answers will help us understand the circumstances of{" "}
        {data?.role == "Employee" ? "your" : "the"} termination and evaluate the
        situation accurately.
      </p>

      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-3">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  {`Can you describe the events and circumstances leading to ${
                    data?.role == "Employee" ? "your" : "the"
                  } termination? `}

                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    {`Describe the events leading to ${
                      data?.role == "Employee" ? "your" : "the"
                    } termination, including warnings, performance reviews, meetings, or relevant incidents. The more details you provide, the more we can refine the evaluation of ${
                      data?.role == "Employee" ? "your" : "the"
                    } situation.`}
                  </span>
                </label>
                <TextAreaField
                  name="description"
                  label=""
                  error={formState.errors["description"]}
                  control={control}
                  variant="filled"
                  className="bglight-area"
                />
                {/* <span className="span-label f-14 d-block f-14">
                  <span className="bold">Prompt:</span> Please describe the
                  events leading up to the dismissal, including any warnings,
                  performance reviews, meetings, or incidents that you believe
                  are relevant.
                </span> */}
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  {`What was the official reason given for ${
                    data?.role == "Employee" ? "your" : "the"
                  } termination?`}

                  <Image src={bubble} className="bubble" alt="" />
                  <span className="hover-tip">
                    {data?.role == "Employee"
                      ? `Enter the official reason given for your termination. The more details you provide, the more we can refine the evaluation of your situation.`
                      : `Enter the official reason given for the termination. For example, 'Economic reasons due to decreased sales.' The more details you provide, the more we can refine the evaluation of the situation.`}
                  </span>
                </label>
                <InputField
                  error={formState.errors["reason"]}
                  label={
                    data?.role == "Employee"
                      ? "Economic reasons due to decreased sales."
                      : ""
                  }
                  name="reason"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  {data?.role == "Employee"
                    ? "Did your employer follow the legal procedures for termination?"
                    : "Did you follow the legal procedures for termination?"}

                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    {data?.role == "Employee"
                      ? `Indicate if your employer followed the legal procedures for your termination. In France, specific procedures must be followed for terminations. For example, 'I don't know.'`
                      : "Indicate if you followed the legal procedures for termination. In France, specific procedures must be followed for terminations. For example, 'I don't know.'"}
                  </span>
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={legally}
                    onChange={handleChange}
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
                  {errors.legalErr && (
                    <span className="text-danger f-14">
                      Please select the legally required procedures for
                      dismissal
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  {`Were there any witnesses to the events leading to ${
                    data?.role == "Employee" ? "your" : "the"
                  } termination?`}

                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    {`Indicate if there were any witnesses to the events leading to ${
                      data?.role == "Employee" ? "your" : "the"
                    } termination. This can strengthen ${
                      data?.role == "Employee" ? "your" : "the"
                    } claim.`}
                  </span>
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={witnesses}
                    onChange={dismissalChange}
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
                  {errors.witnessErr && (
                    <span className="text-danger f-14">
                      Please select the witnesses to the events leading up
                    </span>
                  )}
                </FormControl>
              </div>
              {/* {witnesses == "Yes" && (
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">
                    Please provide the names and contact information of any
                    witnesses
                  </label>
                  <InputField
                    error={formState.errors["contact"]}
                    label="Names and contact information of any witnesses"
                    name="contact"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              )} */}
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
                type="submit"
                variant="contained"
                className={`green-btn wrongful-submit-btn ${
                  hide ? "d-none" : "block"
                }`}
                size="lg"
                onClick={errHandle}
              >
                Next
              </Button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default TerminationDetails;
