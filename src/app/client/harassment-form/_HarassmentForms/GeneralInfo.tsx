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
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Tooltip } from "@mui/material";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";
import { Harassment } from "@/types/Harassment";

type FormValues = {
  committed: string;
};
const committedArr = [
  { label: " Colleague", value: "Colleague" },
  { label: " Supervisor", value: "Supervisor" },
  { label: " Company Director", value: "Company Director" },
  { label: " Other", value: "Other" },
];

const GeneralInfo = ({
  data,
  hide,
}: {
  data: Harassment | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({
    committed: z
      .string({ required_error: "Please select, who committed the harassment" })
      .min(1, "Please select, Who committed the harassment "),
  });

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    splErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!splRelationship) {
      isError = true;
      errorObj = { ...errorObj, splErr: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [splRelationship, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.splErr = false;
      return newErrorObj;
    });
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        {
          caseId: caseId,
          progress: 40,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
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
      if (errHandle()) {
        return;
      }
      let payload: any = {
        caseId: caseId,
        ...values,
        splRelationship,
      };

      if (!hide) {
        payload = { ...payload, progress: 60, nextProgress: 60 };
      }
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "60");
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
    setValue(data?.splRelationship ?? "");
    setValues({ committed: data?.committed });
  }, [data]);

  return (
    <div className="lease-form white-card rounded p-4 mt-4 indivi-form">
      <h6 className="f-26  fw-400">General Information</h6>
      <p className="f-15 pb-3">
        Let&apos;s delve into the harassment incidents. We need to understand
        more about the harassment incidents to evaluate your request accurately.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4 relative login-expert job-title">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Who committed the harassment?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select the person who committed the harassment. If your
                  supervisor committed the harassment, select
                  &quot;Supervisor&quot;.
                </span>
              </label>

              <SelectField
                options={committedArr}
                label=""
                disabled={hide}

                name="committed"
                className="bglight-select"
                error={formState.errors["committed"]}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Does the harasser have a special relationship with the employer?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select if the harasser has a privileged relationship with the
                  employer (e.g., family member, close friend).
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={splRelationship}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="yes"
                    disabled={hide}

                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="no"
                    control={<Radio />}
                    label="No"
                    disabled={hide}

                  />
                </RadioGroup>

                {errors.splErr && (
                  <span className="text-danger">
                    Please select, if harasser have a special relationship with
                    the employer
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
              className={`client-btn harassment-submit-btn ${
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

export default GeneralInfo;
