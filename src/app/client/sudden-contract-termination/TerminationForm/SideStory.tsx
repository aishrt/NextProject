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
import bubble from "@/assets/info.png";
import Image from "next/image";
import { Checkbox, FormGroup, Tooltip } from "@mui/material";
import SelectField from "@/components/Form/SelectField";
type FormValues = {
  concentration: string;
};

type Financial = {
  name: string;
  amount: string;
};

const schema = z.object({
  // concentration: z.string().min(1, "Please select the concentration"),
  concentration: z.string().optional(),
});

const SideStory = ({
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
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);
  const [monthsNumber, setMonths] = React.useState("");
  const [otherSituation, setOtherSituation] = React.useState("");
  const [financialDamage, setFinancial] = React.useState("");
  const [currentSituation, setSituation] = React.useState("");
  const [errors, setErrors] = useState({
    noticeErr: false,
    otherErr: false,
    totalErr: false,
    amountErr: false,
    financialErr: false,
    describeErr: false,
    currentErr: false,
    otherbusinessErr: false,
    grossErr: false,
    grossAmtErr: false,
    relyErr: false,
    docErr: false,
    partyErr: false,
  });

  const options = [
    {
      label: "Not much",
      value: "Not much",
    },

    { label: "Neutral", value: "Neutral" },

    {
      label: "A lot",
      value: "A lot",
    },
  ];

  const financialArr = [
    {
      label: "Turnover (sales you made for them)",
      value: "Turnover",
      tooltip:
        "Select this if you can provide records showing the volume of sales or business you conducted with the other party.",
    },
    {
      label: "Investments (special expenses related to their work)",
      value: "Investments",
      tooltip:
        "Select this if you made specific investments or incurred special expenses directly related to the business relationship with the other party.",
    },
    {
      label: "Last 3 years' turnover (sales, profit, etc.)",
      value: "Last 3 years' turnover",
      tooltip:
        "Select this if you can provide your financial records for the last three years, including sales and profits, or the last year's turnover multiplied by three.",
    },
    {
      label: "Gross margin rate (your usual profit percentage)",
      value: "Gross margin rate",
      tooltip:
        "Select this if you know and can provide your usual profit percentage (gross margin rate).",
    },
    {
      label: "Concentration (how much of your business relied on them)",
      value: "Concentration",
      tooltip:
        "Select this if you can show how much your business depended on the other party, whether it was a small part, a moderate part, or a large part of your business.",
    },
  ];

  const handleFinancial = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFinancial((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrObj = { ...prev };
      newErrObj.financialErr = false;
      return newErrObj;
    });
  };

  const handleSituation = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSituation((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrObj = { ...prev };
      newErrObj.currentErr = false;
      return newErrObj;
    });
  };
  const [value, setValue] = useState("");
  const [financial, setfinancial] = useState<Financial[]>([
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
    { name: "", amount: "" },
  ]);

  const handleChange = (index: number, label: string) => {
    let arr = Array.isArray(financial) ? [...financial] : [];
    arr[index].name = arr[index]?.name ? "" : label;
    arr[index].amount = arr[index]?.amount ? "" : "";
    setfinancial(arr);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.partyErr = false;
      return newErr;
    });
  };

  const checkSideError = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (!monthsNumber) {
      isError = true;
      errorObj.otherErr = true;
    }

    const checkErr = financial.every((val) => {
      let data = Object.values(val?.name);
      return data.every((value: any) => {
        return value === "" || value === null || value === undefined;
      });
    });

    if (checkErr) {
      isError = true;
      errorObj.partyErr = true;
    }

    if (!financialDamage) {
      isError = true;
      errorObj.financialErr = true;
    }

    if (!currentSituation) {
      isError = true;
      errorObj.currentErr = true;
    }

    if (currentSituation == "Other" && !otherSituation) {
      isError = true;
      errorObj.otherbusinessErr = true;
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

      let payload: any = {
        caseId: caseId,
        // noticeMonths,
        monthsNumber,
        financial,
        financialDamage,
        currentSituation,
        otherSituation: currentSituation == "Other" ? otherSituation : "",
        // totalvalue,
        //amount,
        // describeFinancial,
        // totalRevenue,
        // grossMargin,
        // grossMarginAmount,
        // businessRely,
        // officialDocuments,
        // progress: 40,
        // nextProgress: 40,
      };

      if (!hide) {
        payload = { ...payload, progress: 40, nextProgress: 40 };
      }
      const { data } = await axios.post(
        "/api/client/category/sudden/createSudden",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "40");

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

  const handleAmountChange = (index: number, value: string) => {
    let arr = Array.isArray(financial) ? [...financial] : [];
    arr[index].amount = value;
    setfinancial(arr);
  };

  useEffect(() => {
    data &&
      data?.financial?.map((item, index) => {
        item.name == "Concentration" &&
          setValues({
            concentration: data?.financial[index]?.amount ?? "",
          });
      });

    setMonths(data?.monthsNumber?.toString() ?? "");
    if (data && data.financial?.length > 0) {
      setfinancial(data?.financial ?? []);
    }
    // setfinancial(data?.financial ?? []);
    setFinancial(data?.financialDamage ?? "");
    setSituation(data?.currentSituation ?? "");
    setOtherSituation(data?.otherSituation ?? "");
  }, [data]);

  const regex = /^\d+(\.\d+)?$/;

  return (
    <div className="lease-form side-story  white-card p-4 mt-4 indivi-form rounded">
      <h3 className="f-26 fw-500 my-4">Your Side of the Story</h3>
      <h4 className="f-16 mb-4 ">
        Now, we would like to hear your side of the story. Please provide
        details on the following points to help us understand the impact on your
        business.
      </h4>
      {loading ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block fw-500 f-16">
                  What would have been a fair notice period in your opinion?{" "}
                </label>

                <div className="mb-3 lease-input mt-3">
                  <label className="tooltip-title relative">
                    Enter number of months
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Please specify the number of months of notice you are
                      requesting as compensation for the sudden termination of
                      the established commercial relationship, including any
                      notice period already provided.{" "}
                    </span>
                  </label>
                  <TextField
                    fullWidth
                    id="filled-basic"
                    label="Enter number of months"
                    variant="filled"
                    disabled={hide}
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
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Can you provide details about your financial interactions with
                  the other party?
                </label>

                <FormGroup>
                  {financialArr.map((i, index) => {
                    return (
                      <>
                        <Tooltip
                          key={index}
                          title={i.tooltip}
                          placement="bottom"
                          arrow
                        >
                          <FormControlLabel
                            disabled={hide}
                            key={index}
                            className="radio-light-ip"
                            value={i.value}
                            control={<Checkbox />}
                            label={i.label}
                            onChange={() => {
                              handleChange(index, i.value);
                            }}
                            checked={
                              financial.some((comp) => comp.name === i.value) ??
                              false
                            }
                          />
                        </Tooltip>

                        {financial[index]?.name == i.value && (
                          <>
                            <label className="tooltip-title relative">
                              Please specify:
                            </label>

                            {i.value == "Concentration" ? (
                              <SelectField
                                options={options}
                                label=""
                                name="concentration"
                                className="bglight-select"
                                disabled={hide}
                                error={formState.errors["concentration"]}
                                control={control}
                                emitChange={(val: any) => {
                                  setValue(val);
                                  handleAmountChange(index, val);
                                }}
                              />
                            ) : (
                              <TextField
                                type="number"
                                className="bglight-ip p-1 rounded"
                                sx={{ width: "100%" }}
                                placeholder={
                                  i.value == "Gross margin rate" ? "%" : "€"
                                }
                                disabled={hide}
                                value={financial[index]?.amount}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleAmountChange(index, event.target.value);
                                }}
                              />
                            )}
                          </>
                        )}
                      </>
                    );
                  })}
                </FormGroup>
                {errors.partyErr && (
                  <span className="text-danger">
                    Please choose, your financial interactions with the other
                    party
                  </span>
                )}
              </div>
            </div>
            <div className="col-12 col-md-12 mb-3">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Can your accountant provide proof of the financial damage this
                  has caused?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={financialDamage}
                    onChange={handleFinancial}
                  >
                    <Tooltip title="Select this if you have a certificate or documentation from an accountant or auditor that supports your claim of financial damage">
                      <FormControlLabel
                        className="radio-light-ip"
                        value="yes"
                        control={<Radio />}
                        label="Yes"
                        disabled={hide}
                      />
                    </Tooltip>

                    <Tooltip title="Select this if you do not have such a certificate or documentation.">
                      <FormControlLabel
                        className="radio-light-ip"
                        disabled={hide}
                        value="no"
                        control={<Radio />}
                        label="No"
                      />
                    </Tooltip>
                  </RadioGroup>

                  {errors.financialErr && (
                    <span className="text-danger">
                      Please select if your accountant provide proof of the
                      financial damage
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-12 mb-3">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  What is your current business situation?{" "}
                </label>
                <p>Select one and describe in more detail if needed.</p>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={currentSituation}
                    onChange={handleSituation}
                  >
                    <Tooltip title="Select this if you have found a new business partner since the termination of the previous relationship.">
                      <FormControlLabel
                        className="radio-light-ip"
                        disabled={hide}
                        value="partner"
                        control={<Radio />}
                        label="New partner found"
                      />
                    </Tooltip>
                    <Tooltip title="Select this if you have reoriented or changed the focus of your business after the termination.">
                      <FormControlLabel
                        className="radio-light-ip"
                        value="reorientation"
                        control={<Radio />}
                        disabled={hide}
                        label="Business reorientation"
                      />
                    </Tooltip>

                    <Tooltip title="Select this if you are still actively looking for new business opportunities or partners.">
                      <FormControlLabel
                        className="radio-light-ip"
                        value="options"
                        disabled={hide}
                        control={<Radio />}
                        label="Searching for options"
                      />
                    </Tooltip>

                    <FormControlLabel
                      className="radio-light-ip"
                      value="Other"
                      disabled={hide}
                      control={<Radio />}
                      label="Other"
                    />
                  </RadioGroup>
                  {errors.currentErr && (
                    <span className="text-danger">
                      Please choose total revenue{" "}
                    </span>
                  )}
                </FormControl>
              </div>
              {currentSituation == "Other" && (
                <div className="mb-3 lease-input mt-4">
                  <label className="tooltip-title relative">
                    Please specify:{" "}
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      If none of the above options fit your current situation,
                      please describe your situation here.
                    </span>
                  </label>

                  <TextField
                    fullWidth
                    id="filled-basic"
                    label=""
                    disabled={hide}
                    variant="filled"
                    value={otherSituation}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setOtherSituation(event.target.value);
                      setErrors((prev) => {
                        let newErrObj = { ...prev };
                        newErrObj.otherbusinessErr = false;
                        return newErrObj;
                      });
                    }}
                  />
                  {errors.otherbusinessErr && (
                    <div>
                      <span className="text-danger">Please specify</span>
                    </div>
                  )}
                </div>
              )}
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
                className={`client-btn sudden-submit-btn
                ${hide ? "d-none" : "block"}`}
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
