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
import { Harassment } from "@/types/Harassment";

type FormValues = {
  situation: string;
};

const EmployerAction = ({
  data,
  hide,
}: {
  data: Harassment | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({
    situation: z
      .string({
        required_error: "Please enter the actions has your employer taken",
      })
      .min(1, "Please enter the actions has your employer taken"),
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
          progress: 80,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "80");
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
        payload = { ...payload, progress: 100, nextProgress: 100 };
      }
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "100");
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
      situation: data?.situation,
    });
  }, [data]);

  return (
    <div className="lease-form white-card rounded p-4 mt-4 indivi-form">
      <h6 className="f-26  fw-400">Employer Actions</h6>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                What actions has your employer taken to address the situation?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Describe any actions taken by the employer (official
                  responses, policy changes, disciplinary actions). If no action
                  was taken, please state this. The more details you provide,
                  the better we can evaluate your case.
                </span>
              </label>

              <InputField
                error={formState.errors["situation"]}
                label=""
                name="situation"
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
              className={`client-btn harassment-submit-btn ${
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

export default EmployerAction;
