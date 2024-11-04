"use client";

import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import { useRouter, useSearchParams } from "next/navigation";

import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import { useHookForm } from "@/hooks/useHookForm";
import { useEffect, useState } from "react";
import { Button } from "@/components/Form/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import Image from "next/image";
import bubble from "@/assets/info.png";
import Tooltip from "@mui/material/Tooltip";
import { Checkbox, FormGroup, fabClasses } from "@mui/material";
import { Sudden } from "@/types/Sudden";

type FormValues = {
  duration: string;
  noticeDuration: string;
};

const TerminationForm = ({
  data,
  hide,
}: {
  data: Sudden | undefined | null;
  hide: boolean;
}) => {
  const router = useRouter();
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const schema = (work: string, noticePeriod: string) => {
    return z.object({
      duration: work
        ? z
            .string({
              required_error: "Please enter the duration of the relationship",
            })
            .min(1, "Please enter the duration of the relationship")
        : z.string().optional(),

      noticeDuration:
        noticePeriod == "yes"
          ? z
              .string({
                required_error:
                  "Please enter the duration of the notice period",
                invalid_type_error:
                  "Please enter the duration of the notice period",
              })
              .min(1, "Please enter the duration of the notice period")
          : z.string().optional(),
    });
  };
  const [work, setWork] = React.useState("");
  const [noticePeriod, setNotice] = React.useState("");

  const { methods, setValues } = useHookForm<FormValues>(
    schema(work, noticePeriod)
  );
  const { formState, control } = methods;
  const [show, setShow] = useState<boolean>(false);
  const [count, setCount] = useState(0); // Initialize count state variable with 0
  const [useClause, setClause] = useState(""); // Initialize count state variable with 0
  const [isActivity, setActivity] = useState<boolean>(false);
  const [variant, setVariant] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const [relationTerminated, setRelationTerminated] = React.useState<string[]>(
    []
  );

  const [contract, setContract] = React.useState<string[]>([]);
  const [factors, setFactors] = React.useState<string[]>([]);

  const [otherTerminated, setOtherTerminated] = useState("");
  const [typeOfContract, setTypeOfContract] = React.useState("");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    relationTerminatedErr: false,
    otherErr: false,
    contractErr: false,
    typeContractErr: false,
    noticeErr: false,
    workErr: false,
    factorErr: false,
  });

  const relationshipArr = [
    {
      label: "Written notice",
      value: "Written notice",
      tooltip:
        "Did the other party send you a letter or email to end the relationship?",
    },
    {
      label: "Reduced orders",
      value: "Reduced orders",
      tooltip:
        "Did the other party start ordering less from you without explanation?",
    },
    {
      label: "Verbal notification",
      value: "Verbal notification",
      tooltip:
        "Did the other party tell you in person or over the phone that the relationship was ending?",
    },
    {
      label: "Just stopped all orders",
      value: "Just stopped all orders",
      tooltip: "Did the other party abruptly stop ordering without any notice?",
    },
    {
      label: "Other",
      value: "Other",
      tooltip: "",
    },
  ];

  const contractArr = [
    {
      label: "Written contract",
      value: "Written contract",
      tooltip:
        "Select this if you had a formal written agreement outlining the terms and conditions of your business relationship.",
    },
    {
      label: "Basic outline agreement",
      value: "Basic outline agreement",
      tooltip:
        "Select this if your relationship was governed by a general framework agreement without detailed terms for every transaction.",
    },
    {
      label: "Ongoing renewal (it continued unless canceled)",
      value: "Ongoing renewal",
      tooltip:
        "Select this if your contracts were automatically renewed without needing new agreements, unless one party decided to cancel.",
    },
    {
      label: "Multiple contracts",
      value: "Multiple contracts",
      tooltip:
        "Select this if you had several different contracts over the course of your business relationship.",
    },
  ];

  const factorArr = [
    {
      label:
        "Exclusivity (you were the only one allowed to sell their product or service)",
      value: "Exclusivity",
      tooltip:
        "Select this if you had an exclusivity agreement, meaning you were the sole distributor or seller of their product or service",
    },
    {
      label: "Private label (you sold their product under your own brand)",
      value: "Private label",
      tooltip:
        "Select this if you sold products under your own brand name, which were supplied by the other party. This includes private label arrangements as per Ordinance No. 2019-359 of April 24, 2019.",
    },
    {
      label:
        "Deteriorated relationship (frequent disagreements, poor communication, etc.",
      value: "Deteriorated relationship",
      tooltip:
        "Select this if the relationship between you and the other party had become strained due to frequent disagreements or poor communication before the termination.",
    },
    {
      label:
        "Industry practice (common unwritten way of ending contracts in your industry)",
      value: "Industry practice",
      tooltip:
        "Select this if there were common industry practices or interprofessional agreements that typically governed the termination of business relationships in your industry.",
    },

    {
      label: "Systematic competitive bidding",
      value: "Systematic competitive bidding",
      tooltip:
        "Select this if your business relationship was regularly subject to competitive bidding processes.",
    },
  ];

  // const handleContract = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.value !== "yes") {
  //     setTypeOfContract("");
  //     setNotice("");
  //   }

  //   setContract((event.target as HTMLInputElement).value);
  //   setErrors((prev) => {
  //     let newObj = { ...prev };
  //     newObj.contractErr = false;
  //     return newObj;
  //   });
  // };

  const agreeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTypeOfContract((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.typeContractErr = false;
      return newObj;
    });
  };

  const noticeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNotice((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.noticeErr = false;
      return newObj;
    });
  };
  const [specificDetail, setSpecificDetail] = React.useState("");
  const exclusiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpecificDetail((event.target as HTMLInputElement).value);
  };

  const handleChange = (label: string) => {
    setRelationTerminated((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      return updatedCategories;
    });
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.relationTerminatedErr = false;
      return newErr;
    });
  };

  const handleContractChange = (label: string) => {
    setContract((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      return updatedCategories;
    });
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.contractErr = false;
      return newErr;
    });
  };

  const handleFactorChange = (label: string) => {
    setFactors((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      return updatedCategories;
    });
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.factorErr = false;
      return newErr;
    });
  };
  const handleWork = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWork((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrObj = { ...prev };
      newErrObj.workErr = false;
      return newErrObj;
    });
  };

  const checkError = (): boolean => {
    let hasError = false;
    let errorObj = { ...errors };

    if (!work) {
      hasError = true;
      errorObj.workErr = true;
    }
    if (relationTerminated.length == 0) {
      hasError = true;
      errorObj.relationTerminatedErr = true;
    }
    if (relationTerminated.includes("Other") && !otherTerminated) {
      hasError = true;
      errorObj.otherErr = true;
    }

    if (contract.length == 0) {
      hasError = true;
      errorObj.contractErr = true;
    }

    // if (contract == "yes" && !typeOfContract) {
    //   hasError = true;
    //   errorObj.typeContractErr = true;
    // }

    if (!noticePeriod) {
      hasError = true;
      errorObj.noticeErr = true;
    }
    if (factors.length == 0) {
      hasError = true;
      errorObj.factorErr = true;
    }

    if (hasError) {
      setErrors(errorObj);
    }

    return hasError;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      if (checkError()) {
        return;
      }

      let payload: any = {
        caseId: caseId,
        ...values,
        work,
        relationTerminated,
        otherTerminated: relationTerminated.includes("Other")
          ? otherTerminated
          : "",
        contract,
        //typeOfContract,
        noticePeriod,
        noticeDuration: noticePeriod == "yes" ? values.noticeDuration : "",
        factors,
        // specificDetail,
        // progress: 30,
        // nextProgress: 30,
      };

      if (!hide) {
        payload = { ...payload, progress: 30, nextProgress: 30 };
      }
      const { data } = await axios.post(
        "/api/client/category/sudden/createSudden",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "30");

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
          progress: 10,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "10");
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
      duration: data?.duration?.toString(),
      noticeDuration: data?.noticeDuration?.toString(),
    });
    setWork(data?.work ?? "");
    setRelationTerminated(data?.relationTerminated ?? []);
    setOtherTerminated(data?.otherTerminated ?? "");
    setContract(data?.contract ?? []);
    setNotice(data?.noticePeriod ?? "");
    setFactors(data?.factors ?? []);
  }, [data]);
  return (
    <div className="lease-form white-card p-4 mt-4 indivi-form rounded">
      <h3 className="f-20 fw-500 my-4">Your Business Relationship </h3>

      <h4 className="f-16  my-4">
        Let&apos;s start by understanding your business relationship. Please
        answer the following questions to give us a clear picture of your
        situation.
      </h4>
      {loading ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            {/* <div className="col-12 col-md-6 mb-4">
              <div className="lease-input">
                <label className="relative">
                  Duration of the Relationship (in months):
                </label>
                <NumberField
                  error={formState.errors["duration"]}
                  label="Enter the total length of your business relationship with the counterparty, in months. "
                  name="duration"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div> */}

            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input">
                <label className="tooltip-title relative">
                  How long did you work together?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Please provide the total time period you have worked with
                    the other party, either in months or years.
                  </span>
                </label>

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={work}
                    onChange={handleWork}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="months"
                      control={<Radio />}
                      label="Months"
                      disabled={hide}
                    />

                    <FormControlLabel
                      className="radio-light-ip"
                      disabled={hide}
                      value="years"
                      control={<Radio />}
                      label="Years"
                    />
                  </RadioGroup>
                  {errors.workErr && (
                    <span className="text-danger">Please select</span>
                  )}{" "}
                </FormControl>

                {work && (
                  <InputField
                    type="number"
                    error={formState.errors["duration"]}
                    label={`Enter the total no. of ${
                      work == "months" ? "months" : "years"
                    }`}
                    name="duration"
                    variant="filled"
                    disabled={hide}
                    className="bglight-ip"
                    control={control}
                  />
                )}
              </div>
            </div>

            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  How was the relationship ended?
                </label>
                <FormGroup>
                  {relationshipArr.map((i, index) => {
                    return (
                      <Tooltip
                        key={index}
                        title={i.tooltip}
                        placement="bottom"
                        arrow
                      >
                        <FormControlLabel
                          key={index}
                          disabled={hide}
                          className="radio-light-ip"
                          value={i.value}
                          control={<Checkbox />}
                          label={i.label}
                          onChange={() => {
                            handleChange(i.value);
                            if (!i.value) {
                              console.log("value of check box");
                            }
                          }}
                          checked={
                            relationTerminated.includes(i.value) ?? false
                          }
                        />
                      </Tooltip>
                    );
                  })}
                </FormGroup>
                {errors.relationTerminatedErr && (
                  <span className="text-danger">
                    Please choose, how was your relationship terminated
                  </span>
                )}

                {/* <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={relationTerminated}
                    onChange={handleChange}
                  >
                    <Tooltip title="Did the other party send you a letter or email to end the relationship?">
                      <FormControlLabel
                        className="radio-light-ip"
                        value="writtenNotification"
                        control={<Radio />}
                        label="Written notice"
                      />
                    </Tooltip>

                    <Tooltip title="Did the other party start ordering less from you without explanation?">
                      <FormControlLabel
                        className="radio-light-ip"
                        value="ordersDecrease"
                        control={<Radio />}
                        label="Reduced orders"
                      />
                    </Tooltip>

                    <Tooltip title="Did the other party tell you in person or over the phone that the relationship was ending?">
                      <FormControlLabel
                        className="radio-light-ip"
                        value="verbalNotification"
                        control={<Radio />}
                        label="Verbal notification"
                      />
                    </Tooltip>

                    <Tooltip title="Did the other party abruptly stop ordering without any notice?">
                      <FormControlLabel
                        className="radio-light-ip"
                        value="other"
                        control={<Radio />}
                        label="Just stopped all orders  "
                      />
                    </Tooltip>
                  </RadioGroup>
                  {errors.relationTerminatedErr && (
                    <span className="text-danger">
                      Please choose, how was your relationship terminated
                    </span>
                  )}{" "}
                </FormControl> */}
              </div>

              {relationTerminated.includes("Other") && (
                <div className="mb-3 lease-input mt-4">
                  <label className="tooltip-title relative">
                    Please specify:{" "}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      If none of the above options apply, please describe how
                      the relationship was ended.
                    </span>
                  </label>
                  <TextField
                    fullWidth
                    disabled={hide}
                    id="filled-basic"
                    label="Other"
                    variant="filled"
                    value={otherTerminated}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setOtherTerminated(event.target.value);
                      setErrors((prev) => {
                        let newObj = { ...prev };
                        newObj.otherErr = false;
                        return newObj;
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

            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  What type of contractual agreement did you have with the other
                  party?
                </label>
                <FormGroup>
                  {contractArr.map((i, index) => {
                    return (
                      <Tooltip
                        key={index}
                        title={i.tooltip}
                        placement="bottom"
                        arrow
                      >
                        <FormControlLabel
                          key={index}
                          disabled={hide}
                          className="radio-light-ip"
                          value={i.value}
                          control={<Checkbox />}
                          label={i.label}
                          onChange={() => {
                            handleContractChange(i.value);
                            if (!i.value) {
                              console.log("value of check box");
                            }
                          }}
                          checked={contract.includes(i.value) ?? false}
                        />
                      </Tooltip>
                    );
                  })}
                </FormGroup>
                {errors.contractErr && (
                  <span className="text-danger">
                    Please select the type of contractual agreement
                  </span>
                )}
              </div>
            </div>
            {/* <div className="col-12 col-md-6 mb-3">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Was there a written contract for the relationship?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={contract}
                    onChange={handleContract}
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
                    <FormControlLabel
                      className="radio-light-ip"
                      value="doNotKnow"
                      control={<Radio />}
                      label="Don't know"
                    />
                  </RadioGroup>
                  {errors.contractErr && (
                    <span className="text-danger">
                      Please let us know, if there was a written contract
                    </span>
                  )}{" "}
                </FormControl>
              </div>

              {contract == "yes" && (
                <>
                  <div className="mb-3 radio-end-input">
                    <label className="d-block">
                      What type of written contract was it?
                    </label>

                    <FormControl className="w-100">
                      <RadioGroup
                        className="w-100"
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={typeOfContract}
                        onChange={agreeChange}
                      >
                        <FormControlLabel
                          className="radio-light-ip"
                          value="frameworkAgreement"
                          control={<Radio />}
                          label="Framework agreement"
                        />
                        <FormControlLabel
                          className="radio-light-ip"
                          value="tacitRenewal"
                          control={<Radio />}
                          label="Tacit renewal"
                        />
                        <FormControlLabel
                          className="radio-light-ip"
                          value="mutlipleContracts"
                          control={<Radio />}
                          label="Multiple contracts"
                        />
                      </RadioGroup>
                      {errors.typeContractErr && (
                        <span className="text-danger">This is required</span>
                      )}
                    </FormControl>
                  </div>
                  <div className="mb-3 radio-end-input">
                    <label className="d-block">
                      If there was a written contract, was there a notice period
                      specified?
                    </label>
                    <FormControl className="w-100">
                      <RadioGroup
                        className="w-100"
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={noticePeriod}
                        onChange={noticeChange}
                      >
                        <FormControlLabel
                          className="radio-light-ip"
                          value="notice"
                          control={<Radio />}
                          label="Yes, enter the length of the notice period (in months)"
                        />
                        <FormControlLabel
                          className="radio-light-ip"
                          value="no"
                          control={<Radio />}
                          label="No"
                        />
                        <FormControlLabel
                          className="radio-light-ip"
                          value="doNotKnow"
                          control={<Radio />}
                          label="Don't know"
                        />
                      </RadioGroup>

                      {errors.noticeErr && (
                        <span className="text-danger">
                          Please choose specified notice period{" "}
                        </span>
                      )}
                    </FormControl>
                  </div>
                </>
              )}
            </div> */}

            <div className="mb-3 radio-end-input">
              <label className="d-block">
                Was there a notice period in the agreement?
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={noticePeriod}
                  onChange={noticeChange}
                >
                  <Tooltip title="Please specify the duration of the notice period provided in the contract, in months.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                      disabled={hide}
                    />
                  </Tooltip>

                  {noticePeriod === "yes" && (
                    <>
                      <label className="d-block fw-400 f-18 mt-3">
                        How long was it (in months)?
                      </label>
                      <InputField
                        type="number"
                        error={formState.errors["noticeDuration"]}
                        disabled={hide}
                        label="Enter the length in months"
                        name="noticeDuration"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </>
                  )}
                  <Tooltip title="Select this if there was no mention of a notice period in the contract.">
                    <FormControlLabel
                      className="radio-light-ip"
                      value="no"
                      disabled={hide}
                      control={<Radio />}
                      label="No"
                    />
                  </Tooltip>

                  <Tooltip title="Select this if you are unsure whether a notice period was mentioned in the contract.">
                    <FormControlLabel
                    disabled={hide}
                      className="radio-light-ip"
                      value="doNotKnow"
                      control={<Radio />}
                      label="Don't know"
                    />
                  </Tooltip>
                </RadioGroup>

                {errors.noticeErr && (
                  <span className="text-danger">
                    Please select the notice period
                  </span>
                )}
              </FormControl>
            </div>

            {/* <div className="col-12 col-md-12 mb-3">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Were there any specific details about your relationship that
                  are important to note? (Optional)
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={specificDetail}
                    onChange={exclusiveChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="exclusive"
                      control={<Radio />}
                      label="Exclusivity agreement"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="private"
                      control={<Radio />}
                      label="Private label product"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="deteriorate"
                      control={<Radio />}
                      label="Deteriorating relationship"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="industryPractices"
                      control={<Radio />}
                      label="Industry practices or agreements"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="bidding"
                      control={<Radio />}
                      label="Systematic competitive bidding"
                    />
                  </RadioGroup>
                </FormControl>
              </div>
            </div> */}

            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Were there any unique factors in your business relationship?
                </label>
                <FormGroup>
                  {factorArr.map((i, index) => {
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
                          value={i.value}
                          control={<Checkbox />}
                          label={i.label}
                          onChange={() => {
                            handleFactorChange(i.value);
                            if (!i.value) {
                              console.log("value of check box");
                            }
                          }}
                          checked={factors.includes(i.value) ?? false}
                        />
                      </Tooltip>
                    );
                  })}
                </FormGroup>
                {errors.factorErr && (
                  <span className="text-danger">
                    Please select the unique factors
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
                className={`next-btn f-16 
                ${hide ? "d-none" : "block"}`}
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
                onClick={() => checkError()}
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

export default TerminationForm;
