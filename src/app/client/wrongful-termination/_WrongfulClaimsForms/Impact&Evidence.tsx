"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import bubble from "@/assets/info.png";
import Image from "next/image";
import { InputField } from "@/components/Form/InputField";
import axios from "axios";
import { Wrongful } from "@/types/Wrongful";
import TextAreaField from "@/components/Form/TextArea";

type FormValues = {};

const terminationArr = [
  {
    label: "Difficulty finding new employment",
    value: "Difficulty finding new employment",
  },
  {
    label: "Negative impact on personal life (relationships, finances, etc.)",
    value: "Negative impact on personal life",
  },

  {
    label: "Feelings of humiliation or damage to dignity",
    value: "Feelings of humiliation or damage to dignity",
  },

  {
    label: "Negative impact on mental health (anxiety, depression, etc.)",
    value: "Negative impact on mental health",
  },

  {
    label: "Negative impact on physical health",
    value: "Negative impact on physical health",
  },
];

const evidenceArr = [
  {
    label: "Internal company documents (emails, performance reviews, etc.)",
    value: "Internal company documents",
  },
  {
    label: "Written notice of termination",
    value: "Written notice of termination",
  },
  {
    label: "Statements from union representatives",
    value: "Statements from union representatives",
  },

  {
    label: "Statements from healthcare professionals (doctors, therapists)",
    value: "Statements from healthcare professionals",
  },

  {
    label: "Witness statements from colleagues or friends",
    value: "Witness statements from colleagues or friends",
  },

  {
    label: "Medical records or certificates",
    value: "Medical records or certificates",
  },

  {
    label: "Other",
    value: "Other",
  },
];

const schema = z.object({});

const ImpactEvidence = ({
  data,
  hide,
}: {
  data: Wrongful | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId")!;

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const { formState, control } = methods;
  const router = useRouter();

  const [otherEvidence, setOther] = useState("");

  const [terminationAffect, setTermination] = React.useState<string[]>([]);

  const handleTermination = (label: number) => {
    setTermination((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.terminationErr = false;
        return newErrorObj;
      });

      return updatedCategories;
    });
  };

  const [evidenceProvide, setEvidence] = React.useState<string[]>([]);

  const handleEvidence = (label: number) => {
    setEvidence((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.evidenceErr = false;
        return newErrorObj;
      });

      return updatedCategories;
    });
  };

  const [errors, setErrors] = useState({
    terminationErr: false,
    evidenceErr: false,
    otherErr: false,
  });
  const errHandle = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (terminationAffect.length == 0) {
      isError = true;
      errorObj.terminationErr = true;
    }
    if (evidenceProvide.length == 0) {
      isError = true;
      errorObj.evidenceErr = true;
    }

    if (evidenceProvide.includes("Other") && !otherEvidence) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
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
      let payload: any = {
        caseId: caseId,
        terminationAffect,
        evidenceProvide,
        otherEvidence: evidenceProvide.includes("Other") ? otherEvidence : "",
      };

      if (!hide) {
        payload = { ...payload, progress: 90, nextProgress: 90 };
      }
      const { data } = await axios.post(
        "/api/client/category/wrongful/createWrongful",
        payload
      );

      let id = data.data.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "90");

        router.push(`/client/wrongful-termination?${searchParam.toString()}`);
      }

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
        "/api/client/category/wrongful/createWrongful",
        {
          caseId: caseId,
          progress: 70,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");
      router.push(`/client/wrongful-termination?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray ">Impact and Evidence </h3>

      <p className="f-14 gray">
        {`Your detailed answers and provided evidence will help us evaluate
          ${
            data?.role == "Employee" ? `your claim` : `the situation`
          } accurately and fairly.`}
      </p>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          {/* <p className="f-14 gray bold">
            What was the reason for your termination?
          </p> */}
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="radio-end-input mb-3">
                <label className="tooltip-title relative">
                  {data?.role == "Employee"
                    ? `How did the termination affect you?`
                    : `How do you think the termination affected the employee?`}

                  <Image src={bubble} className="bubble" alt="" />
                  <span className="hover-tip">
                    {data?.role == "Employee"
                      ? `Check all the options describing the impacts of the termination on you. For example, 'Difficulty finding new employment.'`
                      : `Check all the options describing the potential impacts of the termination on the employee. For example, 'Difficulty finding new employment.'`}
                  </span>
                </label>

                <FormGroup>
                  {terminationArr.map((i: any, index: number) => {
                    return (
                      <FormControlLabel
                        key={index}
                        className="radio-light-ip"
                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleTermination(i.value)}
                        checked={terminationAffect.includes(i.value) ?? false}
                      />
                    );
                  })}
                </FormGroup>

                {errors.terminationErr && (
                  <div>
                    <span className="text-danger">
                      Please select the termination affect
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="radio-end-input mb-3">
                <label className="tooltip-title relative">
                  {data?.role == "Employee"
                    ? `What evidence can you provide to support your wrongful termination claim?`
                    : `What evidence can you provide to support your position regarding the termination?`}
                  <Image src={bubble} className="bubble" alt="" />
                  <span className="hover-tip">
                    {`Check the evidence you can provide to support your ${
                      data?.role == "Employee"
                        ? `wrongful termination claim.`
                        : `position regarding the termination.`
                    } Upload relevant files. For example, 'Written notice of termination.' The more details you provide, the more we can refine the evaluation of your situation.`}
                  </span>
                </label>

                <FormGroup>
                  {evidenceArr.map((i: any, index: number) => {
                    return (
                      <FormControlLabel
                        key={index}
                        className="radio-light-ip"
                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleEvidence(i.value)}
                        checked={evidenceProvide.includes(i.value) ?? false}
                      />
                    );
                  })}
                </FormGroup>

                {errors.evidenceErr && (
                  <div>
                    <span className="text-danger">
                      Please select the evidence support
                    </span>
                  </div>
                )}
              </div>
            </div>

            {evidenceProvide.includes("Other") && (
              <div className="lease-input">
                <label className="tooltip-title relative">Please specify</label>
                <TextField
                  fullWidth
                  id="filled-basic"
                  label="Other"
                  variant="filled"
                  value={otherEvidence}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setOther(event.target.value);
                    setErrors((prev) => {
                      let newErrorObj = { ...prev };
                      newErrorObj.otherErr = false;
                      return newErrorObj;
                    });
                  }}
                />
                {errors.otherErr && (
                  <div>
                    <span className="text-danger">
                      Please describe the other statement
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="col-12 text-center mt-4">
            <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
              <Button
                variant="outline"
                size="lg"
                className={`green-border f-16 ${hide ? "d-none" : "block"}`}
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                type="submit"
                variant="contained"
                className={`green-btn wrongful-submit-btn ${
                  hide ? "d-none" : "block"
                }`}
                size="lg"
                onClick={errHandle}
              >
                Next
              </Button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default ImpactEvidence;
