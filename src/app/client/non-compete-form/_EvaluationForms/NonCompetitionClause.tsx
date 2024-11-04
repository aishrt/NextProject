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
  CircularProgress,
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
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Compete } from "@/types/Compete";
import { Department } from "@/types/Department";

type FormValues = {
  nonCompetePeriod: string;
  salaryPercentage: string;
  service: string;
  industrySectorCompany: string;
  city: string;
  departmental: string;
  employeeLocation: string;
  companyLocation: string;
  otherGeographical: string;
};

const options = [
  { label: "Front office", value: "Front office" },
  { label: "Human Resources", value: "Human Resources" },
  { label: "Legal", value: "Legal" },
  { label: "Finance/Accounting", value: "Finance/Accounting" },
  { label: "Production", value: "Production" },
  { label: "R&D", value: "R&D" },
  { label: "Business", value: "Business" },
  { label: "Management", value: "Management" },
];

const industry = [
  { label: "Commerce and distribution", value: "Commerce and distribution" },
  { label: "Transport and freight", value: "Transport and freight" },
  { label: "Automobile/Motorcycle", value: "Automobile/Motorcycle" },
  { label: "Energy", value: "Energy" },
  { label: "Banking/Insurance", value: "Banking/Insurance" },
  { label: "Clothing/Textile", value: "Clothing/Textile" },
  { label: "Pharmaceutical/Medical", value: "Pharmaceutical/Medical" },
  { label: "Consulting", value: "Consulting" },
  { label: "Food Industry", value: "Food Industry" },
  { label: "Aerospace", value: "Aerospace" },
  { label: "Tourism/Entertainment", value: "Tourism/Entertainment" },
  { label: "Restaurant/Hotel", value: "Restaurant/Hotel" },
  { label: "Services", value: "Services" },
  { label: "Education/Training", value: "Education/Training" },
  { label: "Industry", value: "Industry" },
  { label: "Real Estate", value: "Real Estate" },
  { label: "Craft", value: "Craft" },
  { label: "Security/Defense", value: "Security/Defense" },
  { label: "Digital/Media", value: "Digital/Media" },
];

const prohibitedArr = [
  { label: "Working for a competitor", value: "Front office" },
  { label: "Starting a similar business", value: "Human Resources" },
  { label: "Soliciting former clients", value: "Legal" },
  { label: "Other", value: "other" },
];

const graphicalArr = [
  { label: "Locations where the employee worked", value: "employeeLocation" },
  { label: "Company's business locations", value: "companyLocation" },
  { label: "Specific city or region", value: "Specific city" },
  { label: "Multi-departmental", value: "Multi-departmental" },
  { label: "Other", value: "other" },
];

const restrictionArr = [
  {
    label: "Locations where the employee worked",
    value: "employeeWorkedLocation",
  },
  { label: "Company`s business locations", value: "companyLocationLocation" },
];

