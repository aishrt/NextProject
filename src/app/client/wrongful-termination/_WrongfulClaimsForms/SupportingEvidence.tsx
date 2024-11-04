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

type FormValues = { eventDescribe: string };

const objectiveArr = [
  {
    label: "Offensive behavior",
    value: "Offensive behavior",
    tooltip:
      "Public humiliations, reproaches, and denigration. Ex: Publicly insulted by your supervisor.",
  },
  {
    label: "Threats",
    value: "Threats",
    tooltip:
      "Threats of dismissal, retaliation, or aggression. Ex: Threatened with dismissal without a valid reason.",
  },

  {
    label: "Sudden change in working conditions",
    value: "Sudden change in working conditions",
    tooltip:
      "Change in your work or professional tools. Ex: Tasks suddenly changed to less valuable tasks.",
  },

  {
    label: "Aggressive behavior",
    value: "Aggressive behavior",
    tooltip:
      "Physical and verbal aggressions. Ex: Yelled at or physically assaulted.",
  },

  {
    label: "Unjustified sanctions",
    value: "Unjustified sanctions",
    tooltip:
      "Reprimands, warnings, suspensions, or other abusive expressions of the employer's disciplinary power. Ex: Received an unjustified warning.",
  },

  {
    label: "Intrusion into private life",
    value: "Intrusion into private life",
    tooltip:
      "Any intrusion into your private life. Ex: Employer monitored your personal communications.",
  },
  {
    label: "Non-compliance with medical condition",
    value: "Non-compliance with medical condition",
    tooltip:
      "Violation of medical prescriptions concerning your condition. Ex: Employer did not respect medical recommendations.",
  },

  {
    label: "Isolation or non-functional role",
    value: "Isolation or non-functional role",
    tooltip:
      "Social and/or professional sidelining. Ex: Isolated from colleagues or placed in a role without responsibilities.",
  },

  {
    label: "Overwork",
    value: "Overwork",
    tooltip: "Deliberate work overload. Ex: Overworked without valid reason.",
  },

  {
    label: "Financial pressure or unpaid wages",
    value: "Financial pressure or unpaid wages",
    tooltip:
      "Salary deductions, financial penalties, or unpaid wages. Ex: Salary withheld without reason.",
  },
];

const subjectiveArr = [
  {
    label: "Unfounded accusations",
    value: "Unfounded accusations",
    tooltip:
      "Accused of something you didn't do. Ex: Accused of theft you did not commit.",
  },
  {
    label: "Real reason different from the stated reason",
    value: "Real reason different from the stated reason",
    tooltip:
      "Dismissed for 'performance' but the reason was different. Ex: Officially dismissed for performance issues but the actual reason was personal.",
  },
  {
    label: "Public dismissal announcement",
    value: "Public dismissal announcement",
    tooltip:
      "Dismissal announced in front of others. Ex: Announced during a team meeting.",
  },

  {
    label: "Denigration",
    value: "Denigration",
    tooltip:
      "Belittled or insulted by your employer. Ex: Superior called you 'lazy' in front of colleagues.",
  },

  {
    label: "Excessive procedure",
    value: "Excessive procedure",
    tooltip:
      "Unnecessarily long dismissal process. Ex: Dismissal process lasted several months without valid reason.",
  },

  {
    label: "Threats",
    value: "Threats",
    tooltip:
      "Threats of violence or legal action. Ex: Employer threatened legal action if you did not resign.",
  },

  {
    label: "Insulting behavior",
    value: "Insulting behavior",
    tooltip:
      "Offensive language used by your employer. Ex: Superior repeatedly insulted you.",
  },

  {
    label: "Isolation",
    value: "Isolation",
    tooltip:
      "Excluded from work activities. Ex: No longer invited to important meetings.",
  },
];
const evidenceArr = [
  {
    label: "Internal company documents (e.g., emails, performance reviews)",
    value: "company documents",
  },
  {
    label: "Written notice of termination",
    value: "notice of termination",
  },
  {
    label: "Union representative statements",
    value: "Union representative statements",
  },
  {
    label:
      "Statements from healthcare professionals (e.g., doctors, therapists)",
    value: "healthcare professionals",
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
    value: "other",
  },
];

const schema = z.object({
  eventDescribe: ((msg) => z.string({ required_error: msg }).min(1, msg))(
    "Please describe the events and circumstances"
  ),
});

