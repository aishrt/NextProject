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
  TextField,
} from "@mui/material";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import DateField from "@/components/Form/DateField";
import { MaterialSelectField } from "@/components/Form/MaterialSelectField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";
import { Compete } from "@/types/Compete";

type FormValues = {
  clause: string;
  company: string;
  position: string;
  date: string;
  business: string;
};

const options = [
  {
    label: "Employment at a new company",
    value: "newCompany",
  },
  { label: "Starting a similar business", value: "ownBusiness" },
  { label: "Other", value: "other" },
];

const positionArr = [
  { label: "Labourer", value: "Labourer" },
  { label: "Skilled Worker/Technician", value: "Skilled Worker/Technician" },
  { label: "Supervisor", value: "Supervisor" },
  { label: "Manager", value: "Manager" },
  { label: "Senior Manager", value: "Senior Manager" },
  { label: "Salaried Manager", value: "Salaried Manager" },
  { label: "Representative Manager", value: "Representative Manager" },
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

const schema = z.object({
  // industry: z.string().min(1, "please select Industry"),
  // employee: z.string().min(1, "Employee is required"),
  // date: z.string().min(1, "Date is required"),
  // occupation: z.string().min(1, "Occupation is required"),
  // floor: z.string().min(1, "Floor is required"),
});

const AllegedViolation = ({
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

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const [breach, setValue] = React.useState("");

  const [clauseBelieved, setClause] = useState<{
    label: string;
    value: string;
  }>();
  const handleClause = (value: { label: string; value: string }) => {
    setClause(value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.clauseErr = false;
      return newErrorObj;
    });
  };

  const [position, setPosition] = React.useState<{
    label: string;
    value: string;
  }>();
  const handlePosition = (value: { label: string; value: string }) => {
    setPosition(value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.positionErr = false;
      return newErrorObj;
    });
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.breachErr = false;
      return newErrorObj;
    });
  };

  const [companyCompete, setCompete] = React.useState("");
  const competeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCompete((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.companyCompeteErr = false;
      return newErrorObj;
    });
  };

  const [businessCompete, setBusinessCompete] = React.useState("");
  const changeBusiness = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBusinessCompete((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.businessCompeteErr = false;
      return newErrorObj;
    });
  };
  const [startJob, setStartJob] = useState<Dayjs | null>(dayjs(""));

  const handleJob = (date: any) => {
    if (date) {
      setStartJob(date);
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.startJobErr = false;
        return newErrorObj;
      });
    } else {
      setStartJob(null);
    }
  };

  const [otherClauseBelieved, setOtherClause] = React.useState("");
  const [newCompany, setNewCompany] = React.useState("");

  const [newBusiness, setNewBusiness] = React.useState("");
  const [typeOfBusiness, setTypeOfBusiness] = React.useState("");

  useEffect(() => {
    if (clauseBelieved == null) {
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.otherReasonErr = false;
        return newErrorObj;
      });
    }
  }, [clauseBelieved]);

  const [errors, setErrors] = useState({
    breachErr: false,
    clauseErr: false,
    otherReasonErr: false,
    newCompanyErr: false,
    positionErr: false,
    companyCompeteErr: false,
    newBusinessErr: false,
    businessErr: false,
    businessCompeteErr: false,
    startJobErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!breach) {
      isError = true;
      errorObj = { ...errorObj, breachErr: true };
    }
    if (breach == "yes") {
      if (!clauseBelieved) {
        isError = true;
        errorObj = { ...errorObj, clauseErr: true };
      }

      if (clauseBelieved?.value == "other" && !otherClauseBelieved) {
        isError = true;
        errorObj = { ...errorObj, otherReasonErr: true };
      }

      if (clauseBelieved?.value == "newCompany" && !newCompany) {
        isError = true;
        errorObj = { ...errorObj, newCompanyErr: true };
      }
      if (clauseBelieved?.value == "newCompany" && !position) {
        isError = true;
        errorObj = { ...errorObj, positionErr: true };
      }
      if (clauseBelieved?.value == "newCompany" && !companyCompete) {
        isError = true;
        errorObj = { ...errorObj, companyCompeteErr: true };
      }
      if (clauseBelieved?.value == "ownBusiness" && !newBusiness) {
        isError = true;
        errorObj = { ...errorObj, newBusinessErr: true };
      }
      if (clauseBelieved?.value == "ownBusiness" && !typeOfBusiness) {
        isError = true;
        errorObj = { ...errorObj, businessErr: true };
      }

      if (clauseBelieved?.value == "ownBusiness" && !businessCompete) {
        isError = true;
        errorObj = { ...errorObj, businessCompeteErr: true };
      }
      if (
        clauseBelieved?.value == "ownBusiness" &&
        dayjs(startJob).format("YYYY/MM/DD") == "Invalid Date"
      ) {
        isError = true;
        errorObj = { ...errorObj, startJobErr: true };
      }
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
          progress: 30,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");
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
        breach,
        clauseBelieved: clauseBelieved?.value,
        otherClauseBelieved:
          clauseBelieved?.value == "other" ? otherClauseBelieved : "",

        newCompany: clauseBelieved?.value == "newCompany" ? newCompany : "",

        position: clauseBelieved?.value == "newCompany" ? position?.value : "",
        companyCompete:
          clauseBelieved?.value == "newCompany" ? companyCompete : "",

        newBusiness: clauseBelieved?.value == "ownBusiness" ? newBusiness : "",

        typeOfBusiness:
          clauseBelieved?.value == "ownBusiness" ? typeOfBusiness : "",

        businessCompete:
          clauseBelieved?.value == "ownBusiness" ? businessCompete : "",

        startJob:
          clauseBelieved?.value == "ownBusiness"
            ? dayjs(startJob).format("YYYY/MM/DD")
            : "",

        // progress: 50,
        // nextProgress: 50,
      };

      if (!hide) {
        payload = { ...payload, progress: 50, nextProgress: 50 };
      }
      const { data } = await axios.post(
        "/api/client/category/non-competition/createCompetition",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "50");

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
    setValue(data?.breach ?? "");
    setClause({
      label:
        data?.clauseBelieved == "newCompany"
          ? "Employment at a new company"
          : data?.clauseBelieved == "ownBusiness"
          ? "Starting a similar business"
          : "Other",
      value: data?.clauseBelieved ?? "",
    });
    setPosition({ label: data?.position ?? "", value: data?.position ?? "" });
    setNewCompany(data?.newCompany ?? "");
    setCompete(data?.companyCompete ?? "");
    setNewBusiness(data?.newBusiness ?? "");
    setTypeOfBusiness(data?.typeOfBusiness ?? "");
    setBusinessCompete(data?.businessCompete ?? "");
    setStartJob(dayjs(data?.startJob));
    setOtherClause(data?.otherClauseBelieved ?? "");
  }, [data]);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray">Alleged Violation</h3>

      {loading ? (
        <p className="text-center mt-5">
          <CircularProgress />
        </p>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Has a breach of the non-compete clause been alleged or
                  identified?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    A formal notification typically involves a registered letter
                    detailing the alleged breach.
                  </span>
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={breach}
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
                      value="no"
                      control={<Radio />}
                      disabled={hide}
                      label="No"
                    />
                  </RadioGroup>
                  {errors.breachErr && (
                    <span className="text-danger">
                      Please select breached clause
                    </span>
                  )}
                </FormControl>
              </div>

              {breach == "yes" && (
                <>
                  <div className="mt-3 row">
                    <div className="col-12 col-md-6 mb-4">
                      <div className="tooltip-title relative mb-3">
                        <label className="d-block">
                          How is the clause believed to have been violated?
                        </label>
                        <MaterialSelectField
                          label=""
                          placeholder=""
                          changeValue={clauseBelieved}
                          disabled={hide}
                          setChangeValue={handleClause}
                          options={options}
                        />
                        {errors.clauseErr && (
                          <span className="text-danger">
                            Please enter the clause believed
                          </span>
                        )}
                        {/* <SelectField
                        options={options}
                        label=""
                        name="clause"
                        className="bglight-select"
                        error={formState.errors["clause"]}
                        control={control}
                      /> */}
                      </div>
                    </div>
                  </div>

                  <div className="row col-12 col-md-6">
                    {clauseBelieved?.value == "other" && (
                      <>
                        <TextField
                          id="filled-basic"
                          label="Other"
                          disabled={hide}
                          variant="filled"
                          value={otherClauseBelieved}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setOtherClause(event.target.value);
                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.otherReasonErr = false;
                              return newErrorObj;
                            });
                          }}
                        />

                        {errors.otherReasonErr && (
                          <span className="text-danger">
                            {" "}
                            Please describe the other statement
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  {clauseBelieved?.value == "newCompany" && (
                    <div className="row">
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input mb-4">
                          <label className="tooltip-title relative">
                            {" "}
                            What is the name of the new company?
                          </label>
                          <TextField
                            fullWidth
                            id="filled-basic"
                            label="Name of the new company"
                            disabled={hide}
                            variant="filled"
                            value={newCompany}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewCompany(event.target.value);
                              setErrors((prev) => {
                                let newErrorObj = { ...prev };
                                newErrorObj.newCompanyErr = false;
                                return newErrorObj;
                              });
                            }}
                          />
                          {errors.newCompanyErr && (
                            <div>
                              <span className="text-danger">
                                Please enter the name of the new company
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input mb-4">
                          <label className="tooltip-title relative">
                            {" "}
                            What is the position at the new company?
                          </label>
                          {/* <InputField
                          error={formState.errors["position"]}
                          label="Position at the new company"
                          name="position"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        /> */}
                          <MaterialSelectField
                            label=""
                            placeholder=""
                            changeValue={position}
                            setChangeValue={handlePosition}
                            options={positionArr}
                          />
                          {errors.positionErr && (
                            <div>
                              <span className="text-danger">
                                Please enter the position at the new company
                              </span>
                            </div>
                          )}

                          {/* <TextField
                            fullWidth
                            id="filled-basic"
                            label="Name of the new company"
                            variant="filled"
                            value={position}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setPosition(event.target.value);
                              setErrors((prev) => {
                                let newErrorObj = { ...prev };
                                newErrorObj.positionErr = false;
                                return newErrorObj;
                              });
                            }}
                          />
                        */}
                        </div>
                      </div>
                      <div className="col-12 col-md-12 mb-4">
                        <div className="mb-3 radio-end-input">
                          <label className="tooltip-title relative">
                            Does the new employment or business activity
                            directly compete with the previous employment?
                          </label>

                          <FormControl className="w-100">
                            <RadioGroup
                              className="w-100"
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="controlled-radio-buttons-group"
                              value={companyCompete}
                              onChange={competeChange}
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

                            {errors.companyCompeteErr && (
                              <span className="text-danger">
                                Please select the company compete
                              </span>
                            )}
                          </FormControl>
                        </div>
                      </div>
                    </div>
                  )}
                  {clauseBelieved?.value == "ownBusiness" && (
                    <div className="mt-3 row">
                      <div className="col-12 col-md-6 mb-4">
                        <div className="tooltip-title relative mb-3">
                          <label className="d-block">
                            What is the name of the new business?
                          </label>
                          <TextField
                            fullWidth
                            disabled={hide}
                            id="filled-basic"
                            label="Name of the new company"
                            variant="filled"
                            value={newBusiness}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setNewBusiness(event.target.value);
                              setErrors((prev) => {
                                let newErrorObj = { ...prev };
                                newErrorObj.newBusinessErr = false;
                                return newErrorObj;
                              });
                            }}
                          />
                          {errors.newBusinessErr && (
                            <div>
                              <span className="text-danger">
                                Please enter the name of your new business
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input mb-4">
                          <label className="tooltip-title relative">
                            What type of business is it?
                          </label>

                          {/* <InputField
                          error={formState.errors["company"]}
                          label="Name of the new company"
                          name="company"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        /> */}

                          <TextField
                            fullWidth
                            id="filled-basic"
                            label="Type of business"
                            variant="filled"
                            value={typeOfBusiness}
                            disabled={hide}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setTypeOfBusiness(event.target.value);
                              setErrors((prev) => {
                                let newErrorObj = { ...prev };
                                newErrorObj.businessErr = false;
                                return newErrorObj;
                              });
                            }}
                          />
                          {errors.businessErr && (
                            <div>
                              <span className="text-danger">
                                Please enter the type of business
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="mb-3 radio-end-input">
                          <label className="tooltip-title relative">
                            Does this new business directly compete with the
                            previous employment?
                          </label>

                          <FormControl className="w-100">
                            <RadioGroup
                              className="w-100"
                              aria-labelledby="demo-controlled-radio-buttons-group"
                              name="controlled-radio-buttons-group"
                              value={businessCompete}
                              onChange={changeBusiness}
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
                                control={<Radio />}
                                disabled={hide}
                                label="No"
                              />
                            </RadioGroup>

                            {errors.businessCompeteErr && (
                              <span className="text-danger">
                                Please select the business compete
                              </span>
                            )}
                          </FormControl>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input mb-4">
                          <label className="tooltip-title relative">
                            When was the new business started?{" "}
                          </label>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={["DatePicker"]}>
                              <DatePicker
                                disabled={hide}
                                sx={{
                                  width: 400,
                                  backgroundColor: "#d5eae0",
                                }}
                                value={startJob}
                                onChange={handleJob}
                                format="DD/MM/YYYY"
                              />
                            </DemoContainer>
                          </LocalizationProvider>

                          {errors.startJobErr && (
                            <span className="text-danger">
                              Please enter the start date of the new job
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
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

export default AllegedViolation;
