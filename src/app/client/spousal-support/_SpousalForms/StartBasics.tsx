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
import { NumberField } from "@/components/Form/NumberField";
import bubble from "@/assets/info.png";
import Image from "next/image";
import axios from "axios";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { Spousal } from "@/types/Spousal";

type FormValues = {
  years: number;
  totalValue: number;
};

const schema = z.object({
  years: z
    .number({ required_error: "Please enter the number of years" })
    .min(1, "Please enter the number of years"),

  totalValue: z
    .number({ required_error: "Please enter the total value" })
    .min(1, "Please enter the total value"),
});

const StartBasics = ({ data }: { data: Spousal | undefined }) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "10");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { formState, control } = methods;

  const [describe, setDescribe] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescribe((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.describeErr = false;
      return newErrorObj;
    });
  };

  const [ownWorth, setOwnWorth] = useState("");
  const [ownAnything, setOwn] = React.useState("");
  const handleOwnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOwn((event.target as HTMLInputElement).value);

    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.ownErr = false;
      return newErrorObj;
    });
  };

  const [currentWorth, setWorth] = useState("");

  const [curentlyPaying, setPaying] = React.useState("");
  const payingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPaying((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.payErr = false;
      return newErrorObj;
    });
  };

  const [errors, setErrors] = useState({
    describeErr: false,
    ownErr: false,
    payErr: false,
    otherErr: false,
    worthErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!describe) {
      isError = true;
      errorObj = { ...errorObj, describeErr: true };
    }
    if (!ownAnything) {
      isError = true;
      errorObj = { ...errorObj, ownErr: true };
    }
    if (!curentlyPaying) {
      isError = true;
      errorObj = { ...errorObj, payErr: true };
    }
    if (ownAnything == "yes" && !ownWorth) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }

    if (curentlyPaying == "yes" && !currentWorth) {
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
          describe,
          ownAnything,
          curentlyPaying,
          ownWorth: ownAnything == "yes" ? ownWorth : "",
          currentWorth: curentlyPaying == "yes" ? currentWorth : " ",
          progress: 30,
          nextProgress: 30,
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
          progress: 10,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "10");
      router.push(`/client/spousal-support?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      totalValue: data?.totalValue,
      years: data?.years,
    });

    setDescribe(data?.describe ?? "");
    setOwn(data?.ownAnything ?? "");
    setPaying(data?.curentlyPaying ?? "");
    setOwnWorth(data?.ownWorth?.toString() ?? "");
    setWorth(data?.currentWorth?.toString() ?? "");
  }, [data]);
  return (
    <div className="lease-form p-3">
      <h3 className="f-22 bold mt-4 pb-3 gray">
        Let&apos;s Start with the Basics
      </h3>

      <h3 className="f-17 mt-2 pb-3">
        It&apos;s essential to know the length of your marriage and the value of
        the assets you share with your spouse. This information helps us assess
        the scope of your relationship and identify the shared assets that
        influence spousal support. This is the first step to gaining a clear
        understanding of your financial situation.
      </h3>
      {loading ? (
        <div className="text-center mt-5">
          {" "}
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Which best describes you?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={describe}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="payee"
                      control={<Radio />}
                      label="I'm the one receiving support (payee)"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="payor"
                      control={<Radio />}
                      label="I'm the one providing support (payor)"
                    />
                  </RadioGroup>

                  {errors.describeErr && (
                    <span className="text-danger">
                      Please select, which best describe you.
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  How long were you married (in years)?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Enter the total number of years from your marriage date to
                    today. If you have been separated for a long time, use the
                    date of separation.
                  </span>
                </label>
                <NumberField
                  error={formState.errors["years"]}
                  label="Years"
                  name="years"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What&apos;s the total value of everything you and your spouse
                  own together (in euros)?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Include the value of your house, cars, savings accounts,
                    investments, retirement accounts, etc. If you don&apos;t
                    know the exact amount, provide an estimate.
                  </span>
                </label>
                <NumberField
                  error={formState.errors["totalValue"]}
                  label="Total value in Euros"
                  name="totalValue"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Do you own anything together that you got before you were
                  married? (like a house, car, or money)
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    This includes any property acquired before your marriage or
                    received as an inheritance or gift during the marriage.
                  </span>
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={ownAnything}
                    onChange={handleOwnChange}
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
                  {errors.ownErr && (
                    <span className="text-danger">
                      {" "}
                      Please select, if you own anything
                    </span>
                  )}
                </FormControl>
              </div>

              <div>
                {ownAnything == "yes" && (
                  <>
                    <label>What&apos;s it worth (in euros)?</label>
                    <TextField
                      fullWidth
                      type="number"
                      id="filled-basic"
                      label="Worth"
                      sx={{ width: 500 }}
                      variant="filled"
                      value={ownWorth}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setOwnWorth(event.target.value);
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
                          Please enter the worth
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Are either of you currently paying the other temporary support
                  while you&apos;re separated?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={curentlyPaying}
                    onChange={payingChange}
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
                  {errors.payErr && (
                    <span className="text-danger">
                      Please select, if you currently paying
                    </span>
                  )}
                </FormControl>
              </div>
              <div>
                {curentlyPaying == "yes" && (
                  <>
                    <label className="tooltip-title relative">
                      How much (in euros)?
                      <Image className="bubble" src={bubble} alt="" />
                      <span className="hover-tip">
                        Indicate the monthly amount of temporary support being
                        paid. If you don&apos;t know the exact amount, provide an
                        estimate.
                      </span>
                    </label>
                    <TextField
                      fullWidth
                      type="number"
                      id="filled-basic"
                      label="Worth"
                      sx={{ width: 500 }}
                      variant="filled"
                      value={currentWorth}
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
                          Please enter the worth
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Button
                onClick={() => handlePrevious()}
                variant="contained"
                className="green-btn"
                size="lg"
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

export default StartBasics;
