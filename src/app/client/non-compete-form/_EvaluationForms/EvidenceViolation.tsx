"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import bubble from "@/assets/info.png";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import axios from "axios";

import TextField from "@mui/material/TextField";
import { Compete } from "@/types/Compete";

type FormValues = {
  clause: string;
  company: string;
  position: string;
  date: string;
  business: string;
};

const schema = z.object({
  // industry: z.string().min(1, "please select Industry"),
  // employee: z.string().min(1, "Employee is required"),
  // date: z.string().min(1, "Date is required"),
  // occupation: z.string().min(1, "Occupation is required"),
  // floor: z.string().min(1, "Floor is required"),
});

const EvidenceViolation = ({
  data,
  hide,
}: {
  data: Compete | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  let evidenceArr: {
    label: string;
    value: string;
  }[] = [
    {
      label: "Testimony",
      value: "Testimony",
    },
    {
      label: "Presence at new company's premises",
      value: "Presence at new company's premises",
    },
    {
      label: "Bailiff's report",
      value: "Bailiff's report",
    },

    {
      label: "Mentions on the internet (website, LinkedIn profile, etc.)",
      value: "Mentions on the internet (website, LinkedIn profile, etc.)",
    },

    {
      label: "Other",
      value: "other",
    },
  ];
  const [otherViolation, setOther] = React.useState("");

  const [violationEvidence, setEvidence] = React.useState<string[]>([]);

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

  const router = useRouter();

  const [errors, setErrors] = useState({
    evidenceErr: false,
    otherErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (violationEvidence.length == 0) {
      isError = true;
      errorObj = { ...errorObj, evidenceErr: true };
    }

    if (violationEvidence.includes("other") && !otherViolation) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/non-competition/createCompetition",
        {
          caseId: caseId,
          progress: 40,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
      router.push(`/client/non-compete-form?${searchParam.toString()}`);
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
        violationEvidence,
        otherViolation: violationEvidence.includes("other")
          ? otherViolation
          : "",
        // progress: 60,
        // nextProgress: 60,
      };
      if (!hide) {
        payload = { ...payload, progress: 60, nextProgress: 60 };
      }
      const { data } = await axios.post(
        "/api/client/category/non-competition/createCompetition",
        payload
      );
     
      let id = data.data.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "60");

        router.push(`/client/non-compete-form?${searchParam.toString()}`);
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
    setEvidence(data?.violationEvidence ?? []);
    setOther(data?.otherViolation ?? "");
  }, [data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray">Evidence of Violation</h3>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-12 mb-4">
            <div className="mb-3  radio-end-input two-cols">
              <label className="tooltip-title relative">
                {`What evidence or information can be provided to support the claim of a breach of the non-compete clause?`}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  {`In French law, valid evidence can include formal
                  notifications, bailiff's reports, or documented instances of
                  the employee engaging in competitive activities.`}
                </span>
              </label>

              <FormGroup>
                {evidenceArr.map((i: any, index: number) => {
                  return (
                    <FormControlLabel
                      key={index}
                      className="radio-light-ip"
                      control={<Checkbox />}
                      disabled={hide}
                      label={i.label}
                      onChange={() => handleEvidence(i.value)}
                      checked={violationEvidence.includes(i.value) ?? false}
                    />
                  );
                })}
              </FormGroup>
              {errors.evidenceErr && (
                <span className="text-danger">
                  Please select the evidence of violation
                </span>
              )}
            </div>
          </div>

          <div>
            {violationEvidence.includes("other") && (
              <TextField
              disabled={hide}
                fullWidth
                id="filled-basic"
                label="Other"
                variant="filled"
                value={otherViolation}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setOther(event.target.value);
                  setErrors((prev) => {
                    let newErrorObj = { ...prev };
                    newErrorObj.otherErr = false;
                    return newErrorObj;
                  });
                }}
              />
            )}
            {errors.otherErr && (
              <div>
                <span className="text-danger">
                  Please describe the other evidence of violation
                </span>
              </div>
            )}
          </div>
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
              variant="primary"
              className={`green-btn compete-submit-btn ${
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

export default EvidenceViolation;
