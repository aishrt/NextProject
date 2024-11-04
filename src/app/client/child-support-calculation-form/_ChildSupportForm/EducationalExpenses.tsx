"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { NumberField } from "@/components/Form/NumberField";
import bubble from "@/assets/info.png";
import Image from "next/image";
import TextAreaField from "@/components/Form/TextArea";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Child } from "@/types/Child";
import { InputField } from "@/components/Form/InputField";

type FormValues = {
  educational: string;
  describe: string;
};

const schema = z.object({
  educational: z.string({ required_error: "" }).optional(),
  describe: z.string({ required_error: "" }).optional(),
});

const EducationalExpenses = ({ data }: { data: Child | undefined }) => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "50");

  const { formState, control } = methods;

  useEffect(() => {
    setValues({
      educational: data?.educational?.toString(),
      describe: data?.describe,
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
          progress: 70,
          nextProgress: 70,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");
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
          progress: 50,
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
    }
  };

  return (
    <div className="lease-form white-card p-4 rounded mt-4  indivi-form">
      <h3 className="f-22 bold mt-4  gray">Educational Expenses (Optional)</h3>

      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-4">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Estimated educational expenses per child:
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Include tuition, fees, books, and supplies for each child
                    involved in this request. This can help the court assess the
                    overall financial needs related to education.
                  </span>
                </label>

                <InputField
                  type="number"
                  error={formState.errors["educational"]}
                  label="Proposed Amount (€)"
                  name="educational"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  Any additional relevant information:
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Please provide any additional details about the child&apos;s
                    education, such as special needs, extracurricular
                    activities, or any anticipated future expenses that might
                    impact child support calculations.
                  </span>
                </label>

                <TextAreaField
                  name="describe"
                  label=""
                  error={formState.errors["describe"]}
                  control={control}
                  variant="filled"
                  className="bglight-area"
                />
              </div>
            </div>
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
          </div>
        </Form>
      )}
    </div>
  );
};

export default EducationalExpenses;