const NonCompetitionClause = ({
  data,
  hide,
}: {
  data: Compete | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const [compensation, setCompete] = React.useState("");
  const [prohibitedActivities, setProhibited] = React.useState<string[]>([]);
  const [geoGraphical, setGraphical] = React.useState<string[]>([]);

  const schema = z.object({
    nonCompetePeriod: z
      .string({ required_error: "Please enter the duration" })
      .min(1, "Please enter the duration"),

    salaryPercentage:
      compensation == "yes"
        ? z
            .string({ required_error: "Please enter the salary percentage" })
            .min(1, "Please enter the salary percentage")
        : z.string().optional(),

    service: z
      .string({ required_error: "Please select the department" })
      .min(1, "Please select the department"),

    industrySectorCompany: z
      .string({ required_error: "Please select the industry sector" })
      .min(1, "Please select the industry sector"),
    city: geoGraphical.includes("Specific city")
      ? z
          .string({ required_error: "Please enter the city" })
          .min(1, "Please enter the city")
      : z.string().optional(),

    departmental: geoGraphical.includes("Multi-departmental")
      ? z
          .string({ required_error: "Please enter the department" })
          .min(1, "Please enter the department")
      : z.string().optional(),

    otherGeographical: geoGraphical.includes("other")
      ? z
          .string({ required_error: "Please enter the country" })
          .min(1, "Please enter the country")
      : z.string().optional(),

    employeeLocation: geoGraphical.includes("employeeLocation")
      ? z
          .string({ required_error: "Please enter the radius in kilometers" })
          .min(1, "Please enter the radius in kilometers")
      : z.string().optional(),

    companyLocation: geoGraphical.includes("companyLocation")
      ? z
          .string({ required_error: "Please enter the radius in kilometers" })
          .min(1, "Please enter the radius in kilometers")
      : z.string().optional(),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const [compensationSource, setValue] = React.useState("");

  const [reasonsForClause, setReasonsForClause] = React.useState<string[]>([]);

  const [otherReasonsForClause, setOtherReasonsForClause] = useState("");

  const [otherProhibitedActivities, setOtherProhibited] = useState("");

  const handleGraphical = (label: number) => {
    setGraphical((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];

      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.graphicalErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.compensationSourceErr = false;
      return newErrorObj;
    });
  };

  const [explicitly, seteExplicitly] = React.useState("");

  const handleexplicitly = (event: React.ChangeEvent<HTMLInputElement>) => {
    seteExplicitly((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.explicitlyErr = false;
      return newErrorObj;
    });
  };

  const handleCompete = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompete((event.target as HTMLInputElement).value);
    if (event.target.value == "no") {
      setValues({
        salaryPercentage: "",
      });
    }
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.compensationErr = false;
      return newErrorObj;
    });
  };

  let reasonsClauseArr: any = [
    {
      label: "Protecting trade secrets",
      value: "Protecting trade secrets",
      tooltip:
        "Confidential business information that gives the company a competitive advantage, e.g., formulas, processes, customer lists.",
    },
    {
      label: "Client relationships",
      value: "Client relationships",
      tooltip:
        "Established connections with customers or clients that the company wants to protect.",
    },
    {
      label: "Other",
      value: "other",
      tooltip: "",
    },
  ];

  const [penaltyClause, setPenaltyClause] = React.useState("");
  const handleClause = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPenaltyClause((event.target as HTMLInputElement).value);
    if (event.target.value == "no") {
      setPenaltyAmount(data?.penaltyAmount?.toString() ?? "");
      // setJudicialRequest("");
      // setPenaltyAmount(data?.penaltyAmount?.toString() ?? "");
      setJudicialRequest(data?.judicialRequest ?? "");
    }
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.penaltyClauseErr = false;
      return newErrorObj;
    });
  };

  const [lastMonthlySalary, setLastMonthlySalary] = React.useState("");

  const [nonCompeteDuration, setDuration] = React.useState("");

  const [judicialRequest, setJudicialRequest] = React.useState("");
  const handleRequest = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJudicialRequest((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.judicialRequestErr = false;
      return newErrorObj;
    });
  };

  const [penaltyAmount, setPenaltyAmount] = React.useState("");

  const [potentialLoss, setLoss] = React.useState("");

  const [errors, setErrors] = useState({
    compensationSourceErr: false,
    reasonsForClauseErr: false,
    otherReasonsForClauseErr: false,
    prohibitedActivitiesErr: false,
    otherProhibitedActivitiesErr: false,
    explicitlyErr: false,
    penaltyClauseErr: false,
    penaltyAmountErr: false,
    judicialRequestErr: false,
    lastMonthlySalaryErr: false,
    nonCompeteDurationErr: false,
    potentialLossErr: false,
    compensationErr: false,
    graphicalErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!compensation) {
      isError = true;
      errorObj = { ...errorObj, compensationErr: true };
    }
    if (!compensationSource) {
      isError = true;
      errorObj = { ...errorObj, compensationSourceErr: true };
    }
    if (reasonsForClause.length == 0) {
      isError = true;
      errorObj = { ...errorObj, reasonsForClauseErr: true };
    }

    if (reasonsForClause.includes("other") && !otherReasonsForClause) {
      isError = true;
      errorObj = { ...errorObj, otherReasonsForClauseErr: true };
    }

    if (geoGraphical.length == 0) {
      isError = true;
      errorObj = { ...errorObj, graphicalErr: true };
    }

    if (prohibitedActivities.length == 0) {
      isError = true;
      errorObj = { ...errorObj, prohibitedActivitiesErr: true };
    }
    if (prohibitedActivities.includes("other") && !otherProhibitedActivities) {
      isError = true;
      errorObj = { ...errorObj, otherProhibitedActivitiesErr: true };
    }

    if (!explicitly) {
      isError = true;
      errorObj = { ...errorObj, explicitlyErr: true };
    }

    if (!penaltyClause) {
      isError = true;
      errorObj = { ...errorObj, penaltyClauseErr: true };
    }
    if (penaltyClause == "yes" && !penaltyAmount) {
      isError = true;
      errorObj = { ...errorObj, penaltyAmountErr: true };
    }

    if (penaltyClause == "yes" && !judicialRequest) {
      isError = true;
      errorObj = { ...errorObj, judicialRequestErr: true };
    }
    // if (data?.subject == "employee" && !lastMonthlySalary) {
    //   isError = true;
    //   errorObj = { ...errorObj, lastMonthlySalaryErr: true };
    // }

    // if (data?.subject == "employee" && !nonCompeteDuration) {
    //   isError = true;
    //   errorObj = { ...errorObj, nonCompeteDurationErr: true };
    // }
    // if (data?.subject == "employee" && !potentialLoss) {
    //   isError = true;
    //   errorObj = { ...errorObj, potentialLossErr: true };
    // }

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
          progress: 20,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
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

        employeeLocation: geoGraphical.includes("employeeLocation")
          ? values.employeeLocation
          : "",

        companyLocation: geoGraphical.includes("companyLocation")
          ? values.companyLocation
          : "",

        city: geoGraphical.includes("Specific city") ? values.city : "",

        departmental: geoGraphical.includes("Multi-departmental")
          ? values.departmental
          : "",

        otherGeographical: geoGraphical.includes("other")
          ? values.otherGeographical
          : "",

        compensation,
        compensationSource,
        reasonsForClause,
        explicitly,
        otherReasonsForClause: reasonsForClause.includes("other")
          ? otherReasonsForClause
          : "",
        prohibitedActivities,
        otherProhibitedActivities: prohibitedActivities.includes("other")
          ? otherProhibitedActivities
          : "",
        penaltyClause,
        geoGraphical,
        penaltyAmount: penaltyClause == "yes" ? penaltyAmount : "",
        judicialRequest: penaltyClause == "yes" ? judicialRequest : "",
        lastMonthlySalary,
        nonCompeteDuration,
        potentialLoss,
        // progress: 40,
        // nextProgress: 40,
      };
      if (!hide) {
        payload = { ...payload, progress: 40, nextProgress: 40 };
      }
      const { data } = await axios.post(
        "/api/client/category/non-competition/createCompetition",
        payload
      );

      let id = data.data.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "40");

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

  const handleReason = (label: number) => {
    setReasonsForClause((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      if (!updatedCategories.includes("other")) {
        // setOtherReasonsForClause("");
        setOtherReasonsForClause(data?.otherReasonsForClause ?? "");
      }
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.reasonsForClauseErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const handleProhibited = (label: number) => {
    setProhibited((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      if (!updatedCategories.includes("other")) {
        // setOtherProhibited("");
        setOtherProhibited(data?.otherProhibitedActivities ?? "");
      }
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.prohibitedActivitiesErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  useEffect(() => {
    setValues({
      nonCompetePeriod: data?.nonCompetePeriod?.toString(),
      salaryPercentage: data?.salaryPercentage?.toString(),
      service: data?.service,
      industrySectorCompany: data?.industrySectorCompany,
      employeeLocation: data?.employeeLocation?.toString(),
      companyLocation: data?.companyLocation?.toString(),
      city: data?.city,
      departmental: data?.departmental,
      otherGeographical: data?.otherGeographical,
    });
    setCompete(data?.compensation ?? "");
    setValue(data?.compensationSource ?? "");
    setReasonsForClause(data?.reasonsForClause ?? []);
    setOtherReasonsForClause(data?.otherReasonsForClause ?? "");
    setProhibited(data?.prohibitedActivities ?? []);
    setOtherProhibited(data?.otherProhibitedActivities ?? "");
    setPenaltyClause(data?.penaltyClause ?? "");
    setPenaltyAmount(data?.penaltyAmount?.toString() ?? "");
    setJudicialRequest(data?.judicialRequest ?? "");
    seteExplicitly(data?.explicitly ?? "");
    setGraphical(data?.geoGraphical ?? []);
  }, [data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray">
        Details of the Non-Competition Clause
      </h3>
      <p className="f-15 gray pb-3">
        Please provide detailed information about the non-competition clause.
      </p>
      {loading ? (
        <p className="text-center mt-5">
          <CircularProgress />
        </p>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-2">
                <label className="tooltip-title relative">
                  How many months was the non-compete period set for?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    The duration for which you are restricted from competing
                    after leaving the company.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["nonCompetePeriod"]}
                  label="Months"
                  disabled={hide}
                  name="nonCompetePeriod"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-2">
                <label className="d-block relative">
                  Was there financial compensation in exchange for the
                  non-compete agreement?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={compensation}
                    onChange={handleCompete}
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
                  {errors.compensationErr && (
                    <span className="text-danger">
                      Please select the financial compensation
                    </span>
                  )}
                </FormControl>
              </div>
            </div>

            {compensation == "yes" && (
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-2">
                  <label className="tooltip-title relative">
                    Please indicate the percentage of salary that was allocated
                    to it.
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      For a lump sum: Divide the lump sum by the annual salary
                      and multiply by 100 to get the percentage .For benefits in
                      kind (e.g., company car): Estimate the annual monetary
                      value of the benefit and follow the same calculation
                      method.
                    </span>
                  </label>
                  <InputField
                    type="number"
                    error={formState.errors["salaryPercentage"]}
                    label="% of salary"
                    name="salaryPercentage"
                    variant="filled"
                    disabled={hide}
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            )}

            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Was the compensation for the non-compete clause part of
                  individual contract or a collective bargaining agreement?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    An individual contract is specific to you, while a
                    collective bargaining agreement covers a group of employees.
                  </span>
                </label>

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={compensationSource}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Individual Contract"
                      control={<Radio />}
                      label="Individual Contract"
                      disabled={hide}
                    />
                    <FormControlLabel
                      disabled={hide}
                      className="radio-light-ip"
                      value="Collective Bargaining Agreement"
                      control={<Radio />}
                      label="Collective Bargaining Agreement"
                      v
                    />
                  </RadioGroup>
                  {errors.compensationSourceErr && (
                    <span className="text-danger">
                      Please select the compensation source
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="radio-end-input mb-3">
                <label className="d-block">
                  For what reasons was the non-compete clause included in the
                  agreement?{" "}
                </label>

                <FormGroup>
                  {reasonsClauseArr.map((i: any, index: number) => {
                    return (
                      <Tooltip key={index} title={i.tooltip} placement="top">
                        <FormControlLabel
                          key={index}
                          className="radio-light-ip"
                          control={<Checkbox />}
                          disabled={hide}
                          label={i.label}
                          onChange={() => handleReason(i.value)}
                          checked={reasonsForClause.includes(i.value) ?? false}
                        />
                      </Tooltip>
                    );
                  })}

                  {errors.reasonsForClauseErr && (
                    <span className="text-danger">
                      Please select the reasons for clause
                    </span>
                  )}
                </FormGroup>
              </div>
              {reasonsForClause.includes("other") && (
                <div className="lease-input mb-4">
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Other"
                    disabled={hide}
                    variant="filled"
                    value={otherReasonsForClause}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setOtherReasonsForClause(event.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.otherReasonsForClauseErr = false;
                        return newErrorObj;
                      });
                    }}
                  />

                  {errors.otherReasonsForClauseErr && (
                    <div>
                      <span className="text-danger">
                        Please describe the other statement
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="radio-end-input mb-3">
                <label className="d-block">
                  Which activities are prohibited by the non-compete clause?
                </label>

                <FormGroup>
                  {prohibitedArr.map((i: any, index: number) => {
                    return (
                      <FormControlLabel
                        disabled={hide}
                        key={index}
                        className="radio-light-ip"
                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleProhibited(i.value)}
                        checked={
                          prohibitedActivities.includes(i.value) ?? false
                        }
                      />
                    );
                  })}
                  {errors.prohibitedActivitiesErr && (
                    <span className="text-danger">
                      Please select the prohibited activities
                    </span>
                  )}
                </FormGroup>
              </div>

              {prohibitedActivities.includes("other") && (
                <div>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    disabled={hide}
                    label="Other"
                    variant="filled"
                    value={otherProhibitedActivities}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setOtherProhibited(event.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.otherProhibitedActivitiesErr = false;
                        return newErrorObj;
                      });
                    }}
                  />

                  {errors.otherProhibitedActivitiesErr && (
                    <div>
                      <span className="text-danger">
                        Please describe the other statement
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="tooltip-title relative mb-3">
                <label className="d-block">
                  {" "}
                  In which department or area of the company was the work
                  performed?{" "}
                </label>

                <SelectField
                  options={options}
                  label=""
                  name="service"
                  className="bglight-select"
                  error={formState.errors["service"]}
                  disabled={hide}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="tooltip-title relative mb-3">
                <label className="d-block">
                  In which industry sector does this non-compete agreement
                  apply?
                </label>

                <SelectField
                  options={industry}
                  label=""
                  disabled={hide}
                  name="industrySectorCompany"
                  className="bglight-select"
                  error={formState.errors["industrySectorCompany"]}
                  control={control}
                />
              </div>
            </div>
          </div>

          <div className="col-12 col-md-12 mb-4">
            <div className="radio-end-input mb-3">
              <label className="d-block">
                What is the geographical scope of the clause? Does the
                geographical restriction apply to:{" "}
              </label>

              <FormGroup>
                {graphicalArr.map((i: any, index: number) => {
                  return (
                    <FormControlLabel
                      key={index}
                      className="radio-light-ip"
                      control={<Checkbox />}
                      label={i.label}
                      onChange={() => handleGraphical(i.value)}
                      checked={geoGraphical.includes(i.value) ?? false}
                      disabled={hide}
                    />
                  );
                })}
                {errors.graphicalErr && (
                  <span className="text-danger">
                    Please select at least one
                  </span>
                )}
              </FormGroup>
            </div>

            {geoGraphical.includes("employeeLocation") && (
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-4">
                  <label className="d-block relative">
                    What is the specified radius in kilometers?
                  </label>

                  <InputField
                    type="number"
                    disabled={hide}
                    error={formState.errors["employeeLocation"]}
                    label="km"
                    name="employeeLocation"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            )}

            {geoGraphical.includes("companyLocation") && (
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-4">
                  <label className="d-block relative">
                    What is the specified radius in kilometers?
                  </label>

                  <InputField
                    type="number"
                    disabled={hide}
                    error={formState.errors["companyLocation"]}
                    label="km"
                    name="companyLocation"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            )}

            {geoGraphical.includes("Specific city") && (
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">
                    To which city or region does the non-compete clause apply?
                  </label>
                  <InputField
                    error={formState.errors["city"]}
                    label="City"
                    name="city"
                    variant="filled"
                    disabled={hide}
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            )}

            {geoGraphical.includes("Multi-departmental") && (
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">
                    To which departments does the non-compete clause apply?{" "}
                  </label>
                  {/* <InputField
                    error={formState.errors["departmental"]}
                    label="State/Province"
                    name="departmental"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  /> */}

                  <SelectField
                    options={Department}
                    label=""
                    disabled={hide}
                    name="departmental"
                    className="bglight-select"
                    error={formState.errors["departmental"]}
                    control={control}
                  />
                </div>
              </div>
            )}

            {geoGraphical.includes("other") && (
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">
                    Please specify :{" "}
                  </label>
                  <InputField
                    disabled={hide}
                    error={formState.errors["otherGeographical"]}
                    label="Other"
                    name="otherGeographical"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="radio-end-input mb-3">
                <label className="d-block">
                  Was it explicitly stated that the non-compete clause would
                  remain in effect after the employment relationship ended?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={explicitly}
                    onChange={handleexplicitly}
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
                      value="no"
                      disabled={hide}
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                  {errors.explicitlyErr && (
                    <span className="text-danger">
                      Please select the explicitly stated
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
          </div>

          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="radio-end-input mb-3">
                <label className="d-block">
                  Is there a penalty clause attached to the non-competition
                  clause?{" "}
                </label>

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={penaltyClause}
                    onChange={handleClause}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="yes"
                      control={<Radio />}
                      disabled={hide}
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
                  {errors.penaltyClauseErr && (
                    <span className="text-danger">
                      Please let us know, is there a penalty clause
                    </span>
                  )}{" "}
                </FormControl>
              </div>
            </div>

            {penaltyClause == "yes" && (
              <div>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="d-block relative">
                      What is the penalty amount (in months of salary)?
                    </label>
                    <TextField
                      fullWidth
                      id="filled-basic"
                      disabled={hide}
                      type="number"
                      label="Months"
                      variant="filled"
                      value={penaltyAmount}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setPenaltyAmount(event.target.value);
                        setErrors((prev) => {
                          let newErrorObj = { ...prev };
                          newErrorObj.penaltyAmountErr = false;
                          return newErrorObj;
                        });
                      }}
                    />
                    {errors.penaltyAmountErr && (
                      <span className="text-danger">
                        Please enter the penalty amount
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-12 col-md-12 mb-4">
                  <div className="radio-end-input mb-3">
                    <label className="d-block">
                      Has a judicial request for the reduction of the penalty
                      amount been made?
                    </label>

                    <FormControl className="w-100">
                      <RadioGroup
                        className="w-100"
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={judicialRequest}
                        onChange={handleRequest}
                      >
                        <FormControlLabel
                          className="radio-light-ip"
                          value="yes"
                          disabled={hide}
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
                      {errors.judicialRequestErr && (
                        <span className="text-danger">
                          Please select the judicial request
                        </span>
                      )}{" "}
                    </FormControl>
                  </div>
                </div>
              </div>
            )}
          </div>
          {/* {data?.subject == "employee" && (
          <>
            <h6 className="f-18 bold">Potential Financial Loss</h6>
            <div className="mt-3 row">
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-4">
                  <label className="d-block relative">
                    Based on your last monthly salary of
                  </label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label=""
                    variant="filled"
                    type="number"
                    value={lastMonthlySalary}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setLastMonthlySalary(event.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.lastMonthlySalaryErr = false;
                        return newErrorObj;
                      });
                    }}
                  />
                  {errors.lastMonthlySalaryErr && (
                    <div>
                      <span className="text-danger">
                        Please enter your last monthly salary
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-4">
                  <label className="d-block relative">
                    The non-compete duration
                  </label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label=""
                    variant="filled"
                    type="number"
                    value={nonCompeteDuration}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setDuration(event.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.nonCompeteDurationErr = false;
                        return newErrorObj;
                      });
                    }}
                  />
                  {errors.nonCompeteDurationErr && (
                    <div>
                      <span className="text-danger">
                        Please enter non-compete duration
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="col-12 col-md-12 mb-4">
                <div className="lease-input mb-4">
                  <label className="d-block relative">
                    Your estimated potential loss is (€)
                  </label>
                  <span className="span-label mb-4 d-block">
                    [Note: This is an estimate and may not reflect your actual
                    loss.]
                  </span>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label=""
                    variant="filled"
                    type="number"
                    value={potentialLoss}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setLoss(event.target.value);
                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.potentialLossErr = false;
                        return newErrorObj;
                      });
                    }}
                  />
                  {errors.potentialLossErr && (
                    <div>
                      <span className="text-danger">
                        Please enter estimated potential loss
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )} */}
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
      )}
    </div>
  );
};

export default NonCompetitionClause;
