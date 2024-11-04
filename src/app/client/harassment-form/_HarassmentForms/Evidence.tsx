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
  otherSpecify: string;
};
const evidenceArr = [
  {
    label: "Do you have internal testimonies from colleagues?",
    value: "internal testimonies",
    tooltip:
      "Statements from current staff who witnessed the harassment. If a colleague testified in your favor, check this box.",
  },
  {
    label: "Do you have testimonies from union representatives?",
    value: "union representatives",
    tooltip:
      "Statements from union officials informed of the harassment. If a union representative testified, check this box.",
  },
  {
    label:
      "Do you have other evidence (emails, recordings, medical documents, etc.)?",
    value: "other evidence",
    tooltip: "",
  },
];

const Evidence = ({
  data,
  hide,
}: {
  data: Harassment | undefined | null;
  hide: boolean;
}) => {
  const [otherEvidence, setOther] = React.useState("");

  const schema = z.object({
    otherSpecify:
      otherEvidence == "yes"
        ? z
            .string({ required_error: "Please describe" })
            .min(1, "Please describe")
        : z.string().optional(),
  });

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    typeErr: false,
    allegedErr: false,
    otherErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (evidenceTypes.length == 0) {
      isError = true;
      errorObj = { ...errorObj, typeErr: true };
    }

    if (!alleged) {
      isError = true;
      errorObj = { ...errorObj, allegedErr: true };
    }
    if (evidenceTypes.includes("other evidence") && !otherEvidence) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [evidenceTypes, setEvidence] = React.useState<string[]>([]);

  const handleEvidence = (label: number) => {
    setEvidence((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.typeErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const [alleged, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.allegedErr = false;
      return newErrorObj;
    });
  };

  const handleOther = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOther((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.otherErr = false;
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
          progress: 60,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");
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
        evidenceTypes,
        otherEvidence: evidenceTypes.includes("other evidence")
          ? otherEvidence
          : "",
        otherSpecify: otherEvidence == "yes" ? values.otherSpecify : "",
        alleged,
      };

      console.log(payload);

      if (!hide) {
        payload = { ...payload, progress: 80, nextProgress: 80 };
      }
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "80");
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
    setEvidence(data?.evidenceTypes ?? []);
  }, [data]);

  return (
    <div className="lease-form white-card rounded p-4 mt-4 indivi-form">
     <h6 className="f-26  fw-400">Evidence</h6>
      <p className="f-15 pb-3">
        Share the evidence you have gathered. Providing evidence will strengthen
        your case.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-12 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                Please check all applicable types of evidence you have:
              </label>

              <FormGroup>
                {evidenceArr.map((i: any, index: number) => {
                  return (
                    <Tooltip
                      key={index}
                      title={i.tooltip}
                      placement="bottom"
                      arrow
                    >
                      <FormControlLabel
                        key={index}
                        className="radio-light-ip"
                        control={<Checkbox />}
                        disabled={hide}

                        label={i.label}
                        onChange={() => handleEvidence(i.value)}
                        checked={evidenceTypes.includes(i.value) ?? false}
                      />
                    </Tooltip>
                  );
                })}
              </FormGroup>

              {evidenceTypes.includes("other evidence") && (
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100 ms-5"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    row
                    name="controlled-radio-buttons-group"
                    value={otherEvidence}
                    onChange={handleOther}
                  >
                    <FormControlLabel
                      className=""
                      value="yes"
                      control={<Radio />}
                      disabled={hide}

                      label="Yes"
                    />
                    <FormControlLabel
                      className=""
                      disabled={hide}

                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>

                  {errors.otherErr && (
                    <span className="text-danger">
                      Please select, if you have other evidence
                    </span>
                  )}
                </FormControl>
              )}
              {otherEvidence == "yes" && (
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input">
                    <label className="tooltip-title relative">
                      Please describe briefly{" "}
                    </label>
                    <InputField
                      error={formState.errors["otherSpecify"]}
                      label=""
                      name="otherSpecify"
                      disabled={hide}

                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>
              )}
              {errors.typeErr && (
                <span className="text-danger">
                  Please check types of evidence you have
                </span>
              )}
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Was the employer informed of the alleged facts?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  If you informed your employer about the harassment, select
                  &quot;Yes&quot;.
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={alleged}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    disabled={hide}

                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="no"
                    disabled={hide}

                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>

                {errors.allegedErr && (
                  <span className="text-danger">
                    Please select, if the employer informed of the alleged facts
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

export default Evidence;
