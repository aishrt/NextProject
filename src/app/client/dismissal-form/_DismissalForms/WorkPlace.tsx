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
  department: string;
  industry: string;
};

const options = [
  { label: "Front office", value: "Front office" },
  { label: "Human Resources", value: "Human Resources" },
  { label: "Legal", value: "Legal" },
  { label: "Finance/Accounting", value: "Finance/Accounting" },
  { label: "Production", value: "Production" },
  { label: "R&D", value: "R&D" },
  { label: "Business", value: "Business" },
  { label: "Management", value: "Management" },
];

const WorkPlace = ({
  data,
  hide,
}: {
  data: Dismissal | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({
    department: z
      .string({ required_error: "Please select the department" })
      .min(1, "Please select the department"),

    industry: z
      .string({ required_error: "Please select the company's industry sector" })
      .min(1, "Please select the company's industry sector"),
  });

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    employeeErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!employees) {
      isError = true;
      errorObj = { ...errorObj, employeeErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [employees, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.employeeErr = false;
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
          progress: 30,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");
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
        employees,
      };

      if (!hide) {
        payload = { ...payload, progress: 50, nextProgress: 50 };
      }
      const { data } = await axios.post(
        "/api/client/category/dismissal/createDismissal",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "50");
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
    setValue(data?.employees ?? "");
    setValues({ ...data });
  }, [data]);

  return (
    <div className="lease-form white-card p-4 mt-4 indivi-form rounded">
      <h3 className="f-26 mt-4">Details About Your Workplace</h3>
      <p className="f-15 ">
        Understanding the company you worked for, including its size and
        industry, helps us better evaluate your claim and provide relevant
        advice.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                Which department did you work in?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select the department in which you worked.
                </span>
              </label>

              <SelectField
                options={options}
                label=""
                disabled={hide}
                name="department"
                className="bglight-select"
                error={formState.errors["department"]}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What is the company&apos;s industry sector?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select the main industry sector of the company.
                </span>
              </label>

              <SelectField
                options={options}
                label=""
                name="industry"
                disabled={hide}
                className="bglight-select"
                error={formState.errors["industry"]}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                How many employees are there in the company?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Indicate the total number of employees in the company.
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  disabled={hide}
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={employees}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="1-10"
                    disabled={hide}
                    control={<Radio />}
                    label="1-10"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="11-50"
                    control={<Radio />}
                    label="11-50"
                    disabled={hide}
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="51-200"
                    disabled={hide}
                    control={<Radio />}
                    label="51-200"
                  />

                  <FormControlLabel
                    className="radio-light-ip"
                    value="200+"
                    disabled={hide}
                    control={<Radio />}
                    label="200+"
                  />
                </RadioGroup>

                {errors.employeeErr && (
                  <span className="text-danger">
                    Please select, how many employees are there in the company
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

export default WorkPlace;
