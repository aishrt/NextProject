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

type FormValues = {};
const damagesArr = [
  {
    label: "Did your physical health deteriorate?",
    value: "physical health deteriorate",
    tooltip:
      "Deterioration of physical health due to stress. If you developed physical health issues, check this box.",
  },

  {
    label: "Did your mental health deteriorate?",
    value: "mental health deteriorate?",
    tooltip:
      "Deterioration of mental health (anxiety, depression, stress-related disorders, etc.). If you suffered from depression or anxiety, check this box.",
  },

  {
    label: "Did you experience burnout?",
    value: "experience burnout",
    tooltip:
      "Professional exhaustion. If you experienced burnout, check this box.",
  },

  {
    label: "Did you experience boreout?",
    value: "experience boreout",
    tooltip:
      "Intense professional boredom. If you experienced boreout, check this box.",
  },
  {
    label: "Did you suffer from depression?",
    value: "suffer from depression",
    tooltip:
      "Clinical depression. If you were diagnosed with depression, check this box.",
  },
  {
    label: "Did you have to take time off work?",
    value: "off work",
    tooltip:
      "Time off work due to the harassment. If you had to take sick leave, check this box.",
  },
  {
    label: "Did the harassment impact your career progression?",
    value: "career progression",
    tooltip:
      "Negative impact on promotion opportunities, etc. If the harassment affected your professional advancement, check this box.",
  },
  {
    label: "Did the harassment impact your personal life?",
    value: "personal life",
    tooltip:
      "Impact on personal life. If the harassment affected your family or personal life, check this box.",
  },

  {
    label: "Did the harassment affect your representative role?",
    value: "representative role",
    tooltip:
      "Impact on your representative function. If the harassment affected your role as an employee representative, check this box.",
  },
];

const Damages = ({
  data,
  hide,
}: {
  data: Harassment | undefined | null;
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
    if (damages.length == 0) {
      isError = true;
      errorObj = { ...errorObj, checkErr: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [damages, setDamages] = React.useState<string[]>([]);

  const handleDamages = (label: number) => {
    setDamages((prevState: any) => {
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
        "/api/client/category/harassment/createHarassment",
        {
          caseId: caseId,
          progress: 70,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");
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
        damages,
      };

      if (!hide) {
        payload = { ...payload, progress: 90, nextProgress: 90 };
      }
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "90");
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
    setDamages(data?.damages ?? []);
  }, [data]);

  return (
    <div className="lease-form white-card rounded p-4 mt-4 indivi-form">
      <h6 className="f-26  fw-400">Damages</h6>
      <p className="f-15 pb-3">
        Describe the impact on your health and career. We need to understand the
        impact of the harassment on your health and professional life.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-12 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                Please check all applicable damages:{" "}
                {/* <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select the reasons that motivated the constructive dismissal.
                  You can choose multiple reasons. The more details you provide,
                  the more precise your request will be.
                </span> */}
              </label>

              <FormGroup>
                {damagesArr.map((i: any, index: number) => {
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
                        disabled={hide}

                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleDamages(i.value)}
                        checked={damages.includes(i.value) ?? false}
                      />
                    </Tooltip>
                  );
                })}
              </FormGroup>
              {errors.checkErr && (
                <span className="text-danger">
                  Please select the elements of moral harassment
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

export default Damages;
