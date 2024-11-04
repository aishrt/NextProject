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
  CircularProgress,
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
  age: string;
  salary: string;
  position: string;
  years: string;
};

const options = [
  {
    label: "Customer Service",
    value: "Customer Service",
    tooltip:
      "Department handling client interactions. Ex: Reception, After-sales service",
  },

  {
    label: "Human Resources",
    value: "Human Resources",
    tooltip:
      "Department managing personnel. Ex: Recruitment, Employee Training",
  },

  {
    label: "Legal",
    value: "Legal",
    tooltip: "Department handling legal affairs. Ex: Legal Advisor, Paralegal",
  },

  {
    label: "Finance/Accounting",
    value: "Finance/Accounting",
    tooltip:
      "Department managing company finances. Ex: Accountant, Financial Analyst",
  },

  {
    label: "Production/Maintenance (IT or manual)",
    value: "Production/Maintenance",
    tooltip:
      "Department managing production and equipment maintenance. Ex: Maintenance Technician, Production Operator)",
  },

  {
    label: "Research and Development",
    value: "Research and Development",
    tooltip:
      "Department in charge of innovation and product development. Ex: Researcher, R&D Engineer)",
  },

  {
    label: "Commerce (Sales, Purchasing, Communication)",
    value: "Commerce",
    tooltip:
      "Department handling sales, purchases, and company communication. Ex: Salesperson, Buyer, Communication Officer)",
  },

  {
    label: "Management",
    value: "Management",
    tooltip:
      "Department managing and directing the company. Ex: Department Director, Team Manager",
  },
];

const AboutYourself = ({
  data,
  hide,
}: {
  data: Vexatious | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({
    age: z
      .string({ required_error: "Please enter the age" })
      .min(1, "Please enter the age"),

    salary: z
      .string({ required_error: "Please enter your gross monthly salary" })
      .min(1, "Please enter your gross monthly salary"),

    position: z
      .string({
        required_error: "Please enter the position",
        invalid_type_error: "Please enter the position",
      })
      .min(1, "Please enter the position"),

    // department: z
    //   .string({
    //     required_error: "Please select the department",
    //   })
    //   .min(1, "Please select the department"),

    years: z
      .string({
        required_error: "Please enter the years",
      })
      .min(1, "Please enter the years"),
  });

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const res: any = options.find((i) => {
    return i.value == data?.department;
  });

  const [selectOption, setSelectOption] = React.useState<{
    label: string;
    value: string;
    tooltip: string;
  }>(res);

  const [errors, setErrors] = useState({
    err: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!selectOption) {
      isError = true;
      errorObj = { ...errorObj, err: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/vexatious/createVexatious",
        {
          caseId: caseId,
          progress: 10,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "10");
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
        department: selectOption?.value,
      };

      if (!hide) {
        payload = { ...payload, progress: 30, nextProgress: 30 };
      }
      const { data } = await axios.post(
        "/api/client/category/vexatious/createVexatious",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "30");
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
      age: data?.age?.toString(),
      salary: data?.salary?.toString(),
      position: data?.position,
      years: data?.years?.toString(),
    });
  }, [data]);

  return (
    <div className="lease-form white-card rounded mt-4 indivi-form p-4">
      <h3 className="f-26 mt-4">Tell us About Yourself</h3>
      <p className="f-15">
        Before diving into the details of your dismissal, let&apos;s start by
        getting to know you better. This basic information will help us
        understand your context.
      </p>
      {/* {data && !selectOption ? (
        <CircularProgress />
      ) : ( */}
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                How old are you?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Please enter your age in complete years. Ex: 30
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
                What was your gross monthly salary (before taxes) at the time of
                your dismissal?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Enter the total amount you received each month before tax
                  deductions. Ex: $2500
                </span>
              </label>

              <InputField
                type="number"
                error={formState.errors["salary"]}
                label=""
                name="salary"
                variant="filled"
                disabled={hide}
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What was your position in the company?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Mention your official job title. Ex: Salesperson, Marketing
                  Manager
                </span>
              </label>

              <InputField
                error={formState.errors["position"]}
                label=""
                name="position"
                variant="filled"
                className="bglight-ip"
                disabled={hide}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4 department-input">
            <div className="lease-input">
              <label className="tooltip-title relative">
                Which department did you work in?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Choose the department where you worked
                </span>
              </label>
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                disabled={hide}
                className="w-100 rounded bglight-ip p-0"
                options={options}
                value={selectOption}
                // value={{
                //   label: "Legal",
                //   value: "Legal",
                //   tooltip:
                //     "Department handling legal affairs. Ex: Legal Advisor, Paralegal",
                // }}
                onChange={(event, newValue: any) => {
                  setSelectOption(newValue);
                  setErrors((prev) => {
                    let newErrorObj = { ...prev };
                    newErrorObj.err = false;
                    return newErrorObj;
                  });
                }}
                renderInput={(params) => (
                  <Tooltip title={selectOption?.tooltip ?? ""} arrow>
                    <TextField {...params} label="" />
                  </Tooltip>
                )}
                getOptionLabel={(option) => option.label}
              />
            </div>
            {errors.err && (
              <span className="text-danger">Please select the department</span>
            )}
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                How many years did you work at this company?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Enter the total number of years spent at the company. Ex: 5
                </span>
              </label>

              <InputField
                disabled={hide}
                type="number"
                error={formState.errors["years"]}
                label=""
                name="years"
                variant="filled"
                className="bglight-ip"
                control={control}
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
      {/* )} */}
    </div>
  );
};

export default AboutYourself;