const SupportingEvidence = ({
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

  const [harassmentExperience, setObjective] = React.useState<string[]>([]);

  const handleObjective = (label: number) => {
    setObjective((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.objectiveErr = false;
        return newErrorObj;
      });

      return updatedCategories;
    });
  };

  const [eventsExperience, setSubjective] = React.useState<string[]>([]);

  const handleSubjective = (label: number) => {
    setSubjective((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.subjectiveErr = false;
        return newErrorObj;
      });

      return updatedCategories;
    });
  };

  const [evidenceSupport, setEvidence] = React.useState<string[]>([]);

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
    objectiveErr: false,
    subjectiveErr: false,
    evidenceErr: false,
    otherErr: false,
  });
  const errHandle = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (harassmentExperience.length == 0) {
      isError = true;
      errorObj.objectiveErr = true;
    }
    if (eventsExperience.length == 0) {
      isError = true;
      errorObj.subjectiveErr = true;
    }
    // if (evidenceSupport.length == 0) {
    //   isError = true;
    //   errorObj.evidenceErr = true;
    // }
    // if (evidenceSupport.includes("other") && !otherEvidence) {
    //   isError = true;
    //   errorObj = { ...errorObj, otherErr: true };
    // }

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
        ...values,
        harassmentExperience,
        eventsExperience,
      };

      if (!hide) {
        payload = { ...payload, progress: 80, nextProgress: 80 };
      }
      const { data } = await axios.post(
        "/api/client/category/wrongful/createWrongful",
        payload
      );

      let id = data.data.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "80");

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
          progress: 60,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");
      router.push(`/client/wrongful-termination?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray ">
        Understanding the Unique Aspects of Your Termination{" "}
      </h3>

      <p className="f-14 gray">
        In this section, we will ask more detailed questions to understand the
        specific circumstances of your termination.
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
                <label className="d-block">
                  {data?.role == "Employee"
                    ? `What types of harassment did you experience?`
                    : `What types of harassment were reported by the employee?`}
                </label>

                <FormGroup>
                  {objectiveArr.map((i: any, index: number) => {
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
                          label={i.label}
                          onChange={() => handleObjective(i.value)}
                          checked={
                            harassmentExperience.includes(i.value) ?? false
                          }
                        />
                      </Tooltip>
                    );
                  })}
                </FormGroup>

                {errors.objectiveErr && (
                  <div>
                    <span className="text-danger">
                      Please select the types of harassment
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="radio-end-input mb-3">
                <label className="d-block">
                  {" "}
                  {data?.role == "Employee"
                    ? `What events did you experience during your dismissal?`
                    : `What events did the employee report during their dismissal?`}
                </label>

                <FormGroup>
                  {subjectiveArr.map((i: any, index: number) => {
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
                          label={i.label}
                          onChange={() => handleSubjective(i.value)}
                          checked={eventsExperience.includes(i.value) ?? false}
                        />
                      </Tooltip>
                    );
                  })}
                </FormGroup>

                {errors.subjectiveErr && (
                  <div>
                    <span className="text-danger">
                      Please select the events you experience during dismissal
                    </span>
                  </div>
                )}
              </div>
            </div>
            {/* <div className="col-12 col-md-12 mb-4">
              <div className="radio-end-input mb-3 two-cols">
                <label className="d-block">
                  {`What evidence do you have to support your claim of wrongful
                dismissal? (Check all that apply and upload any relevant files)`}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    {`These can be crucial in demonstrating unfair treatment or
                  discrepancies in the employer's reasoning.`}
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
                      />
                    );
                  })}
                </FormGroup>

                {errors.evidenceErr && (
                  <div>
                    <span className="text-danger">
                      Please select the evidence claim of wrongful dismissal
                    </span>
                  </div>
                )}
              </div>

              {evidenceSupport.includes("other") && (
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">Others</label>
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
            </div> */}

            <div className="col-12 col-md-12 mb-3">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  {`Can you describe the events and circumstances leading to ${
                    data?.role == "Employee" ? "your" : "the employee's"
                  } termination? `}

                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    {`Describe the events leading to ${
                      data?.role == "Employee" ? "your" : "the employee's"
                    } termination, including warnings, performance reviews, meetings, or relevant incidents.`}
                  </span>
                </label>
                <TextAreaField
                  name="eventDescribe"
                  label=""
                  error={formState.errors["eventDescribe"]}
                  control={control}
                  variant="filled"
                  className="bglight-area"
                />
                {/* <span className="span-label f-14 d-block f-14">
                  <span className="bold">Prompt:</span> Please describe the
                  events leading up to the dismissal, including any warnings,
                  performance reviews, meetings, or incidents that you believe
                  are relevant.
                </span> */}
              </div>
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

export default SupportingEvidence;
