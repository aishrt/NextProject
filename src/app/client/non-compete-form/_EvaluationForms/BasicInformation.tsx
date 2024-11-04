"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useState } from "react";
import bubble from "@/assets/info.png";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import DateField from "@/components/Form/DateField";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { Compete } from "@/types/Compete";

type FormValues = {
  industrySector: string;
  numberOfEmployee: string;
  totalRevenue: string;
};

type FormEmpValues = {
  employmentMonth: string;
  lastSalary: string;
  employmentEndDate: string;
  jobTitle: string;
};

const options = [
  { label: "Manufacturing ", value: "Manufacturing" },
  { label: "Healthcare", value: "Healthcare" },
  { label: "Technology", value: "Technology" },
  { label: "Finance", value: "Finance" },
  { label: "Retail", value: "Retail" },
  { label: "Other", value: "other" },
];

const jopTitleArr = [
  { label: "Manager ", value: "Manager" },
  { label: "Sales Representative", value: "Sales Representative" },
  { label: "Engineer", value: "Engineer" },
  { label: "Software Developer", value: "Software Developer" },
  { label: "Other", value: "other" },
];

const schema = z.object({
  industrySector: z
    .string({
      required_error: "Please select Industry",
      invalid_type_error: "Please select Industry",
    })
    .min(1, "Please select Industry"),
  numberOfEmployee: z
    .string({ required_error: "Please enter the number of employees" })
    .min(1, "Please enter the number of employees"),
  totalRevenue: z
    .string({ required_error: "Please enter your company's total revenue" })
    .min(1, "Please enter your company's total revenue"),
});

const empSchema = z.object({
  employmentMonth: z
    .string({ required_error: "Please enter the total number of years" })
    .min(1, "Please enter the total number of years"),
  lastSalary: z
    .string({ required_error: "Enter your last gross monthly salary" })
    .min(1, "Enter your last gross monthly salary"),
  employmentEndDate: z
    .string({ required_error: "Please select the date of your employment" })
    .min(1, "Please select the date of your employment"),
  jobTitle: z
    .string({
      required_error: "Please select your job title from the list",
      invalid_type_error: "Please select your job title from the list",
    })
    .min(1, "Please select your job title from the list"),
});

