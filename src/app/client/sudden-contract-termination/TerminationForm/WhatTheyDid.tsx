"use client";

import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import bubble from "@/assets/info.png";
import { Tooltip } from "@mui/material";
import { Sudden } from "@/types/Sudden";
import { Checkbox, FormGroup, fabClasses } from "@mui/material";

type FormValues = {
  notice: string;
  otherReason: string;
  accused: string;
};

const sayArr = [
  {
    label: "Didn't pay",
    value: "Didn't pay",
  },
  {
    label: "Acted disloyally",
    value: "Acted disloyally",
  },
  {
    label: "Other (please explain)",
    value: "other",
  },
];

const options = [
  { label: "Automotive Sector", value: "automotiveSector" },
  { label: "Housing Sector", value: "housingSector" },
  { label: "Food Sector", value: "foodSector" },
  { label: "Sales Sector", value: "salesSector" },
  { label: "Services Sector", value: "servicesSector" },
];

const WhatTheyDid = ({
  data,
  hide,
}: {
  data: Sudden | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const [whatDidWrong, setFactor] = React.useState<string[]>([]);

  const [obligations, setObligation] = React.useState("");

  const schema = z.object({
    notice: z
      .string({ required_error: "Please enter the months" })
      .min(1, "Please enter the months"),

    otherReason: whatDidWrong.includes("other")
      ? z
          .string({ required_error: "Please describe the other reason" })
          .min(1, "Please describe the other reason")
      : z.string().optional(),

    accused:
      obligations == "yes"
        ? z
            .string({
              required_error: "Please enter the failures they accused you",
            })
            .min(1, "Please enter the failures they accused you")
        : z.string().optional(),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [sayErr, setSayErr] = React.useState(false);

  const handleSayChange = (label: string) => {
    setFactor((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      return updatedCategories;
    });
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.sayErr = false;
      return newErr;
    });
  };

  const [issuesInvolve, setissuesInvolve] = React.useState("");

  const handleOther = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (event.target.value !== "contract") {
    //   setcontractBroke("");
    //   setContract("");
    //   setObligation("");
    // }
    setissuesInvolve((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.otherErr = false;
      return newObj;
    });
  };
  const [contractBroke, setcontractBroke] = React.useState("");
  const [brokeErr, setBrokeErr] = React.useState(false);

  const handleBroke = (event: React.ChangeEvent<HTMLInputElement>) => {
    setcontractBroke((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.brokeErr = false;
      return newObj;
    });
  };
  const [endingIssue, setContract] = React.useState("");
  const [endingErr, setEndingErr] = React.useState(false);

  const contractChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContract((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.endingErr = false;
      return newObj;
    });
  };

  const obligationChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setObligation((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.repearErr = false;
      return newObj;
    });
  };

  const [breachCited, setBreach] = React.useState("");

  const handleBreach = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBreach((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.breachErr = false;
      return newObj;
    });
  };

  const [somethingWrong, setSomethingWrong] = React.useState("");
  const [err, setErr] = React.useState(false);
  const [errors, setErrors] = useState({
    err: false,
    sayErr: false,
    otherErr: false,
    brokeErr: false,
    endingErr: false,
    repearErr: false,
    breachErr: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (event.target.value !== "yes") {
    //   setFactor("");
    //   setissuesInvolve("");
    //   setcontractBroke("");
    //   setContract("");
    //   setObligation("");
    // }
    setSomethingWrong((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.err = false;
      return newObj;
    });
    setErr(false);
  };

  const checkDidFormErr = (): boolean => {
    let isErr = false;
    let errorObj = { ...errors };

    if (!somethingWrong) {
      isErr = true;
      errorObj.err = true;
    }

    if (somethingWrong == "yes" && whatDidWrong.length == 0) {
      isErr = true;
      errorObj.sayErr = true;
    }

    if (somethingWrong == "yes" && !issuesInvolve) {
      isErr = true;
      errorObj.otherErr = true;
    }

    if (
      somethingWrong == "yes" &&
      (issuesInvolve == "contract" || issuesInvolve == "both") &&
      !contractBroke
    ) {
      isErr = true;
      errorObj.brokeErr = true;
    }

    if (
      somethingWrong == "yes" &&
      (issuesInvolve == "contract" || issuesInvolve == "both") &&
      !endingIssue
    ) {
      isErr = true;
      errorObj.endingErr = true;
    }

    if (!obligations) {
      isErr = true;
      errorObj.repearErr = true;
    }

    if (!breachCited) {
      isErr = true;
      errorObj.breachErr = true;
    }

    if (isErr) {
      setErrors(errorObj);
    }
    return isErr;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (checkDidFormErr()) {
        return;
      }

      let payload: any = {
        caseId: caseId,
        ...values,
        somethingWrong,
        whatDidWrong: somethingWrong == "yes" ? whatDidWrong : "",
        otherReason:
          somethingWrong == "yes" && whatDidWrong.includes("other")
            ? values.otherReason
            : "",
        issuesInvolve: somethingWrong == "yes" ? issuesInvolve : "",

        contractBroke:
          issuesInvolve == "contract" || issuesInvolve == "both"
            ? contractBroke
            : "",
        endingIssue:
          issuesInvolve == "contract" || issuesInvolve == "both"
            ? endingIssue
            : "",
        obligations,
        accused: obligations == "yes" ? values.accused : "",
        breachCited,
        // progress: 60,
        // nextProgress: 60,
      };

      if (!hide) {
        payload = { ...payload, progress: 60, nextProgress: 60 };
      }
      const { data } = await axios.post(
        "/api/client/category/sudden/createSudden",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "60");

        router.push(
          `/client/sudden-contract-termination?${searchParam.toString()}`
        );
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
        "/api/client/category/sudden/createSudden",
        {
          caseId: caseId,
          progress: 40,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
      router.push(
        `/client/sudden-contract-termination?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      notice: data?.notice?.toString(),
      otherReason: data?.otherReason,
      accused: data?.accused,
      // accused: data?.accused ? data?.accused : whatDidWrong,
    });
    setSomethingWrong(data?.somethingWrong ?? "");
    setFactor(data?.whatDidWrong ?? []);
    setissuesInvolve(data?.issuesInvolve ?? "");
    setcontractBroke(data?.contractBroke ?? "");
    setContract(data?.endingIssue ?? "");
    setBreach(data?.breachCited ?? "");
    setObligation(data?.obligations ?? "");
  }, [data]);
  console.log(whatDidWrong);

  // useEffect(() => {
  //   setValues({
  //     accused: whatDidWrong ? whatDidWrong : data?.accused,
  //   })
  // }, [whatDidWrong]);

  return (
    <div className="lease-form white-card p-4 mt-4 indivi-form rounded side-story">
      <h3 className="f-26  my-4 fw-400">Understanding the Breach</h3>
      <h4 className="f-16 my-4">
        Finally, let&apos;s discuss the nature and conditions of the breach.
        Your answers will help us understand the circumstances surrounding the
        sudden termination of your business relationship.
      </h4>
      {loading ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="lease-input">
                <label className="tooltip-title relative fw-500">
                  How much notice, if any, did they give you before terminating
                  the contract? <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Please specify the length of the notice period given by the
                    other party at the time of termination (in months)
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["notice"]}
                  label="Enter the length in months"
                  disabled={hide}
                  name="notice"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Did they accuse you of doing something wrong to justify
                  terminating the contract with little or no notice?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={somethingWrong}
                    onChange={handleChange}
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
                      disabled={hide}
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>

                  {errors.err && (
                    <span className="text-danger">
                      Please provide the contract ending
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
          </div>
          {somethingWrong == "yes" && (
            <>
              <div className="col-12 col-md-12 mb-4">
                <div className="mb-3 radio-end-input">
                  <label className="d-block">
                    What did they say you did wrong?
                  </label>
                  <FormControl className="w-100">
                    {sayArr.map((i, index) => {
                      return (
                        <>
                          <FormControlLabel
                            key={index}
                            disabled={hide}
                            className="radio-light-ip"
                            value={i.value}
                            control={<Checkbox />}
                            label={i.label}
                            onChange={() => {
                              handleSayChange(i.value);
                            }}
                            checked={whatDidWrong.includes(i.value) ?? false}
                          />
                        </>
                      );
                    })}

                    {errors.sayErr && (
                      <span className="text-danger">
                        Please select, what they say
                      </span>
                    )}
                  </FormControl>
                </div>
                {whatDidWrong.includes("other") && (
                  <div className="mb-3 radio-end-input">
                    <label className="d-block">Please specify:</label>

                    <InputField
                      error={formState.errors["otherReason"]}
                      label={`Please specify`}
                      name="otherReason"
                      disabled={hide}
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                )}

                <div className="mb-3 radio-end-input">
                  <label className="d-block">Did these issues involve:</label>
                  <FormControl className="w-100">
                    <RadioGroup
                      className="w-100"
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={issuesInvolve}
                      onChange={handleOther}
                    >
                      <FormControlLabel
                        disabled={hide}
                        className="radio-light-ip"
                        value="contract"
                        control={<Radio />}
                        label="The terms of the contract itself"
                      />
                      <FormControlLabel
                        className="radio-light-ip"
                        value="directly"
                        control={<Radio />}
                        disabled={hide}
                        label="Things not directly in the contract"
                      />
                      <FormControlLabel
                        disabled={hide}
                        className="radio-light-ip"
                        value="both"
                        control={<Radio />}
                        label="Both"
                      />
                    </RadioGroup>
                    {errors.otherErr && (
                      <span className="text-danger">
                        Please select issues involve
                      </span>
                    )}
                  </FormControl>
                </div>
              </div>
            </>
          )}
          {(issuesInvolve == "contract" || issuesInvolve == "both") &&
            somethingWrong == "yes" && (
              <>
                <div className="mb-3 radio-end-input">
                  <label className="d-block">
                    Which part of the contract did they say you broke?
                  </label>
                  <FormControl className="w-100">
                    <RadioGroup
                      className="w-100"
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={contractBroke}
                      onChange={handleBroke}
                    >
                      <FormControlLabel
                        disabled={hide}
                        className="radio-light-ip"
                        value="general"
                        control={<Radio />}
                        label="A general requirement of the contract"
                      />
                      <FormControlLabel
                        disabled={hide}
                        className="radio-light-ip"
                        value="specificRule"
                        control={<Radio />}
                        label="A specific rule in the contract"
                      />

                      <FormControlLabel
                        className="radio-light-ip"
                        value="doNotKnow"
                        disabled={hide}
                        control={<Radio />}
                        label="Don`t know"
                      />
                    </RadioGroup>

                    {errors.brokeErr && (
                      <span className="text-danger">
                        Plesae choose the contract broke{" "}
                      </span>
                    )}
                  </FormControl>
                </div>
                <div className="mb-3 radio-end-input">
                  <label className="d-block">
                    Did they tell you about this issue before ending the
                    contract?
                  </label>
                  <FormControl className="w-100">
                    <RadioGroup
                      className="w-100"
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={endingIssue}
                      onChange={contractChange}
                    >
                      <FormControlLabel
                        disabled={hide}
                        className="radio-light-ip"
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                      />
                      <FormControlLabel
                      disabled={hide}
                        className="radio-light-ip"
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>

                    {errors.endingErr && (
                      <span className="text-danger">
                        Please select the issue before ending the contract
                      </span>
                    )}
                  </FormControl>
                </div>
                {/* <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Were there repeated failures to meet obligations?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={obligations}
                    onChange={obligationChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                  {errors.repearErr && (
                    <span className="text-danger"> this field is required</span>
                  )}
                </FormControl>
              </div> */}
              </>
            )}

          <div className="mb-3 radio-end-input">
            <label className="d-block">
              Were you repeatedly accused of failing to meet obligations (for
              example, late payments or not meeting deadlines consistently) ?{" "}
            </label>
            <FormControl className="w-100">
              <RadioGroup
                className="w-100"
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={obligations}
                onChange={obligationChange}
              >
                <Tooltip title="Select this if you were repeatedly accused of breaches, such as multiple late payments.">
                  <FormControlLabel
                    className="radio-light-ip"
                    value="yes"
                    control={<Radio />}
                    disabled={hide}
                    label="Yes"
                  />
                </Tooltip>

                {obligations == "yes" && (
                  <div className="mb-3 radio-end-input">
                    <label className="d-block fw-500 f-16 mt-4">
                      Please describe the failures they accused you
                    </label>
                    <InputField
                    disabled={hide}
                      error={formState.errors["accused"]}
                      label={`Please describe`}
                      name="accused"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                )}
                <Tooltip title="Select 'No' if you were not repeatedly accused of failures.">
                  <FormControlLabel
                    className="radio-light-ip"
                    value="no"
                    control={<Radio />}
                    label="No"
                    disabled={hide}
                  />
                </Tooltip>
              </RadioGroup>
              {errors.repearErr && (
                <span className="text-danger">
                  Please select the repeated failures
                </span>
              )}
            </FormControl>
          </div>

          <div className="mb-3 radio-end-input">
            <label className="d-block">
              How serious was the breach cited at the time of termination?
            </label>
            <FormControl className="w-100">
              <RadioGroup
                className="w-100"
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={breachCited}
                onChange={handleBreach}
              >
                <Tooltip title="Select this if the breach was not very serious, such as a minor infraction of contract terms or a small error that did not significantly impact the business relationship.">
                  <FormControlLabel
                    className="radio-light-ip"
                    value="minor"
                    disabled={hide}
                    control={<Radio />}
                    label="Minor (examples include minor delays in delivery, small clerical errors in invoicing, or occasional lapses in communication that did not affect the overall performance of the contract)"
                  />
                </Tooltip>

                <Tooltip title="Select this if the breach was somewhat serious, such as repeated minor infractions, moderate contractual misconduct, or an error that had a noticeable impact on the business relationship but was not critical.">
                  <FormControlLabel
                    className="radio-light-ip mt-3"
                    disabled={hide}
                    value="moderate"
                    control={<Radio />}
                    label="Moderate (examples include repeated delays in delivery, consistent but non-critical breaches of contract terms (e.g., failure to meet non-essential service standards), or moderate miscommunications that caused some operational disruptions but were manageable)"
                  />
                </Tooltip>

                <Tooltip title="Select this if the breach was very serious, such as major contractual violations, actions that significantly harmed the business relationship, or caused substantial financial or operational damage.">
                  <FormControlLabel
                    className="radio-light-ip mt-3"
                    disabled={hide}
                    value="severe"
                    control={<Radio />}
                    label="Severe (examples include failure to deliver essential goods or services, breach of critical contract terms (e.g., confidentiality, exclusivity), actions that caused significant financial loss or operational disruption, or behaviors that led to the loss of major clients or reputational damage)"
                  />
                </Tooltip>

                <Tooltip title="">
                  <FormControlLabel
                    className="radio-light-ip mt-3"
                    value="notMention"
                    control={<Radio />}
                    disabled={hide}
                    label="Did not mention anything"
                  />
                </Tooltip>
              </RadioGroup>
              {errors.breachErr && (
                <span className="text-danger">
                  Please select the breach cited at the time of termination
                </span>
              )}
            </FormControl>
          </div>

          <div className="col-12 text-center mt-4">
            <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center">
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
                className={`client-btn sudden-submit-btn ${
                  hide ? "d-none" : "block"
                }`}
                size="lg"
                onClick={() => checkDidFormErr()}
              >
                <span className="f-16">Next</span>
              </Button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default WhatTheyDid;
