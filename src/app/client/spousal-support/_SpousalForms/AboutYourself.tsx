"use client";

import React, { useEffect, useState } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
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
import { InputField } from "@/components/Form/InputField";
import { Spousal } from "@/types/Spousal";

type FormValues = {
  age: string;
  income: string;
  assets: string;
  share: string;
};

const schema = z.object({
  age: z
    .string({ required_error: "Please enter the age" })
    .min(1, "Please enter the age"),
  income: z
    .string({ required_error: "Please enter a yearly income" })
    .min(1, "Please enter a yearly income"),
  assets: z
    .string({ required_error: "Please enter your assets" })
    .min(1, "Please enter your assets"),
  share: z
    .string({ required_error: "Please enter the share" })
    .min(1, "Please enter the share"),
});

const AboutYourself = ({ data }: { data: Spousal | undefined }) => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "20");

  const { formState, control } = methods;

  const [health, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.healthErr = false;
      return newErrorObj;
    });
  };

  const [retirePayment, setPayment] = useState("");
  const [retired, setRetited] = React.useState("");
  const handleRetire = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRetited((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.retireErr = false;
      return newErrorObj;
    });
  };

  const [worth, setWorth] = useState("");
  const [valuable, setSpouse] = React.useState("");
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

    if (!health) {
      isError = true;
      errorObj = { ...errorObj, healthErr: true };
    }

    if (!retired) {
      isError = true;
      errorObj = { ...errorObj, retireErr: true };
    }

    if (retired == "no" && !retirePayment) {
      isError = true;
      errorObj = { ...errorObj, payErr: true };
    }

    if (!valuable) {
      isError = true;
      errorObj = { ...errorObj, spouseErr: true };
    }

    if (valuable == "yes" && !worth) {
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
          health,
          retired,
          retirePayment: retired == "no" ? retirePayment : " ",
          valuable,
          worth: valuable == "yes" ? worth : "",
          progress: 40,
          nextProgress: 40,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
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
          progress: 20,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
      router.push(`/client/spousal-support?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      age: data?.age?.toString(),
      income: data?.income?.toString(),
      assets: data?.assets?.toString(),
      share: data?.share?.toString(),
    });

    setValue(data?.health ?? "");
    setRetited(data?.retired ?? "");
    setPayment(data?.retirePayment?.toString() ?? "");
    setSpouse(data?.valuable ?? "");
    setWorth(data?.worth?.toString() ?? "");
  }, [data]);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 pb-4 gray">Tell Us About Yourself</h3>

      <h3 className="f-17 mt-2 pb-3">
        Your health, age, and current income play a crucial role in determining
        your financial needs after the divorce. By understanding your work
        capacity and sources of income, we can better assess the spousal support
        needed to maintain your standard of living. This step allows us to
        tailor our approach to your unique situation.
      </h3>
      {loading ? (
        <div className="text-center mt-5">
          {" "}
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <h3 className="f-18 bold">Your Health</h3>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  How old are you?
                </label>
                <InputField
                  type="number"
                  error={formState.errors["age"]}
                  label="Age"
                  name="age"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  How would you describe your current health?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={health}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Excellent health"
                      control={<Radio />}
                      label="Excellent health"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="High capacity"
                      control={<Radio />}
                      label="Able to work part-time (high capacity): You have some health limitations but are able to work part-time with minimal restrictions."
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Medium capacity"
                      control={<Radio />}
                      label="Able to work part-time (medium capacity): You have moderate health limitations and can work part-time, but with some restrictions."
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Low capacity"
                      control={<Radio />}
                      label="Able to work part-time (low capacity): You have significant health limitations and can work part-time, but with significant restrictions."
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Unable to work"
                      control={<Radio />}
                      label="Unable to work: You are unable to work due to health issues."
                    />
                  </RadioGroup>
                  {errors.healthErr && (
                    <span className="text-danger">
                      Please describe your current health
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
          </div>
          <h3 className="f-18 bold">Your Income</h3>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What&apos;s your yearly income (not including child support or
                  alimony, in euros)?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    (Tooltip: Include salary, wages, bonuses, tips, and any
                    other taxable income.)
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["income"]}
                  label="Yearly Income (In Euros)"
                  name="income"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Are you retired?
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
                    value={retired}
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
                      Please select, if you retired
                    </span>
                  )}
                </FormControl>
              </div>
              <div className="lease-input mb-4">
                {retired == "no" && (
                  <>
                    <label className="tooltip-title relative">
                      What would your estimated monthly retirement payments be
                      (if you were to retire now, in euros)?
                      <Image className="bubble" src={bubble} alt="" />
                      <span className="hover-tip">
                        Indicate the amount you would receive each month if you
                        were to retire at full rate. If you are already retired,
                        leave this blank.
                      </span>
                    </label>

                    <TextField
                      fullWidth
                      type="number"
                      id="filled-basic"
                      label="Worth"
                      sx={{ width: 500 }}
                      variant="filled"
                      value={retirePayment}
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
          <h3 className="f-18 bold">Your Assets</h3>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What&apos;s the value of your personal assets (acquired before
                  marriage or inherited, in euros)?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    This includes any assets you owned before the marriage or
                    acquired through inheritance or gifts during the marriage.
                    Examples: savings accounts in your name only, property you
                    inherited.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["assets"]}
                  label="Value of your personal assets"
                  name="assets"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Do you own anything valuable with other people (not your
                  spouse)?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={valuable}
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
                      label="If yes, what's your share worth (in euros)?"
                    /> */}
                  </RadioGroup>
                  {errors.spouseErr && (
                    <span className="text-danger">
                      Please select, if you own anything valuable
                    </span>
                  )}
                </FormControl>
              </div>
              <div className="lease-input mb-4">
                {valuable == "yes" && (
                  <>
                    <label className="tooltip-title relative">
                      What&apos;s your share worth (in euros)?
                    </label>
                    {/* <InputField type="number"
                error={formState.errors["worth"]}
                label="Net worth in Euros"
                name="worth"
                variant="filled"
                className="bglight-ip"
                control={control}
              /> */}

                    <TextField
                      fullWidth
                      type="number"
                      id="filled-basic"
                      label="Worth"
                      sx={{ width: 500 }}
                      variant="filled"
                      value={worth}
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
                          Please enter your worth
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
                  would your share be (in euros)?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Indicate the portion of the marital assets that you believe
                    you are entitled to upon division.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["share"]}
                  label="Share in Euros"
                  name="share"
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

export default AboutYourself;
