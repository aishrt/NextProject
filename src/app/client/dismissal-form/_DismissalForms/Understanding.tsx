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

type FormValues = {};

const schema = z.object({});

const Understanding = ({
  data,
  hide,
}: {
  data: Dismissal | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    situationErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!situation) {
      isError = true;
      errorObj = { ...errorObj, situationErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [situation, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.situationErr = false;
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
          progress: 10,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "10");
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
        situation,
      };

      if (!hide) {
        payload = { ...payload, progress: 30, nextProgress: 30 };
      }
      const { data } = await axios.post(
        "/api/client/category/dismissal/createDismissal",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "30");
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
    setValue(data?.situation ?? "");
  }, [data]);

  return (
    <div className="lease-form white-card p-4 mt-4 indivi-form rounded">
      <h3 className="f-26 mt-4">Understanding your situation</h3>
      <p className="f-15">
        We need to know if you are dealing with a constructive dismissal, where
        you left the company due to the employer&apos;s actions, or a
        termination, where the employer ended your contract. This helps us
        tailor the questions to fit your specific circumstances.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Is this a constructive dismissal or a termination?
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={situation}
                  disabled={hide}

                  onChange={handleChange}
                >
                  <Tooltip title="The employee takes the initiative to leave the company due to actions attributable to the employer, considering that these actions make the continuation of the employment contract impossible.">
                    <FormControlLabel
                      className="radio-light-ip"
                      disabled={hide}

                      value="Constructive Dismissal"
                      control={<Radio />}
                      label="Constructive Dismissal"
                    />
                  </Tooltip>

                  <Tooltip title="The employer ended your contract.">
                    <FormControlLabel
                                  disabled={hide}

                      className="radio-light-ip"
                      value="Termination"
                      control={<Radio />}
                      label="Termination"
                    />
                  </Tooltip>
                </RadioGroup>

                {errors.situationErr && (
                  <span className="text-danger">
                    Please select, if this a constructive dismissal or a
                    termination
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

export default Understanding;
