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
import { Dismissal } from "@/types/Dismissal";
import { Tooltip } from "@mui/material";
import DateField from "@/components/Form/DateField";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";

type FormValues = {
  dateOfBirth: string;
  age: string;
  salary: string;
  service: string;
  serviceYears: string;
  startPosition: string;
};

const options = [
  { label: "Less than 2 years", value: "less" },
  { label: "2 years or more", value: "more" },
];

const AboutYourself = ({
  data,
  hide,
}: {
  data: Dismissal | undefined | null;
  hide: boolean;
}) => {
  const schema = (service: string): z.ZodSchema => {
    return z.object({
      dateOfBirth: z
        .string({ required_error: "Please select the date of birth" })
        .min(1, "Please select the date of birth"),
      age: z
        .string({ required_error: "Please enter the age" })
        .min(1, "Please enter the age"),

      salary: z
        .string({ required_error: "Please enter your gross monthly salary" })
        .min(1, "Please enter your gross monthly salary"),

      service: z
        .string({
          required_error: "Please enter the length of your service",
          invalid_type_error: "Please enter the length of your service",
        })
        .min(1, "Please enter the length of your service"),

      serviceYears:
        service == "more"
          ? z
              .string({
                required_error: "Please enter the length of your service",
              })
              .min(1, "Please enter the length of your service")
          : z.string().optional(),

      startPosition: z
        .string({
          required_error: "Please select the date you started your current job",
        })
        .min(1, "Please select the date you started your current job"),
    });
  };

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");
  const [service, setService] = useState("");

  const { methods, setValues } = useHookForm<FormValues>(schema(service));
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    employmentErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!employment) {
      isError = true;
      errorObj = { ...errorObj, employmentErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [employment, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.employmentErr = false;
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
          progress: 20,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
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
      let payload: any = {
        caseId: caseId,
        ...values,
        serviceYears: service == "more" ? values.serviceYears : "",
        employment,
      };

      if (!hide) {
        payload = { ...payload, progress: 40, nextProgress: 40 };
      }
      const { data } = await axios.post(
        "/api/client/category/dismissal/createDismissal",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "40");
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
    setValue(data?.employment ?? "");
    setService(data?.service ?? "");
    setValues({
      dateOfBirth: data?.dateOfBirth,
      age: data?.age?.toString(),
      salary: data?.salary?.toString(),
      service: data?.service,
      serviceYears: data?.serviceYears?.toString(),
      startPosition: data?.startPosition,
    });
  }, [data]);

  return (
    <div className="lease-form white-card p-4 mt-4 indivi-form rounded">
      <h3 className="f-26 mt-4">Tell us About Yourself</h3>
      <p className="f-15">
        We need some basic information about you. These details help us
        understand your background and calculate potential compensation based on
        your age, salary, and length of service.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4 date-input">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What is your date of birth?{" "}
              </label>
              <DateField
                error={formState.errors["dateOfBirth"]}
                label="Date of Birth"
                name="dateOfBirth"
                control={control}
                disabled={hide}
                variant="filled"
                className="bglight-area p-2"
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                How old are you?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Enter your age at the time of dismissal or constructive
                  dismissal.
                </span>
              </label>

              <InputField
                type="number"
                error={formState.errors["age"]}
                label=""
                name="age"
                disabled={hide}
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What is your gross monthly salary?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Enter your gross monthly salary, before taxes and deductions,
                  including bonuses and benefits in kind.{" "}
                </span>
              </label>

              <InputField
                type="number"
                error={formState.errors["salary"]}
                label=""
                name="salary"
                disabled={hide}
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                What is your employment status?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select &quot;Executivev&quot; if you have supervisory
                  responsibilities, otherwise choose &quot;Non-executive.
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={employment}
                  disabled={hide}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="Non-executive"
                    control={<Radio />}
                    disabled={hide}
                    label="Non-executive (you do not supervise others)"
                  />

                  <FormControlLabel
                    className="radio-light-ip"
                    value="Executive"
                    control={<Radio />}
                    disabled={hide}
                    label="Executive (you supervise other employees)"
                  />
                </RadioGroup>

                {errors.employmentErr && (
                  <span className="text-danger">
                    Please select, the employment status
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What is your length of service in the company?
              </label>

              <SelectField
                options={options}
                label=""
                disabled={hide}
                name="service"
                className="bglight-select"
                error={formState.errors["service"]}
                control={control}
                emitChange={(val: any) => setService(val)}
              />
            </div>
          </div>

          {service == "more" && (
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input">
                <label className="tooltip-title relative">
                  How many years of service do you have?{" "}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    If you have more than 2 years of service, enter the total
                    number of years worked.
                  </span>
                </label>

                <InputField
                  type="number"
                  error={formState.errors["serviceYears"]}
                  label=""
                  disabled={hide}
                  name="serviceYears"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
          )}

          <div className="col-12 col-md-6 mb-4 date-input">
            <div className="lease-input">
              <label className="tooltip-title relative">
                When did you start this position?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Indicate the date you started your current job.
                </span>
              </label>

              <DateField
                error={formState.errors["startPosition"]}
                label=""
                disabled={hide}
                name="startPosition"
                control={control}
                variant="filled"
                className="bglight-area p-2"
              />
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

export default AboutYourself;
