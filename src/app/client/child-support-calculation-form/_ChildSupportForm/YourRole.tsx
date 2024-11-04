"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Child } from "@/types/Child";

type FormValues = {};

const schema = z.object({});

const YourRole = ({ data }: { data: Child | undefined }) => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const { formState, control } = methods;

  useEffect(() => {
    setValue(data?.role ?? "");
  }, [data]);

  const [role, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.roleErr = false;
      return newErrorObj;
    });
  };

  const [errors, setErrors] = useState({
    roleErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!role) {
      isError = true;
      errorObj = { ...errorObj, roleErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }

      const { data } = await axios.post(
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          role,
          progress: 30,
          nextProgress: 30,
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
          progress: 10,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "10");
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
    <div className="lease-form white-card p-4 rounded mt-4">
      <h3 className="f-22 bold mt-4 pb-3 gray">Your Role</h3>

      <h4 className="f-16  gray">
        Let&apos;s identify your role in this process. Are you the parent
        providing support or the one receiving it? Understanding your role helps
        us tailor the questions to your specific situation, ensuring we gather
        the most relevant information for your case.
      </h4>

      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-12 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Please indicate your role in this request:
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={role}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="Paying Parent"
                    control={<Radio />}
                    label="Paying Parent (I am paying child support)"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="Receiving Parent"
                    control={<Radio />}
                    label="Receiving Parent (I am receiving child support)"
                  />
                </RadioGroup>

                {errors.roleErr && (
                  <span className="text-danger">Please select the role</span>
                )}
              </FormControl>
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
    </div>
  );
};

export default YourRole;
