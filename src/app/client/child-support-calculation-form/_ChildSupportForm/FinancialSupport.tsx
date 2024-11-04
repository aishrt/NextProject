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
  proposedAmount: string;
  parentProposedAmount: string;
  payingAmount: string;
};

const FinancialSupport = ({ data }: { data: Child | undefined }) => {
  const schema = z.object({
    proposedAmount:
      data?.role == "Receiving Parent"
        ? z
            .string({ required_error: "Please enter your proposed amount" })
            .min(1, "Please enter your proposed amount")
        : z.string().optional(),
    parentProposedAmount:
      data?.role == "Receiving Parent"
        ? z
            .string({
              required_error: "Please enter your parent`s proposed amount",
            })
            .min(1, "Please enter your parent`s proposed amount")
        : z.string().optional(),

    payingAmount:
      data?.role == "Paying Parent"
        ? z
            .string({ required_error: "Please enter your proposed amount" })
            .min(1, "Please enter your proposed amount")
        : z.string().optional(),
  });

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "40");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { formState, control } = methods;

  useEffect(() => {
    setValues({
      proposedAmount: data?.proposedAmount?.toString(),
      parentProposedAmount: data?.parentProposedAmount?.toString(),
      payingAmount: data?.payingAmount?.toString(),
    });
  }, [data]);

  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    try {
      setLoading(true);

      const { data } = await axios.post(
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId, 
          ...values,
          progress: 60,
          nextProgress: 60,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");

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
          progress: 40,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
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
      <h3 className="f-22 bold mt-4  gray">
        Financial Support for Your Child(ren)
      </h3>
      <h4 className="f-16 mb-4 gray">
        Let&apos;s focus on the financial support your children need. From basic
        living expenses to additional costs like education and medical needs,
        this step ensures we cover all aspects of your child(ren)&apos;s
        well-being.
      </h4>
      <h4 className="f-18 bold">Child Support (CS):</h4>
      <p className="f-14 ">
        CS encompasses all financial support for your child(ren), including:
      </p>
      <ul className="legal-list gray f-14">
        <li>
          <span className="bold f-15">Basic Child Support: </span>Covers
          everyday living expenses like food, clothing, and shelter.
        </li>
        <li>
          <span className="bold f-15">Additional Expenses: </span>May include
          educational costs (tuition, supplies), extracurricular activities, and
          medical needs not covered by insurance.
        </li>
      </ul>

      <p className="f-14">
        The exact amount of CS is determined by the court, considering each
        child&apos;s needs and both parents&apos; incomes and expenses, as well
        as the number of other children each parent is financially responsible
        for.
      </p>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          {data?.role == "Receiving Parent" && (
            <>
              <h4 className="f-18 bold mt-5">For Receiving Parent:</h4>

              <div className="row mt-4">
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      Your Proposed Amount:
                      <Image className="bubble" src={bubble} alt="" />
                      <span className="hover-tip">
                        Please consider all children you are financially
                        responsible for, including those not shared with the
                        other parent. This information will help the court
                        assess your needs accurately.
                      </span>
                    </label>
                    <span className="f-14 d-block mb-3">
                      {" "}
                      How much financial support are you requesting for your
                      child(ren)&apos;s needs? Please enter a specific amount or
                      &quot;0&quot; if you need guidance.{" "}
                    </span>
                    <InputField
                      type="number"
                      error={formState.errors["proposedAmount"]}
                      label="Proposed Amount (€)"
                      name="proposedAmount"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>

                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      Other Parent Proposed Amount:
                      <Image className="bubble" src={bubble} alt="" />
                      <span className="hover-tip">
                        If the other parent has other children they are
                        financially responsible for, this may affect their
                        proposed amount. Please provide your best estimate based
                        on your knowledge of their situation.
                      </span>
                    </label>
                    <span className="f-14 d-block mb-3">
                      If you know the amount the other parent is proposing,
                      please enter it here. If not, provide your best estimate
                      of their proposed range.
                    </span>
                    <InputField
                      type="number"
                      error={formState.errors["parentProposedAmount"]}
                      label="Proposed Amount (€)"
                      name="parentProposedAmount"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {data?.role == "Paying Parent" && (
            <>
              <h4 className="f-18 bold mt-3">For Paying Parent:</h4>
              <div className="row mt-4">
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      Your Proposed Amount:
                      <Image className="bubble" src={bubble} alt="" />
                      <span className="hover-tip">
                        Please consider all children you are financially
                        responsible for, including those not shared with the
                        other parent. This information will help the court
                        assess your financial capacity accurately.
                      </span>
                    </label>
                    <span className="f-14 d-block mb-3">
                      How much financial support are you proposing to pay for
                      your child(ren)&apos;s needs? Please enter a specific
                      amount or &quot;0&quot; if you need guidance.
                    </span>
                    <InputField
                      type="number"
                      error={formState.errors["payingAmount"]}
                      label="Proposed Amount (€)"
                      name="payingAmount"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>
                <div className="col-12">
                  <p className="f-14 gray mt-2">
                    <span className="bold">Important Note:</span> Even if you
                    don&apos;t know the exact figures, providing your best
                    estimate is helpful. The court will ultimately determine the
                    final CS amount based on all relevant factors.
                  </p>
                </div>
              </div>
            </>
          )}

          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Button
                variant="contained"
                className="client-btn"
                size="lg"
                onClick={() => handlePrevious()}
              >
                Previous
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

export default FinancialSupport;
