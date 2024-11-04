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
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";
import axios from "axios";
import { Wrongful } from "@/types/Wrongful";
type FormValues = {
  age: string;
  title: string;
  salary: string;
  department: string;
  otherDepartment: string;
  years: string;
};

const options = [
  { label: "Front office", value: "Front office" },
  { label: "Human Resources", value: "Human Resources" },
  { label: "Legal", value: "Legal" },
  { label: " Finance/Accounting", value: "Finance/Accounting" },
  {
    label: "Production/Maintenance (IT; manual)",
    value: "Production/Maintenance (IT; manual)",
  },
  {
    label: "Research & Development (R&D)",
    value: "Research & Development (R&D)",
  },
  {
    label: "Business (sales/purchasing/communications)",
    value: "Business (sales/purchasing/communications)",
  },
  { label: "Management", value: "Management" },
  { label: "Other (please specify)", value: "other" },
];
const EmployeeDetails = ({
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
  params.set("progress", "30");

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [work, setWork] = useState("");

  const schema = z.object({
    age: z
      .string()
      .refine(
        (value) => {
          const numberValue = parseInt(value, 10);
          return !isNaN(numberValue) && numberValue >= 15 && numberValue <= 90;
        },
        {
          message: "Age must be a number between 15 and 90",
        }
      )
      .transform((value) => parseInt(value, 10)),

    title: z
      .string({
        required_error: "Please enter the employee's position or title",
      })
      .min(1, "Please enter the employee's position or title"),
    salary: z
      .string({
        required_error: "Please enter a valid monthly gross salary (in Euros)",
      })
      .min(1, "Please enter a valid monthly gross salary (in Euros)."),

    department: z
      .string({
        required_error: "Please select the employee's primary department",
        invalid_type_error: "Please select the employee's primary department",
      })
      .min(1, "Please select the employee's primary department"),

    otherDepartment:
      work == "other"
        ? z
            .string({
              required_error: "Please describe the other work department",
            })
            .min(1, "Please describe the other work department")
        : z.string().optional(),
    years: z
      .string({ required_error: "Please enter number of years" })
      .min(1, "Please enter number of years"),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      let payload: any = {
        caseId: caseId,
        ...values,
      };
      if (!hide) {
        payload = { ...payload, progress: 50, nextProgress: 50 };
      }
      const { data } = await axios.post(
        "/api/client/category/wrongful/createWrongful",
        payload
      );

      let id = data.data.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "50");
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
  console.log(formState.errors);

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/wrongful/createWrongful",
        {
          caseId: caseId,
          progress: 30,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");
      router.push(`/client/wrongful-termination?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      age: data?.age?.toString(),
      title: data?.title,
      salary: data?.salary?.toString(),
      department: data?.department,
      otherDepartment: data?.otherDepartment,
      years: data?.years?.toString(),
    });

    setWork(data?.department ?? "");
  }, [data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray pb-2">Employee Details</h3>
      <p className="f-14 gray">
        {data?.role == "Employee"
          ? "Your detailed answers will help us understand the circumstances of your termination and evaluate your situation accurately."
          : "Please provide accurate information about the employee involved so we can correctly evaluate the situation."}
      </p>

      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative my-3">
                  {data?.role == "Employee"
                    ? `How old were you at the time of termination?`
                    : `How old was the employee at the time of termination?`}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    In France, the legal minimum working age is 16, but some
                    exceptions exist for 15-year-olds under specific conditions.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["age"]}
                  label="Age"
                  name="age"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  {data?.role == "Employee"
                    ? `What was your gross monthly salary at the time of termination?`
                    : `What was the employee's gross monthly salary at the time of termination?`}

                  <Image src={bubble} className="bubble" alt="" />
                  <span className="hover-tip">
                    {data?.role == "Employee"
                      ? `Enter the employee's gross monthly salary in euros, including bonuses and benefits in kind. For example, €2500.`
                      : `Enter your gross monthly salary in euros, including bonuses and benefits in kind. For example, €2500.`}
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["salary"]}
                  label="€"
                  name="salary"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  {data?.role == "Employee"
                    ? `What was your position or title at the time of termination?`
                    : `What was the employee's position or title at the time of termination?`}
                  <Image src={bubble} className="bubble" alt="" />
                  <span className="hover-tip">
                    {data?.role == "Employee"
                      ? `Enter your position or title at the time of termination. For example, 'Sales Assistant.'`
                      : `Enter the employee's position or title at the time of termination. For example, 'Sales Assistant.'`}
                  </span>
                </label>
                <InputField
                  error={formState.errors["title"]}
                  label=""
                  name="title"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="tooltip-title relative mb-3">
                <label className="d-block">
                  {data?.role == "Employee"
                    ? `In which department did you primarily work?`
                    : `In which department did the employee primarily work?`}
                  <Image src={bubble} className="bubble" alt="" />
                  <span className="hover-tip">
                    {data?.role == "Employee"
                      ? `Select the primary department where you worked. If not listed, select 'Other' and specify. For example, 'Marketing.'`
                      : `Select the primary department where the employee worked. If not listed, select 'Other' and specify. For example, 'Marketing.'`}
                  </span>
                </label>

                <SelectField
                  options={options}
                  label=""
                  name="department"
                  className="bglight-select"
                  error={formState.errors["department"]}
                  control={control}
                  emitChange={(val: any) => setWork(val)}
                />
              </div>
              {work == "other" && (
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">Others</label>
                  <InputField
                    error={formState.errors["otherDepartment"]}
                    label="Others"
                    name="otherDepartment"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              )}
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  {data?.role == "Employee"
                    ? `How long did you work in the company?`
                    : `How long did the employee work in the company?`}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    {`Enter the total number of years the employee worked in the company. For example, '5 years.'`}
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["years"]}
                  label="Years"
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

export default EmployeeDetails;
