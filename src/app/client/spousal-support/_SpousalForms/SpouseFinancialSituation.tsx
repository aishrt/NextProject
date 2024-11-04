"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import bubble from "@/assets/info.png";
import Image from "next/image";
import axios from "axios";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Spousal } from "@/types/Spousal";
import { InputField } from "@/components/Form/InputField";

type FormValues = {
  spouseAge: string;
  spouseIncome: string;
  spouseAssets: string;
  spouseShare: string;
};

const schema = z.object({
  spouseAge: z
    .string({ required_error: "Please enter the age" })
    .min(1, "Please enter the age"),
  spouseIncome: z
    .string({ required_error: "Please enter a yearly income" })
    .min(1, "Please enter a yearly income"),
  spouseAssets: z
    .string({ required_error: "Please enter spouse assets" })
    .min(1, "Please enter spouse assets"),
  spouseShare: z
    .string({ required_error: "Please enter the spouse share" })
    .min(1, "Please enter the spouse share"),
});

const SpouseFinancialSituation = ({ data }: { data: Spousal | undefined }) => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "30");
  const { formState, control } = methods;

  const [spouseHealth, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.healthErr = false;
      return newErrorObj;
    });
  };

  const [spouseRetirePayment, setPayment] = useState("");
  const [spouseRetired, setRetited] = React.useState("");
  const handleRetire = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRetited((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.retireErr = false;
      return newErrorObj;
    });
  };

  const [spouseWorth, setWorth] = useState("");
  const [spouseValuable, setSpouse] = React.useState("");
  const spouseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSpouse((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.spouseErr = false;
      return newErrorObj;
    });
  };

  const [errors, setErrors] = useState({
    healthErr: false,
    retireErr: false,
    payErr: false,
    spouseErr: false,
    worthErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!spouseHealth) {
      isError = true;
      errorObj = { ...errorObj, healthErr: true };
    }

    if (!spouseRetired) {
      isError = true;
      errorObj = { ...errorObj, retireErr: true };
    }

    if (spouseRetired == "no" && !spouseRetirePayment) {
      isError = true;
      errorObj = { ...errorObj, payErr: true };
    }

    if (!spouseValuable) {
      isError = true;
      errorObj = { ...errorObj, spouseErr: true };
    }

    if (spouseValuable == "yes" && !spouseWorth) {
      isError = true;
      errorObj = { ...errorObj, worthErr: true };
    }
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

      const { data } = await axios.post(
        "/api/client/category/spousal/createSpousal",
        {
          caseId: caseId,
          ...values,
          spouseHealth,
          spouseRetired,
          spouseRetirePayment: spouseRetired == "no" ? spouseRetirePayment : "",
          spouseValuable,
          spouseWorth: spouseValuable == "yes" ? spouseWorth : "",
          progress: 50,
          nextProgress: 50,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");
      router.push(`/client/spousal-support?${searchParam.toString()}`);
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
        "/api/client/category/spousal/createSpousal",
        {
          caseId: caseId,
          progress: 30,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");
      router.push(`/client/spousal-support?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      spouseAge: data?.spouseAge?.toString(),
      spouseIncome: data?.spouseIncome?.toString(),
      spouseAssets: data?.spouseAssets?.toString(),
      spouseShare: data?.spouseShare?.toString(),
    });

    setValue(data?.spouseHealth ?? " ");
    setRetited(data?.spouseRetired ?? " ");
    setPayment(data?.spouseRetirePayment?.toString() ?? " ");
    setSpouse(data?.spouseValuable ?? " ");
    setWorth(data?.spouseWorth?.toString() ?? " ");
  }, [data]);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 pb-4 gray">
        Tell Us About Your Spouse&apos;s Financial Situation
      </h3>
      <h3 className="f-17 mt-2 pb-3">
        To obtain a complete and fair picture, we need to know your
        spouse&apos;s age, health, and income. This information is essential to
        assess their ability to provide spousal support.
      </h3>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <h3 className="f-18 bold">Your Spouse&apos;s Health</h3>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative mb-0">
                  How old is your spouse?
                </label>
                <span className="f-14 d-block mb-3">
                  (If you don&apos;t know, please provide your best estimate.)
                </span>
                <InputField
                  type="number"
                  error={formState.errors["spouseAge"]}
                  label="Age"
                  name="spouseAge"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  How would you describe your spouse&apos;s current health?
                </label>
                <p> (If you don&apos;t know, please provide an estimate.)</p>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={spouseHealth}
                    onChange={handleChange}
                  >
                    {/* <FormControlLabel
                    className="radio-light-ip"
                    value="estimate"
                    control={<Radio />}
                    label="(If you don't know, please provide an estimate.)"
                  /> */}
                    <FormControlLabel
                      className="radio-light-ip"
                      value="excellent health"
                      control={<Radio />}
                      label="Excellent health"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Able to work"
                      control={<Radio />}
                      label="Able to work part-time (high, medium, low capacity)"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="unable to work"
                      control={<Radio />}
                      label="Unable to work"
                    />
                  </RadioGroup>
                  {errors.healthErr && (
                    <span className="text-danger">
                      Please describe your spouse current health
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
          </div>
          <h3 className="f-18 bold">Your Spouse&apos;s Income</h3>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What&apos;s your spouse&apos;s yearly income (not including
                  child support or alimony, in euros)?
                </label>
                <span className="f-14 d-block mb-3">
                  (Examples: Salary, wages, tips, self-employment income, any
                  other money they earn. If you don&apos;t know the exact
                  amount, please provide your best estimate of their income
                  range.)
                </span>
                <InputField
                  type="number"
                  error={formState.errors["spouseIncome"]}
                  label="Yearly Income (In Euros)"
                  name="spouseIncome"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Is your spouse retired?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Indicate the amount you would receive each month if you were
                    to retire at full rate. If you are already retired, leave
                    this blank.
                  </span>
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={spouseRetired}
                    onChange={handleRetire}
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
                    {/* <FormControlLabel
                      className="radio-light-ip"
                      value="retirement Payment"
                      control={<Radio />}
                      label="If no, what would your estimated monthly retirement payments be (if you were to retire now, in euros)?"
                    /> */}
                  </RadioGroup>
                  {errors.retireErr && (
                    <span className="text-danger">
                      Please select, if your spouse retired
                    </span>
                  )}
                </FormControl>
              </div>
              <div className="lease-input mb-4">
                {spouseRetired == "no" && (
                  <>
                    <label className="tooltip-title relative">
                      What would his estimated monthly retirement payments be
                      (if he retired now, in euros)?
                      <Image className="bubble" src={bubble} alt="" />
                      <span className="hover-tip">
                        If you don&apos;t know the exact amount, please provide your
                        best estimate.
                      </span>
                    </label>

                    <TextField
                      fullWidth
                      type="number"
                      id="filled-basic"
                      label="Worth"
                      sx={{ width: 500 }}
                      variant="filled"
                      value={spouseRetirePayment}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setPayment(event.target.value);
                        setErrors((prev) => {
                          let newErrorObj = { ...prev };
                          newErrorObj.payErr = false;
                          return newErrorObj;
                        });
                      }}
                    />
                    {errors.payErr && (
                      <div>
                        <span className="text-danger">
                          Please enter the monthly retirement payments
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
          <h3 className="f-18 bold">Your Spouse&apos;s Assets</h3>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What&apos;s the value of your spouse&apos;s personal assets
                  (acquired before marriage or inherited, in euros)?
                </label>
                <span className="f-14 d-block mb-3">
                  (Examples: Savings accounts in their name only, property they
                  inherited. If you don&apos;t know the exact amount, please
                  provide an estimate.)
                </span>
                <InputField
                  type="number"
                  error={formState.errors["spouseAssets"]}
                  label="Value of your spouse's personal  assets"
                  name="spouseAssets"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Does your spouse own anything valuable with other people (not
                  you)?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={spouseValuable}
                    onChange={spouseChange}
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
                    {/* <FormControlLabel
                      className="radio-light-ip"
                      value="worth"
                      control={<Radio />}
                      label="If yes, what's their share worth (in euros)?"
                    /> */}
                  </RadioGroup>
                  {errors.spouseErr && (
                    <span className="text-danger">
                      Please select, if your spouse own anything valuable
                    </span>
                  )}
                </FormControl>
              </div>
              <div className="lease-input mb-4">
                {spouseValuable == "yes" && (
                  <>
                    <label className="tooltip-title relative">
                      {`What's their share worth (in euros)?`}
                    </label>

                    <span className="f-14 d-block mb-3">
                      (If you do&apos;t know the exact amount, please provide
                      your best estimate.)
                    </span>
                    <TextField
                      fullWidth
                      type="number"
                      id="filled-basic"
                      label="Net worth in Euros"
                      sx={{ width: 500 }}
                      variant="filled"
                      value={spouseWorth}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setWorth(event.target.value);
                        setErrors((prev) => {
                          let newErrorObj = { ...prev };
                          newErrorObj.worthErr = false;
                          return newErrorObj;
                        });
                      }}
                    />
                    {errors.worthErr && (
                      <div>
                        <span className="text-danger">
                          Please enter your spouse worth
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  If you were to split everything up with your spouse, what
                  would their share be (in euros)?
                </label>
                <span className="f-14 d-block mb-3">
                  (If you do&apos;t know the exact amount, please provide your
                  best estimate.)
                </span>
                <InputField
                  type="number"
                  error={formState.errors["spouseShare"]}
                  label="Share in Euros"
                  name="spouseShare"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
          </div>
          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Button
                variant="contained"
                className="green-btn"
                size="lg"
                onClick={() => handlePrevious()}
              >
                Previous
              </Button>

              <Button
                type="submit"
                variant="contained"
                size="lg"
                className="green-btn"
                onClick={() => {
                  errHandle();
                }}
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

export default SpouseFinancialSituation;