const BasicInformation = ({
  data,
  hide,
}: {
  data: Compete | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const router = useRouter();

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const { methods: empMethods, setValues: setEmpValues } = useHookForm<
    FormEmpValues,
    typeof empSchema
  >(empSchema);

  const [title, setTitle] = useState("");
  const { formState: formEmpState, control: empControl } = empMethods;

  const [loading, setLoading] = useState(false);

  const [otherIndustrySector, setOtherIndustry] = useState("");
  const [otherErr, setOtherErr] = useState(false);

  const [otherJobTitle, setOtherJobTitle] = useState("");

  const [employmentType, setValue] = React.useState("");
  const [sector, setSector] = React.useState<string>("");

  const [errors, setErrors] = useState({
    typeErr: false,
    jobErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!employmentType) {
      isError = true;
      errorObj = { ...errorObj, typeErr: true };
    }

    if (empMethods.getValues("jobTitle") == "other" && !otherJobTitle) {
      isError = true;
      errorObj = { ...errorObj, jobErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.typeErr = false;
      return newErrorObj;
    });
  };

  const checkError = (): boolean => {
    let err = false;
    if (sector == "other" && !otherIndustrySector) {
      err = true;
      setOtherErr(true);
    }
    return err;
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/non-competition/createCompetition",
        {
          caseId: caseId,
          progress: 10,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "10");
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
      if (checkError()) {
        return;
      }
      let payload: any = {
        caseId: caseId,
        ...values,
        otherIndustrySector: sector == "other" ? otherIndustrySector : "",
        // progress: 30,
        // nextProgress: 30,
      };

      if (!hide) {
        payload = { ...payload, progress: 30, nextProgress: 30 };
      }
      const { data } = await axios.post(
        "/api/client/category/non-competition/createCompetition",
        payload
      );
      console.log(data);

      let id = data.data.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "30");

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

  const handleEmployee = async (values: FormEmpValues) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }
      const { data } = await axios.post(
        "/api/client/category/non-competition/createCompetition",
        {
          caseId: caseId,
          ...values,
          otherJobTitle: title == "other" ? otherJobTitle : "",
          employmentType,
          progress: 30,
          nextProgress: 30,
        }
      );
      console.log(data);

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");

      router.push(`/client/non-compete-form?${searchParam.toString()}`);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setEmpValues({
      employmentMonth: data?.employmentMonth?.toString(),
      lastSalary: data?.lastSalary?.toString(),
      employmentEndDate: data?.employmentEndDate,
      jobTitle: data?.jobTitle,
    });
    setValue(data?.employmentType ?? "");
    setTitle(data?.jobTitle ?? "");
    setOtherJobTitle(data?.otherJobTitle ?? "");

    setValues({
      industrySector: data?.industrySector,
      numberOfEmployee: data?.numberOfEmployee?.toString(),
      totalRevenue: data?.totalRevenue?.toString(),
    });
    setSector(data?.industrySector ?? "");
    setOtherIndustry(data?.otherIndustrySector ?? "");
  }, [data]);

  return (
    <div className="lease-form white-card p-4 rounded mt-4  indivi-form">
      <h3 className="f-22 bold mt-4 gray">Basic Information</h3>
      <p className="f-15 gray pb-3">
        Please provide some basic information about{" "}
        {data?.subject == "employee" ? "yourself" : "your company"}.
      </p>
      {loading ? (
        <p className="text-center mt-5">
          <CircularProgress />
        </p>
      ) : (
        <>
          {data?.subject == "employer" && (
            <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
              <div className="row mt-3">
                <div className="col-12 col-md-6 mb-4">
                  <div className="tooltip-title relative mb-3">
                    <label className="d-block">
                      In what industry do you primarily operate?
                    </label>
                    <SelectField
                      options={options}
                      label=""
                      name="industrySector"
                      className="bglight-select"
                      error={formState.errors["industrySector"]}
                      disabled={hide}
                      control={control}
                      emitChange={(val: any) => {
                        if (val !== "other") {
                          //setOtherIndustry("");
                          setOtherIndustry(data?.otherIndustrySector ?? "");
                        }
                        setSector(val);
                      }}
                    />
                  </div>
                  {sector == "other" && (
                    <div className="lease-input mb-4">
                      <label className="tooltip-title relative">Others</label>
                      <TextField
                        fullWidth
                        id="filled-basic"
                        disabled={hide}

                        label="Other"
                        variant="filled"
                        value={otherIndustrySector}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setOtherIndustry(event.target.value);
                          setOtherErr(false);
                        }}
                      />
                      {otherErr && (
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
                  <div className="lease-input mb-4">
                    <label className="d-block relative">
                      How many employees are working for you?
                    </label>
                    <InputField
                      type="number"
                      disabled={hide}

                      error={formState.errors["numberOfEmployee"]}
                      label=" Number of Employees"
                      name="numberOfEmployee"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      What was your annual revenue for the previous year?
                      <Image className="bubble" src={bubble} alt="" />
                      <span className="hover-tip">
                        If you are self-employed or a new business, please
                        provide an estimate.
                      </span>
                    </label>
                    <InputField
                      type="number"
                      error={formState.errors["totalRevenue"]}
                      label="€"
                      name="totalRevenue"
                      disabled={hide}

                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
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
                    className={`client-btn compete-submit-btn ${
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

          {data?.subject == "employee" && (
            <Form<FormEmpValues> onSubmit={handleEmployee} methods={empMethods}>
              <div className="row employee-selected represent-form mt-4">
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="d-block relative">
                      How many months did you work at the company?
                    </label>
                    <InputField
                      type="number"
                      error={formEmpState.errors["employmentMonth"]}
                      label=" Total number of months"
                      name="employmentMonth"
                      variant="filled"
                      className="bglight-ip"
                      disabled={hide}

                      control={empControl}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="d-block relative">
                      What was your last gross monthly salary before any
                      deductions?
                    </label>
                    <InputField
                      type="number"
                      error={formEmpState.errors["lastSalary"]}
                      label="€"
                      name="lastSalary"
                      disabled={hide}

                      variant="filled"
                      className="bglight-ip"
                      control={empControl}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input">
                    <label className="d-block">
                      When did your employment officially end?
                    </label>
                    <DateField
                      error={formEmpState.errors["employmentEndDate"]}
                      disabled={hide}

                      label="End Date of Employment"
                      name="employmentEndDate"
                      variant="filled"
                      className="bglight-ip w-100"
                      control={empControl}
                      disableFuture={true}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="d-block">What was your job title?</label>
                    <SelectField
                      options={jopTitleArr}
                      label=""
                      name="jobTitle"
                      className="bglight-select"
                      error={formEmpState.errors["jobTitle"]}
                      disabled={hide}

                      control={empControl}
                      emitChange={(val: any) => {
                        setTitle(val);
                        if (val !== "other") {
                          // setOtherJobTitle("");
                          setOtherJobTitle(data?.otherJobTitle ?? "");
                        }
                      }}
                    />
                  </div>
                  {title == "other" && (
                    <div className="lease-input mb-4">
                      <label className="tooltip-title relative">Others</label>
                      <TextField
                        fullWidth
                        disabled={hide}

                        id="filled-basic"
                        label="Other"
                        variant="filled"
                        value={otherJobTitle}
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setOtherJobTitle(event.target.value);
                          setErrors((prev) => {
                            let newErrorObj = { ...prev };
                            newErrorObj.jobErr = false;
                            return newErrorObj;
                          });
                        }}
                      />
                      {errors.jobErr && (
                        <div>
                          <span className="text-danger">
                            Please describe the other job title
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="col-12 col-md-12 mb-4">
                  <div className="mb-3 radio-end-input">
                    <label className="d-block relative">
                      {" "}
                      Was your employment full-time, part-time, or
                      contract-based?{" "}
                    </label>

                    <FormControl className="w-100">
                      <RadioGroup
                        className="w-100"
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={employmentType}
                        onChange={handleChange}
                      >
                        <FormControlLabel
                          className="radio-light-ip"
                          disabled={hide}

                          value="fullTime"
                          control={<Radio />}
                          label="Full-time"
                        />
                        <FormControlLabel
                          className="radio-light-ip"
                          value="partTime"
                          control={<Radio />}
                          label="Part-time"
                          disabled={hide}

                        />
                        <FormControlLabel
                          className="radio-light-ip"
                          value="contract"
                          control={<Radio />}
                          disabled={hide}

                          label="Contract"
                        />
                      </RadioGroup>

                      {errors.typeErr && (
                        <span className="text-danger">
                          Please select the employment type
                        </span>
                      )}
                    </FormControl>
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
        </>
      )}
    </div>
  );
};

export default BasicInformation;
