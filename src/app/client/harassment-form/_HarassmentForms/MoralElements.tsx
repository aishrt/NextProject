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
const elementsArr = [
  {
    label: "Was there offensive behavior?",
    value: "offensive behavior",
    tooltip:
      "This criterion corresponds to humiliations, reproaches, and public denigration. If you were publicly insulted by your supervisor, check this box.",
  },

  {
    label: "Were there threats?",
    value: "threats",
    tooltip:
      "This criterion corresponds to threats of dismissal, retaliation, or aggression. If you were threatened with dismissal without a valid reason, check this box.",
  },

  {
    label: "Was there a sudden change in your working conditions?",
    value: "sudden change",
    tooltip:
      "This criterion corresponds to a change in your work or professional tools. If your tasks were suddenly changed to less valuable tasks, check this box.",
  },

  {
    label: "Was there aggressive behavior?",
    value: "aggressive behavior",
    tooltip:
      "This criterion corresponds to physical and verbal aggressions. If you were yelled at or physically assaulted, check this box.",
  },
  {
    label: "Were there unjustified sanctions?",
    value: "unjustified sanctions",
    tooltip:
      "This criterion corresponds to reprimands, warnings, suspensions, or any other abusive expression of the employer's disciplinary power. If you received an unjustified warning, check this box.",
  },
  {
    label: "Was there an abusive use of fixed-term contracts?",
    value: "fixed-term contracts",
    tooltip:
      "If you had several successive fixed-term contracts without justification, check this box.",
  },
  {
    label: "Was there discrimination based on a prohibited reason?",
    value: "prohibited reason",
    tooltip:
      "This criterion corresponds to any difference in treatment based on a prohibited reason. If you were discriminated against due to your origin, check this box.",
  },
  {
    label: "Was there an intrusion into your private life?",
    value: "private life",
    tooltip:
      "This criterion corresponds to any intrusion into your private life. If your employer monitored your personal communications, check this box.",
  },
  {
    label: "Was there non-compliance with your medical condition?",
    value: "medical condition",
    tooltip:
      "This criterion corresponds to the violation of medical prescriptions concerning your condition. If your employer did not respect medical recommendations, check this box.",
  },
  {
    label: "Were you isolated or placed in a non-functional role?",
    value: "non-functional role",
    tooltip:
      "This criterion corresponds to social and/or professional sidelining. If you were isolated from colleagues or placed in a role without responsibilities, check this box.",
  },
  {
    label: "Were you overworked?",
    value: "overworked",
    tooltip:
      "This criterion corresponds to work overload. If you were deliberately overworked, check this box.",
  },

  {
    label: "Was there financial pressure or unpaid wages?",
    value: "unpaid wages",
    tooltip:
      "This criterion corresponds to salary deductions, financial penalties, or unpaid wages. If your salary was withheld without reason, check this box.",
  },
];

const MoralElements = ({
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
    if (moralElements.length == 0) {
      isError = true;
      errorObj = { ...errorObj, checkErr: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [moralElements, setElements] = React.useState<string[]>([]);

  const handleElements = (label: number) => {
    setElements((prevState: any) => {
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
          progress: 50,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");
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
        moralElements,
      };

      if (!hide) {
        payload = { ...payload, progress: 70, nextProgress: 70 };
      }
      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "70");
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
    setElements(data?.moralElements ?? []);
  }, [data]);

  return (
    <div className="lease-form white-card rounded p-4 mt-4 indivi-form">
      <h6 className="f-26  fw-400">Elements of Moral Harassment</h6>
      <p className="f-15 pb-3">
        Identify the behaviors you experienced. Please check all applicable
        elements of the harassment to help us understand the nature of the
        incidents.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-12 mb-4">
            <div className="lease-input">
              {/* <label className="tooltip-title relative">
                What are the reasons for the constructive dismissal?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select the reasons that motivated the constructive dismissal.
                  You can choose multiple reasons. The more details you provide,
                  the more precise your request will be.
                </span>
              </label> */}

              <FormGroup>
                {elementsArr.map((i: any, index: number) => {
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
                        onChange={() => handleElements(i.value)}
                        checked={moralElements.includes(i.value) ?? false}
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

export default MoralElements;
