"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import bubble from "@/assets/info.png";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";
import { Harassment } from "@/types/Harassment";

type FormValues = {
  workDepartment: string;
  employees: string;
  reason: string;
};

const department = [
  { label: "Front Office", value: "Front Office" },
  {
    label: "Human Resources",
    value: "Human Resources",
  },
  { label: "Legal", value: "Legal" },
  { label: "Finance/Accounting", value: "Finance/Accounting" },
  {
    label: "Production/Maintenance (IT Specialist, Manicurist)",
    value: "Production/Maintenance",
  },

  { label: "Research & Development", value: "Research & Development" },

  {
    label: "Sales/Purchasing/Communications",
    value: "Sales/Purchasing/Communications",
  },

  { label: "Management", value: "Management" },
];
const reasonArr = [
  { label: "Serious Misconduct", value: "Serious Misconduct" },
  {
    label: "Gross Misconduct",
    value: "Gross Misconduct",
  },
  { label: "Very Serious Misconduct", value: "Very Serious Misconduct" },
  { label: "Professional Inadequacy", value: "Professional Inadequacy" },
  {
    label: "Illness/Unfitness",
    value: "Illness/Unfitness",
  },
  { label: "Other Personal Reason", value: "Other Personal Reason" },
  {
    label: "Economic Difficulties",
    value: "Economic Difficulties",
  },
  { label: "Technological Change", value: "Technological Change" },
  { label: "Reorganization", value: "Reorganization" },
  { label: "Cessation of Activity", value: "Cessation of Activity" },
  { label: "Other Economic Reason", value: "Other Economic Reason" },
];
const Employer = ({
  data,
  hide,
}: {
  data: Harassment | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({
    workDepartment: z
      .string({ required_error: "Please select the department" })
      .min(1, "Please select the department"),

    employees: z
      .string({ required_error: "Please enter the no. of employees" })
      .min(1, "Please enter the no. of employees"),

    reason: z
      .string({ required_error: "Please select the reason" })
      .min(1, "Please select the reason"),
  });

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        {
          caseId: caseId,
          progress: 30,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");
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

      let payload: any = {
        caseId: caseId,
        ...values,
      };

      if (!hide) {
        payload = { ...payload, progress: 50, nextProgress: 50 };
      }
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "50");
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
    setValues({
      workDepartment: data?.workDepartment,
      employees: data?.employees?.toString(),
      reason: data?.reason,
    });
  }, [data]);

  return (
    <div className="lease-form white-card rounded p-4 mt-4 indivi-form">
       <h6 className="f-26  fw-400">Employer Information</h6>
      <p className="f-15 pb-3">
        Tell us more about your workplace. Details about your employer will help
        us understand the context of your work environment and the actions
        taken.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4 relative login-expert job-title">
            <div className="lease-input">
              <label className="tooltip-title relative">
                Which department do you work in?{" "}
              </label>

              <SelectField
                              disabled={hide}

                options={department}
                label=""
                name="workDepartment"
                className="bglight-select"
                error={formState.errors["workDepartment"]}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                How many employees are in your department?
              </label>

              <InputField
                type="number"
                error={formState.errors["employees"]}
                disabled={hide}

                label=""
                name="employees"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4 relative login-expert job-title">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What reason did your employer give for any actions taken against
                you? <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select the reason given for any actions taken against you
                  (e.g., dismissal, demotion). Refer to any disciplinary notices
                  or official communications you received.
                </span>
              </label>

              <SelectField
                options={reasonArr}
                label=""
                name="reason"
                disabled={hide}

                className="bglight-select"
                error={formState.errors["reason"]}
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
              className={`client-btn ${
                hide ? "d-none" : "block"
              }`}
              size="lg"
            >
              <span className="f-16">Next</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Employer;
