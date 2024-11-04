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
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import DateField from "@/components/Form/DateField";
import TextAreaField from "@/components/Form/TextArea";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Compete } from "@/types/Compete";

type FormValues = {
  otherDetails: string;
};

const options = [
  {
    label: " Employment at a new company",
    value: " Employment at a new company",
  },
  { label: "Starting your own business", value: "Starting your own business" },
  { label: "Other (please specify)", value: "Other (please specify)" },
];

const schema = z.object({
  // otherDetails: z
  //   .string({ required_error: "Please provide any other relevant details" })
  //   .min(1, "Please provide any other relevant details"),

  otherDetails: z.string().optional(),
});

const AdditionalDetails = ({
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

  let competitionArr: any = [
    {
      label: "Limited job offers",
      value: "Limited job offers",
    },
    {
      label: "Financial hardship",
      value: "Financial hardship",
    },
    {
      label: "Stress/anxiety",
      value: "Stress/anxiety",
    },
    {
      label: "Other",
      value: "other",
    },
  ];

  let allegatedArr: any = [
    {
      label: "Loss of clients",
      value: "Loss of clients",
      tooltip: "",
    },
    {
      label: "Loss of trade secrets",
      value: "Loss of trade secrets",
      tooltip:
        "The disclosure or use of your confidential business information by a former employee.",
    },

    {
      label: "Damage to the company's reputation",
      value: "Damage to the company's reputation",
      tooltip: "",
    },

    {
      label: "Loss of business opportunities",
      value: "Loss of business opportunities",
      tooltip: "",
    },

    {
      label: "Other",
      value: "other",
      tooltip: "",
    },
  ];
  let whenArr = [
    { label: "Before signing", value: "Before signing" },
    {
      label: "After signing",
      value: "After signing",
    },
  ];
  const [otherClause, setOtherClause] = React.useState("");

  const [nonCompetitionClause, setClause] = React.useState<string[]>([]);

  const handleClause = (label: number) => {
    setClause((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.clauseErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const [otherAlleged, setOtherAlleged] = React.useState("");

  const [allegedViolation, setViolation] = React.useState<string[]>([]);

  const handleViolation = (label: number) => {
    setViolation((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.allegedErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const [errors, setErrors] = useState({
    clauseErr: false,
    otherClauseErr: false,
    allegedErr: false,
    otherAllegedErr: false,
    agreementsErr: false,
    negotiateErr: false,
    whenErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (data?.subject == "employee" && nonCompetitionClause.length == 0) {
      isError = true;
      errorObj = { ...errorObj, clauseErr: true };
    }

    if (nonCompetitionClause.includes("other") && !otherClause) {
      isError = true;
      errorObj = { ...errorObj, otherClauseErr: true };
    }

    if (data?.subject == "employer" && allegedViolation.length == 0) {
      isError = true;
      errorObj = { ...errorObj, allegedErr: true };
    }
    if (allegedViolation.includes("other") && !otherAlleged) {
      isError = true;
      errorObj = { ...errorObj, otherAllegedErr: true };
    }

    if (!agreement) {
      isError = true;
      errorObj = { ...errorObj, agreementsErr: true };
    }
    if (!negotiate) {
      isError = true;
      errorObj = { ...errorObj, negotiateErr: true };
    }

    if (negotiate == "yes" && whenNegotiate.length == 0) {
      isError = true;
      errorObj = { ...errorObj, whenErr: true };
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
          progress: 50,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");
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
        ...values,
        nonCompetitionClause,
        otherClause: nonCompetitionClause.includes("other") ? otherClause : "",
        allegedViolation,
        otherAlleged: allegedViolation.includes("other") ? otherAlleged : "",
        agreement,
        negotiate,
        whenNegotiate: negotiate == "yes" ? whenNegotiate : [],
        // progress: 70,
        // nextProgress: 70,
      };

      if (!hide) {
        payload = { ...payload, progress: 70, nextProgress: 70 };
      }
      const { data } = await axios.post(
        "/api/client/category/non-competition/createCompetition",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "70");

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

  const [agreement, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.agreementsErr = false;
      return newErrorObj;
    });
  };
  const [negotiate, setNegotiate] = React.useState("");
  const handleNegotiate = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNegotiate((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.negotiateErr = false;
      return newErrorObj;
    });
  };

  const [whenNegotiate, setWhen] = React.useState<string[]>([]);
  const handleWhen = (label: number) => {
    setWhen((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.whenErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  useEffect(() => {
    setValues({
      otherDetails: data?.otherDetails ?? "",
    });
    setViolation(data?.allegedViolation ?? []);
    setOtherAlleged(data?.otherAlleged ?? "");
    setClause(data?.nonCompetitionClause ?? []);
    setOtherClause(data?.otherClause ?? "");
    setValue(data?.agreement ?? "");
    setNegotiate(data?.negotiate ?? "");
    setWhen(data?.whenNegotiate ?? []);
  }, [data]);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray">Impact and Additional Details</h3>
      <p className="f-15 gray">
        Please describe the impact of the non-compete clause or its alleged
        violation, and provide any additional details relevant to your
        situation.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          {data?.subject == "employee" && (
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3  radio-end-input two-cols">
                <label className="d-block">
                  How has the non-competition clause negatively affected you?
                </label>

                <FormGroup>
                  {competitionArr.map((i: any, index: number) => {
                    return (
                      <FormControlLabel
                        key={index}
                        className="radio-light-ip"
                        disabled={hide}
                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleClause(i.value)}
                        checked={
                          nonCompetitionClause.includes(i.value) ?? false
                        }
                      />
                    );
                  })}
                </FormGroup>
                {errors.clauseErr && (
                  <span className="text-danger">
                    Please select the non-competition clause
                  </span>
                )}
              </div>
              {nonCompetitionClause.includes("other") && (
                <div className="col-md-6 lease-input mb-4">
                  <label className="tooltip-title relative">Others</label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Other"
                    disabled={hide}
                    variant="filled"
                    value={otherClause}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setOtherClause(event.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.otherClauseErr = false;
                        return newErrorObj;
                      });
                    }}
                  />

                  {errors.otherClauseErr && (
                    <div>
                      <span className="text-danger">
                        Please describe the other statement
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          {data?.subject == "employer" && (
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3  radio-end-input two-cols">
                {/* <label className="d-block">
                  How has the alleged violation of the non-compete clause
                  affected your business?
                </label> */}

                <label className="tooltip-title relative">
                  How has the alleged violation of the non-compete clause
                  affected your business?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    The disclosure or use of your confidential business
                    information by a former employee.
                  </span>
                </label>

                <FormGroup>
                  {allegatedArr.map((i: any, index: number) => {
                    return (
                      <Tooltip key={index} title={i.tooltip} placement="top">
                        <FormControlLabel
                          key={index}
                          className="radio-light-ip"
                          control={<Checkbox />}
                          label={i.label}
                          disabled={hide}
                          onChange={() => handleViolation(i.value)}
                          checked={allegedViolation.includes(i.value) ?? false}
                        />
                      </Tooltip>
                    );
                  })}
                </FormGroup>
                {errors.allegedErr && (
                  <span className="text-danger">
                    Please select the alleged violation
                  </span>
                )}
              </div>
              {allegedViolation.includes("other") && (
                <div className="col-md-6 lease-input mb-4">
                  <label className="tooltip-title relative">Others</label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Other"
                    variant="filled"
                    disabled={hide}
                    value={otherAlleged}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setOtherAlleged(event.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.otherAllegedErr = false;
                        return newErrorObj;
                      });
                    }}
                  />

                  {errors.otherAllegedErr && (
                    <div>
                      <span className="text-danger">
                        Please describe the other statement
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Did you sign any separate confidentiality or non-disclosure
                agreements with the company?
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={agreement}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                    disabled={hide}
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    disabled={hide}
                    value="no"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>

                {errors.agreementsErr && (
                  <span className="text-danger">
                    Please select, if you sign any separate confidentiality
                    agreement
                  </span>
                )}
              </FormControl>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Did you try to negotiate the terms of the non-compete clause?
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={negotiate}
                  onChange={handleNegotiate}
                >
                  <FormControlLabel
                    disabled={hide}
                    className="radio-light-ip"
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

                {errors.negotiateErr && (
                  <span className="text-danger">
                    Please select the negotiate term
                  </span>
                )}
              </FormControl>
            </div>
            {negotiate == "yes" && (
              <div className="mb-3  radio-end-input two-cols">
                <label className="d-block">When?</label>
                <FormGroup>
                  {whenArr.map((i: any, index: number) => {
                    return (
                      <FormControlLabel
                        disabled={hide}
                        key={index}
                        className="radio-light-ip"
                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleWhen(i.value)}
                        checked={whenNegotiate.includes(i.value) ?? false}
                      />
                    );
                  })}
                  {errors.whenErr && (
                    <span className="text-danger">
                      Please select when you try to negotiate
                    </span>
                  )}
                </FormGroup>
              </div>
            )}
          </div>
          <div className="col-12 col-md-12 mb-3">
            <TextAreaField
              name="otherDetails"
              label="Please provide any other details relevant to your situation (e.g., specific clauses in the contract, circumstances of termination)"
              error={formState.errors["otherDetails"]}
              control={control}
              disabled={hide}
              variant="filled"
              className="bglight-area"
            />
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

export default AdditionalDetails;
