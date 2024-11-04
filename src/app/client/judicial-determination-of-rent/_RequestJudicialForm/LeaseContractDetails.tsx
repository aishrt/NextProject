"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { NumberField } from "@/components/Form/NumberField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import bubble from "@/assets/info.png";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import DateField from "@/components/Form/DateField";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { InputField } from "@/components/Form/InputField";
import { Judicial } from "@/types/Judicial";

type FormValues = {
  contractDate: string;
  contractDuration: string;
  initialRent: string;
  lastRent: string;
};

const schema = z.object({
  contractDate: z
    .string({ required_error: "Please enter the initial contract date" })
    .min(1, "Please enter the initial contract date"),
  contractDuration: z
    .string({
      required_error: "Please enter the initial contract duration",
      invalid_type_error: "Please enter the initial contract duration",
    })
    .min(1, "Please enter the initial contract duration"),

  initialRent: z
    .string({
      required_error: "Please enter the initial rent",
      invalid_type_error: "Please enter the initial rent",
    })
    .min(1, "Please enter the initial rent amount"),

  lastRent: z
    .string({
      required_error: "Please enter the last rent",
      invalid_type_error: "Please enter the last rent",
    })
    .min(1, "Please enter the last rent amount"),
});

const LeaseContractDetails = ({
  data,
  hide,
}: {
  data: Judicial | undefined | null;
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

  const [errors, setErrors] = useState({
    silentErr: false,
    numberErr: false,
    dateErr: false,
    rentErr: false,
  });

  const [silentRenewal, setValue] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    if (event.target.value == "no") {
      setRenewalNumber("");
      setRenewalDate(null);
    }
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.silentErr = false;
      return newErrorObj;
    });
  };

  const [lastRentNature, setlastRent] = React.useState("");

  const handleRent = (event: React.ChangeEvent<HTMLInputElement>) => {
    setlastRent((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.rentErr = false;
      return newErrorObj;
    });
  };

  const [renewalNumber, setRenewalNumber] = useState("");

  const [renewalDate, setRenewalDate] = useState<Dayjs | null>(dayjs(""));

  const handleJob = (date: any) => {
    if (date) {
      setRenewalDate(date);
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.dateErr = false;
        return newErrorObj;
      });
    } else {
      setRenewalDate(null);
    }
  };

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!silentRenewal) {
      isError = true;
      errorObj = { ...errorObj, silentErr: true };
    }
    if (silentRenewal == "yes" && !renewalNumber) {
      isError = true;
      errorObj = { ...errorObj, numberErr: true };
    }
    if (
      silentRenewal == "yes" &&
      dayjs(renewalDate).format("YYYY/MM/DD") == "Invalid Date"
    ) {
      isError = true;
      errorObj = { ...errorObj, dateErr: true };
    }

    if (!lastRentNature) {
      isError = true;
      errorObj = { ...errorObj, rentErr: true };
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
      let payload = {};
      if (hide) {
        payload = {
          caseId: caseId,
          ...values,
          silentRenewal,
          renewalNumber: silentRenewal == "yes" ? renewalNumber : "",
          renewalDate:
            silentRenewal == "yes"
              ? dayjs(renewalDate).format("YYYY/MM/DD")
              : "",
          lastRentNature,
        };
      } else {
        payload = {
          caseId: caseId,
          ...values,
          silentRenewal,
          renewalNumber: silentRenewal == "yes" ? renewalNumber : "",
          renewalDate:
            silentRenewal == "yes"
              ? dayjs(renewalDate).format("YYYY/MM/DD")
              : "",
          lastRentNature,
          progress: 30,
          nextProgress: 30,
        };
      }

      const { data } = await axios.post(
        "/api/client/category/judicial/createJudicial",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "30");

        router.push(
          `/client/judicial-determination-of-rent?${searchParam.toString()}`
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

  const handleClear = () => {
    setValues({
      contractDate: "null",
      contractDuration: "",
      initialRent: "",
      lastRent: "",
    });

    setValue("");
    setRenewalNumber("");
    setRenewalDate(null);
    setlastRent("");
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/judicial/createJudicial",
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
        `/client/judicial-determination-of-rent?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      contractDate: data?.contractDate,
      contractDuration: data?.contractDuration?.toString(),
      initialRent: data?.initialRent?.toString(),
      lastRent: data?.lastRent?.toString(),
    });
    setValue(data?.silentRenewal ?? "");
    setRenewalNumber(data?.renewalNumber?.toString() ?? "");
    setRenewalDate(dayjs(data?.renewalDate));
    setlastRent(data?.lastRentNature ?? "");
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> Lease Contract Details</h6>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4 date-input">
              <div className="lease-input mb-2">
                <label>Initial Contract Effective Date</label>
                <DateField
                  error={formState.errors["contractDate"]}
                  label="Initial Contract Effective Date"
                  name="contractDate"
                  variant="filled"
                  disabled={hide}
                  className="bglight-ip p-2 rounded w-100"
                  control={control}
                  disableFuture={true}
                  // defaultValue={evictionData?.leaseInitialDate}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-2">
                <label className="tooltip-title relative">
                  Initial Contract Duration (Years)
                </label>
                <InputField
                  type="number"
                  error={formState.errors["contractDuration"]}
                  label=""
                  name="contractDuration"
                  variant="filled"
                  className="bglight-ip"
                  disabled={hide}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-2">
                <label className="tooltip-title relative">
                  Initial Annual Rent Amount (€)
                </label>
                <InputField
                  type="number"
                  disabled={hide}
                  error={formState.errors["initialRent"]}
                  label=""
                  name="initialRent"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-2">
                <label className="tooltip-title relative">
                  Last Updated Annual Rent Amount (€)
                </label>
                <InputField
                  disabled={hide}
                  type="number"
                  error={formState.errors["lastRent"]}
                  label=""
                  name="lastRent"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Silent Renewals?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={silentRenewal}
                    onChange={handleChange}
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
                      value="no"
                      disabled={hide}
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                  {errors.silentErr && (
                    <span className="text-danger">
                      Please select the silent renewals
                    </span>
                  )}
                </FormControl>
              </div>
              {silentRenewal == "yes" && (
                <>
                  <div className="lease-input mb-4 top-bottom-none">
                    <label className="tooltip-title relative">
                      Number of Renewals Before Dispute
                    </label>
                    <TextField
                      fullWidth
                      disabled={hide}
                      type="number"
                      id="filled-basic"
                      label="Number of Renewals Before Dispute"
                      variant="filled"
                      value={renewalNumber}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setRenewalNumber(event.target.value);
                        setErrors((prev) => {
                          let newErrorObj = { ...prev };
                          newErrorObj.numberErr = false;
                          return newErrorObj;
                        });
                      }}
                    />
                    {errors.numberErr && (
                      <div>
                        <span className="text-danger">
                          Please enter the renewals number before dispute
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="lease-input mb-4 date-input">
                    <label>Effective Date of Renewal Request/Offer</label>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DatePicker"]}>
                        <DatePicker
                          disabled={hide}
                          sx={{
                            width: "100%",
                          }}
                          className="w-100 rounded bglight-ip p-1"
                          value={renewalDate}
                          onChange={handleJob}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                    {errors.dateErr && (
                      <span className="text-danger">
                        Please enter the start date of the new job
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>

            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Nature of Last Updated Rent
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Judicial: Determined by a court. Conventional: Agreed upon
                    by both parties.
                  </span>
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={lastRentNature}
                    onChange={handleRent}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="judicial "
                      control={<Radio />}
                      disabled={hide}
                      label="Judicial "
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="conventional"
                      control={<Radio />}
                      label="Conventional"
                      disabled={hide}
                    />
                  </RadioGroup>
                  {errors.rentErr && (
                    <span className="text-danger">
                      Please select the nature of last rent
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
                className={`next-btn f-16 ${hide ? "d-none" : "block"}`}
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                type="submit"
                variant="contained"
                className={`client-btn submit-btn ${hide ? "d-none" : "block"}`}
                size="lg"
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

export default LeaseContractDetails;
