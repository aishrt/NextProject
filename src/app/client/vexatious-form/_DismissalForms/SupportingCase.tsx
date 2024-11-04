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
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Tooltip } from "@mui/material";
import DateField from "@/components/Form/DateField";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";
import { Vexatious } from "@/types/Vexatious";

type FormValues = {};

const dismissalArr = [
  {
    label: "Internal testimonies at the company",
    value: "Internal testimonies at the company",
    tooltip:
      "Check this box if you have testimonies from colleagues or internal company sources.",
  },

  {
    label: "Union representatives' testimonies",
    value: "Union representatives' testimonies",
    tooltip:
      "Check this box if you have testimonies from union representatives.",
  },

  {
    label: "External professional testimony",
    value: "External professional testimony",
    tooltip:
      "Check this box if you have testimonies from external professionals such as industry experts.",
  },

  {
    label: "Private life testimony",
    value: "Private life testimony",
    tooltip:
      "Check this box if you have testimonies from individuals in your personal life who can attest to your situation.",
  },

  {
    label: "Certificate from treating doctor",
    value: "Certificate from treating doctor",
    tooltip:
      "Check this box if you have a certificate from your treating doctor.",
  },

  {
    label: "Certificate from occupational doctor",
    value: "Certificate from occupational doctor",
    tooltip:
      "Check this box if you have a certificate from your occupational doctor.",
  },
  {
    label: "Certificate from psychiatrist",
    value: "Certificate from psychiatrist",
    tooltip: "Check this box if you have a certificate from a psychiatrist.",
  },
  {
    label: "Written evidence",
    value: "Written evidence",
    tooltip:
      "Check this box if you have any written evidence, such as emails, letters, or documents.",
  },
  {
    label: "Complaint",
    value: "Complaint",
    tooltip: "Check this box if you have filed a formal complaint.",
  },
];

const SupportingCase = ({
  data,
  hide,
}: {
  data: Vexatious | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({});

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    checkErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (evidence.length == 0) {
      isError = true;
      errorObj = { ...errorObj, checkErr: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [evidence, setEvidence] = React.useState<string[]>([]);

  const handleEvidence = (label: number) => {
    setEvidence((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.checkErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/vexatious/createVexatious",
        {
          caseId: caseId,
          progress: 60,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");
      router.push(`/client/vexatious-form?${searchParam.toString()}`);
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
        evidence,
      };

      if (!hide) {
        payload = { ...payload, progress: 80, nextProgress: 80 };
      }
      const { data } = await axios.post(
        "/api/client/category/vexatious/createVexatious",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "80");
        router.push(`/client/vexatious-form?${searchParam.toString()}`);
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
    setEvidence(data?.evidence ?? []);
  }, [data]);

  return (
    <div className="lease-form white-card rounded mt-4 indivi-form p-4">
      <h3 className="f-26 mt-4">Supporting Your Case </h3>
      <p className="f-15">
        Providing evidence is crucial to support your claim. Please select the
        types of evidence you have.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-12 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative my-3">
                What evidence do you have to support your claim?
              </label>
              <FormGroup>
                {dismissalArr.map((i: any, index: number) => {
                  return (
                    <Tooltip
                      key={index}
                      title={i.tooltip}
                      placement="bottom"
                      arrow
                    >
                      <FormControlLabel
                        disabled={hide}
                        key={index}
                        className="radio-light-ip"
                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleEvidence(i.value)}
                        checked={evidence.includes(i.value) ?? false}
                      />
                    </Tooltip>
                  );
                })}
              </FormGroup>
              {errors.checkErr && (
                <span className="text-danger">
                  Please select the evidence you have to support your claim
                </span>
              )}
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
              className={`client-btn vexatious-submit-btn ${
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

export default SupportingCase;
