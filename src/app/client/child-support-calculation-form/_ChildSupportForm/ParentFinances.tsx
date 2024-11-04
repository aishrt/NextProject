"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Form/Button";
import { NumberField } from "@/components/Form/NumberField";
import bubble from "@/assets/info.png";
import Image from "next/image";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Child } from "@/types/Child";
import { InputField } from "@/components/Form/InputField";

type FormValues = {
  otherMonthlyIncome: string;
  otherMonthlyExpenses: string;
  otherChildren: string;
};
const schema = z.object({
  otherMonthlyIncome: z
    .string({ required_error: "Please enter monthly income" })
    .min(1, "Please enter monthly income"),
  otherMonthlyExpenses: z
    .string({ required_error: "Please enter monthly expenses" })
    .min(1, "Please enter monthly expenses"),

  otherChildren: z
    .string({ required_error: "Please enter children number" })
    .min(1, "Please enter children number"),
});

const ParentFinances = ({ data }: { data: Child | undefined }) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "30");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { formState, control } = methods;

  useEffect(() => {
    setValues({
      otherMonthlyIncome: data?.otherMonthlyIncome?.toString(),
      otherMonthlyExpenses: data?.otherMonthlyExpenses?.toString(),
      otherChildren: data?.otherChildren?.toString(),
    });
  }, [data]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          ...values,
          progress: 50,
          nextProgress: 50,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");

      router.push(
        `/client/child-support-calculation-form?${searchParam.toString()}`
      );

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
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          progress: 30,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");
      router.push(
        `/client/child-support-calculation-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="lease-form white-card p-4 rounded mt-4  indivi-form">
      <h3 className="f-22 bold mt-4 pb-4 gray">Other Parent Finances</h3>
      <h4 className="f-16 mb-4 gray">
        To ensure a fair assessment, we also need information about the other
        parent&apos;s finances. Knowing their income and expenses helps us evaluate
        their ability to contribute to child support.
      </h4>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Other Parent&apos;s Monthly Income:
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    If you don&apos;t know the exact amount, provide your best
                    estimate based on their occupation, lifestyle, or any
                    information you have. Include all sources of income, such as
                    salary, bonuses, rental income, investments, alimony,
                    pensions, retirement benefits, family allowances, social
                    assistance, and any other regular income.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["otherMonthlyIncome"]}
                  label="Monthly Income (€)"
                  name="otherMonthlyIncome"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Other Parent&apos;s Monthly Expenses:
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    If you don&apos;t know the exact amount, provide your best
                    estimate based on their lifestyle or any information you
                    have. If they have other children, consider their expenses
                    as well. Include housing expenses (rent, mortgage payments,
                    property taxes, homeowners insurance), utilities
                    (electricity, gas, water, trash), food, transportation,
                    childcare, healthcare (health insurance premiums, co-pays,
                    prescriptions), other insurance (life, car, etc.), and any
                    other necessary expenses. Exclude any consumer debt payments
                    (credit cards, personal loans).
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["otherMonthlyExpenses"]}
                  label="Monthly Expenses (€)"
                  name="otherMonthlyExpenses"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  How many other children is the other parent financially
                  responsible for?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    This includes children from other relationships, whether or
                    not they live with you. This information is important for
                    determining your financial capacity and needs.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["otherChildren"]}
                  label="Number of Children"
                  name="otherChildren"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Button
                variant="contained"
                size="lg"
                className="client-btn"
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                type="submit"
                variant="outline"
                size="lg"
                className="next-btn"
              >
                <span className="f-16">Next</span>
              </Button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default ParentFinances;
