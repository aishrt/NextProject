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
import { Harassment } from "@/types/Harassment";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";

type FormValues = {
  age: string;
  salary: string;
  jobTitle: string;
  department: string;
  years: string;
  amount: string;
};

const options = [
  { label: "Unskilled Worker", value: "Unskilled Worker" },
  {
    label: "Skilled Worker / Technician",
    value: "Skilled Worker / Technician",
  },
  { label: "Supervisor", value: "Supervisor" },
  { label: "Manager", value: "Manager" },
  { label: "Senior Manager", value: "Senior Manager" },
];

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

const AboutYourself = ({
  data,
  hide,
}: {
  data: Harassment | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({
    age: z
      .string({ required_error: "Please enter the age" })
      .min(1, "Please enter the age"),

    salary: z
      .string({ required_error: "Please enter your gross monthly salary" })
      .min(1, "Please enter your gross monthly salary"),

    jobTitle: z
      .string({
        required_error: "Please enter the your job title",
        invalid_type_error: "Please enter the your job title",
      })
      .min(1, "Please enter the your job title"),

    department: z
      .string({
        required_error: "Please select the department",
        invalid_type_error: "Please select the department",
      })
      .min(1, "Please select the department"),

    years: z
      .string({ required_error: "Please enter years have you worked" })
      .min(1, "Please enter years have you worked"),

    amount: z
      .string({
        required_error: "Please enter the initially requesting amount",
      })
      .min(1, "Please enter the initially requesting amount"),
  });

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");
  const [service, setService] = useState("");

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
          progress: 10,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "10");
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
        payload = { ...payload, progress: 30, nextProgress: 30 };
      }
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "30");
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
      age: data?.age?.toString(),
      salary: data?.salary?.toString(),
      jobTitle: data?.jobTitle,
      department: data?.department,
      years: data?.years?.toString(),
      amount: data?.amount,
    });
  }, [data]);

  return (
    <div className="lease-form white-card rounded p-4 mt-4 indivi-form">
      <h6 className="f-26  fw-400">Tell us About Yourself</h6>
      <p className="f-15 pb-3">
        Let&apos;s start with your personal journey. We need to gather some
        personal information to better understand your situation. This will help
        us evaluate your request accurately.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What is your age?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Please enter your age at the date the harassment incidents
                  began. If the harassment started in January 2022 and you were
                  30 years old at that time, enter 30.
                </span>
              </label>

              <InputField
                type="number"
                error={formState.errors["age"]}
                label=""
                disabled={hide}
                name="age"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What is your gross monthly salary (€)?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Enter your total earnings before deductions, including regular
                  bonuses, commissions, and allowances. If your salary varies,
                  provide an average of the last 3 months. You can refer to your
                  pay stubs for this information. If you earn €2500 per month
                  before taxes and received an average of €300 in bonuses, enter
                  €2800.
                </span>
              </label>

              <InputField
                type="number"
                error={formState.errors["salary"]}
                label=" "
                name="salary"
                disabled={hide}

                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4 relative login-expert job-title">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What is your job title?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select the job title that best reflects your role at the time
                  of the harassment. If you are a maintenance technician, select
                  &quot;Skilled Worker / Technician&quot;.
                </span>
              </label>

              <SelectField
                options={options}
                label=""
                name="jobTitle"
                className="bglight-select"
                error={formState.errors["jobTitle"]}
                control={control}
                disabled={hide}

              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4  relative login-expert job-title">
            <div className="lease-input">
              <label className="tooltip-title relative">
                Which department do you work in?{" "}
              </label>

              <SelectField
                options={department}
                label=""
                name="department"
                className="bglight-select"
                disabled={hide}

                error={formState.errors["department"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                How many years have you worked for the company?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Enter the number of years you have worked for the company. If
                  you have been with the company for 5 years, enter 5.
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

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What amount are you initially requesting for compensation (€)?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Indicate the amount you are requesting as compensation for the
                  harassment. If you are requesting €10,000, enter €10,000.
                </span>
              </label>

              <InputField
                error={formState.errors["amount"]}
                label=""
                name="amount"
                variant="filled"
                className="bglight-ip"
                disabled={hide}

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
              className={`client-btn ${hide ? "d-none" : "block"}`}
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

export default AboutYourself;
