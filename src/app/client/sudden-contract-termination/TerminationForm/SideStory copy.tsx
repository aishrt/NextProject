"use client";

import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { NumberField } from "@/components/Form/NumberField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { Sudden } from "@/types/Sudden";

type FormValues = {
  months: number;
  other: string;
  amount: number;
  date: string;
};

const schema = z.object({
  // months: z.string().min(1, "Enter the number of months"),
  // amount: z.string().min(1, "Enter the  amount"),
  // date: z.string().min(1, "Date is required"),
});

const SideStory = ({data}:{data:Sudden|undefined}) => {
  const router = useRouter();
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);
  const [noticeMonths, setNoticeMonths] = React.useState("");
  const [monthsNumber, setMonths] = React.useState("");
  const [totalvalue, setTotal] = React.useState("");
  const [amount, setTotalAmount] = React.useState("");
  const [totalRevenueAmount, setRevenue] = React.useState("");
  const [financialInvestments, setFinancial] = React.useState("");
  const [describeFinancial, setDescribe] = React.useState("");
  const [totalRevenue, setTotalRevenue] = React.useState("");
  const [grossMargin, setGross] = React.useState("");
  const [grossMarginAmount, setGrossAmount] = React.useState("");
  const [businessRely, setRely] = React.useState("");
  const [officialDocuments, setDoc] = React.useState("");
  const [errors, setErrors] = useState<{ [key: string]: boolean }>({
    noticeErr: false,
    otherErr: false,
    totalErr: false,
    amountErr: false,
    financialErr: false,
    describeErr: false,
    totalRevenueErr: false,
    revenueErr: false,
    grossErr: false,
    grossAmtErr: false,
    relyErr: false,
    docErr: false,
  });

  const factorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "amount") {
      setTotalAmount("");
    }
    setTotal((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrObj = { ...prev };
      newErrObj.totalErr = false;
      return newErrObj;
    });
  };

  const handleFinancial = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "yes") {
      setDescribe("");
    }
    setFinancial((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrObj = { ...prev };
      newErrObj.financialErr = false;
      return newErrObj;
    });
  };

  const handleRevenue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== "amount") {
      setRevenue("");
    }
    setTotalRevenue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrObj = { ...prev };
      newErrObj.totalRevenueErr = false;
      return newErrObj;
    });
  };

  const grossChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setGross((event.target as HTMLInputElement).value);
    if (event.target.value !== "amount") setGrossAmount("");
    setErrors((prev) => {
      let newErrObj = { ...prev };
      newErrObj.grossErr = false;
      return newErrObj;
    });
  };

  const relyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRely((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrObj = { ...prev };
      newErrObj.relyErr = false;
      return newErrObj;
    });
  };

  const handleSupport = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoc((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrObj = { ...prev };
      newErrObj.docErr = false;
      return newErrObj;
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNoticeMonths((event.target as HTMLInputElement).value);
    if (event.target.value !== "numberMonth") {
      setMonths("");
    }
    setErrors((prev) => {
      let newErrObj = { ...prev };
      newErrObj.noticeErr = false;
      return newErrObj;
    });
  };

  const checkSideError = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (!noticeMonths) {
      isError = true;
      errorObj.noticeErr = true;
    }
    if (noticeMonths == "numberMonth" && !monthsNumber) {
      isError = true;
      errorObj.otherErr = true;
    }

    if (!totalvalue) {
      isError = true;
      errorObj.totalErr = true;
    }

    if (totalvalue == "amount" && !amount) {
      isError = true;
      errorObj.amountErr = true;
    }

    if (!financialInvestments) {
      isError = true;
      errorObj.financialErr = true;
    }

    if (financialInvestments == "yes" && !describeFinancial) {
      isError = true;
      errorObj.describeErr = true;
    }

    if (!totalRevenue) {
      isError = true;
      errorObj.totalRevenueErr = true;
    }

    if (totalRevenue == "amount" && !totalRevenueAmount) {
      isError = true;
      errorObj.revenueErr = true;
    }

    if (!grossMargin) {
      isError = true;
      errorObj.grossErr = true;
    }

    if (grossMargin == "amount" && !grossMarginAmount) {
      isError = true;
      errorObj.grossAmtErr = true;
    }

    if (!businessRely) {
      isError = true;
      errorObj.relyErr = true;
    }
    if (!officialDocuments) {
      isError = true;
      errorObj.docErr = true;
    }

    if (isError) {
      setErrors(errorObj);
    }

    return isError;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (checkSideError()) {
        return;
      }
      console.log({
        noticeMonths,
        monthsNumber,
        totalvalue,
        amount,
        financialInvestments,
        describeFinancial,
        totalRevenue,
        totalRevenueAmount,
        grossMargin,
        grossMarginAmount,
        businessRely,
        officialDocuments,
      });

      const payload = {
        caseId: caseId,
        noticeMonths,
        monthsNumber,
        totalvalue,
        amount,
        financialInvestments,
        describeFinancial,
        totalRevenue,
        totalRevenueAmount,
        grossMargin,
        grossMarginAmount,
        businessRely,
        officialDocuments,
        progress: 40,
      };

      const { data } = await axios.post(
        "/api/client/category/sudden/createSudden",
        payload
      );
      console.log(data);

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
    } finally {
      setLoading(false);
    }
    setLoading(true);
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/sudden/createSudden",
        {
          caseId: caseId,
          progress: 20,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
      router.push(
        `/client/sudden-contract-termination?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const regex = /^\d+(\.\d+)?$/;

  return (
    <div className="lease-form side-story">
      <h3 className="f-18 bold my-4 gray">Your Side of the Story</h3>
      <h4 className="f-16 my-4 gray">Now, we would like to hear your side of the story. Please provide details on the following points to help us understand the impact on your business.</h4>
      {loading ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  How much notice did you ask for after the contract ended?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={noticeMonths}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="numberMonth"
                      control={<Radio />}
                      label="Enter number of months"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="contractualNotice"
                      control={<Radio />}
                      label="Contractual notice"
                    />
                  </RadioGroup>

                  {errors.noticeErr && (
                    <span className="text-danger">This field is required</span>
                  )}
                </FormControl>
              </div>
              {noticeMonths == "numberMonth" && (
                <div className="mb-3 lease-input mt-4">
                  <label> Enter number of months</label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Enter number of months"
                    variant="filled"
                    value={monthsNumber}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setMonths(event.target.value);
                      setErrors((prev) => {
                        let newErrObj = { ...prev };
                        newErrObj.otherErr = false;
                        return newErrObj;
                      });
                    }}
                  />
                  {errors.otherErr && (
                    <div>
                      <span className="text-danger">
                        Please enter the number of months
                      </span>
                    </div>
                  )}

                  {!errors.otherErr &&
                    monthsNumber &&
                    !regex.test(monthsNumber) && (
                      <div>
                        <span className="text-danger">
                          Only digits are allowed
                        </span>
                      </div>
                    )}
                </div>
              )}
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  What was the total value of your business with them each year?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={totalvalue}
                    onChange={factorChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="amount"
                      control={<Radio />}
                      label=" Enter amount"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="dontKnow"
                      control={<Radio />}
                      label="I don't know the exact amount"
                    />
                  </RadioGroup>

                  {errors.totalErr && (
                    <span className="text-danger">
                      {" "}
                      Please chooose total value of your business
                    </span>
                  )}
                </FormControl>
              </div>
              {totalvalue == "amount" && (
                <div className="mb-3 lease-input mt-4">
                  <label> Enter amount</label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Enter amount"
                    variant="filled"
                    value={amount}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setTotalAmount(event.target.value);
                      setErrors((prev) => {
                        let newErrObj = { ...prev };
                        newErrObj.amountErr = false;
                        return newErrObj;
                      });
                    }}
                  />
                  {errors.amountErr && (
                    <div>
                      <span className="text-danger">
                        Please enter the amount
                      </span>
                    </div>
                  )}

                  {!errors.amountErr && amount && !regex.test(amount) && (
                    <div>
                      <span className="text-danger">
                        Only digits are allowed
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="col-12 col-md-12 mb-3">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Did you make any financial investments specifically for this
                  business relationship?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={financialInvestments}
                    onChange={handleFinancial}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="yes"
                      control={<Radio />}
                      label="Yes, describe them and their amount:"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="no"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>

                  {errors.financialErr && (
                    <span className="text-danger">
                      Please select the financial investments{" "}
                    </span>
                  )}
                </FormControl>
              </div>
              {financialInvestments == "yes" && (
                <div className="mb-3 lease-input mt-4">
                  <label> Enter amount</label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Enter amount"
                    variant="filled"
                    value={describeFinancial}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setDescribe(event.target.value);
                      setErrors((prev) => {
                        let newErrObj = { ...prev };
                        newErrObj.describeErr = false;
                        return newErrObj;
                      });
                    }}
                  />
                  {errors.describeErr && (
                    <div>
                      <span className="text-danger">
                        Please describe financial investments and their amount
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="col-12 col-md-12 mb-3">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  What was your total revenue for the 3 last years?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={totalRevenue}
                    onChange={handleRevenue}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="amount"
                      control={<Radio />}
                      label="Enter amount"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="lastYear"
                      control={<Radio />}
                      label="Last year amount x3"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="doNotKnow"
                      control={<Radio />}
                      label="I don't know the exact amount"
                    />
                  </RadioGroup>
                  {errors.totalRevenueErr && (
                    <span className="text-danger">
                      Please choose total revenue{" "}
                    </span>
                  )}
                </FormControl>
              </div>
              {totalRevenue == "amount" && (
                <div className="mb-3 lease-input mt-4">
                  <label> Enter amount</label>
                  {/* <NumberField
                  error={formState.errors["amount"]}
                  label="Enter amount"
                  name="amount"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                /> */}

                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Enter amount"
                    variant="filled"
                    value={totalRevenueAmount}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setRevenue(event.target.value);
                      setErrors((prev) => {
                        let newErrObj = { ...prev };
                        newErrObj.revenueErr = false;
                        return newErrObj;
                      });
                    }}
                  />
                  {errors.revenueErr && (
                    <div>
                      <span className="text-danger">
                        Please enter the total revenue amount
                      </span>
                    </div>
                  )}

                  {!errors.revenueErr &&
                    totalRevenueAmount &&
                    !regex.test(totalRevenueAmount) && (
                      <div>
                        <span className="text-danger">
                          Only digits are allowed
                        </span>
                      </div>
                    )}
                </div>
              )}
            </div>
            <div className="col-12 col-md-12 mb-3">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  What was your gross margin rate / variable cost margin rate?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={grossMargin}
                    onChange={grossChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="amount"
                      control={<Radio />}
                      label="Enter amount"
                    />

                    <FormControlLabel
                      className="radio-light-ip"
                      value="doNotKnow"
                      control={<Radio />}
                      label="I don't know the exact amount"
                    />
                  </RadioGroup>
                  {errors.grossErr && (
                    <span className="text-danger">
                      {" "}
                      Please enter the gross margin rate
                    </span>
                  )}{" "}
                </FormControl>
              </div>
              {grossMargin == "amount" && (
                <div className="mb-3 lease-input mt-4">
                  <label> Enter amount</label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Enter amount"
                    variant="filled"
                    value={grossMarginAmount}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setGrossAmount(event.target.value);
                      setErrors((prev) => {
                        let newErrObj = { ...prev };
                        newErrObj.grossAmtErr = false;
                        return newErrObj;
                      });
                    }}
                  />
                  {errors.grossAmtErr && (
                    <div>
                      <span className="text-danger">
                        Please enter the total revenue amount
                      </span>
                    </div>
                  )}

                  {!errors.grossAmtErr &&
                    grossMarginAmount &&
                    !regex.test(grossMarginAmount) && (
                      <div>
                        <span className="text-danger">
                          Only digits are allowed
                        </span>
                      </div>
                    )}
                </div>
              )}
            </div>
            <div className="col-12 col-md-12 mb-3">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  How much did your business rely on this relationship?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={businessRely}
                    onChange={relyChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="notmuch"
                      control={<Radio />}
                      label=" Not much"
                    />

                    <FormControlLabel
                      className="radio-light-ip"
                      value="somewhat"
                      control={<Radio />}
                      label="Somewhat"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="alot"
                      control={<Radio />}
                      label="A lot"
                    />
                  </RadioGroup>

                  {errors.relyErr && (
                    <span className="text-danger">
                      Please choose the business rely
                    </span>
                  )}
                </FormControl>
              </div>
            </div>

            <div className="col-12 col-md-12 mb-3">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Do you have any official documents from an accountant or
                  auditor to support your claim?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={officialDocuments}
                    onChange={handleSupport}
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

                  {errors.docErr && (
                    <span className="text-danger">
                      Please choose official documents
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
                className="green-border f-16"
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                type="submit"
                variant="primary"
                className="green-btn"
                size="lg"
                onClick={() => checkSideError()}
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

export default SideStory;
