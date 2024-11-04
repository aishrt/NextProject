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
import { InputField } from "@/components/Form/InputField";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import TextField from "@mui/material/TextField";

type FormValues = {
  overtimePay: string;
};

const schema = z.object({
  overtimePay: z
    .string({
      required_error:
        "Please enter the total amount of overtime pay requested and specify if it`s net or gross",
    })
    .min(
      1,
      "Please enter the total amount of overtime pay requested and specify if it's net or gross"
    ),
});

const ClaimDetails = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { formState, control } = methods;

  const [claimReason, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.claimErr = false;
      return newObj;
    });
  };
  const [agreement, setAgreement] = React.useState("");
  const agreementChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAgreement((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.agreementErr = false;
      return newObj;
    });
  };
  const [procedureType, setProcedure] = React.useState("");
  const procedureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProcedure((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.typeErr = false;
      return newObj;
    });
  };

  const [amountType, setAmount] = useState("");
  const handleAmount = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAmount((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.amountErr = false;
      return newObj;
    });
  };
  const [otherUnpaid, setUnpaid] = React.useState("");

  const [otherReason, setOther] = React.useState("");
  const [otherProcedureType, setOtherType] = React.useState("");

  const [errors, setErrors] = useState({
    claimErr: false,
    unpaidErr: false,
    otherErr: false,
    agreementErr: false,
    typeErr: false,
    otherTypeErr: false,
    amountErr: false,
  });
  const errHandle = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (!claimReason) {
      isError = true;
      errorObj.claimErr = true;
    }

    if (claimReason == "unpaid" && !otherUnpaid) {
      isError = true;
      errorObj.unpaidErr = true;
    }

    if (claimReason == "other" && !otherReason) {
      isError = true;
      errorObj.otherErr = true;
    }

    if (!agreement) {
      isError = true;
      errorObj.agreementErr = true;
    }
    if (agreement == "yes" && !procedureType) {
      isError = true;
      errorObj.typeErr = true;
    }
    if (agreement == "yes" && procedureType == "other" && !otherProcedureType) {
      isError = true;
      errorObj.otherTypeErr = true;
    }
    if (!amountType) {
      isError = true;
      errorObj.amountErr = true;
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [action, setAction] = useState("");

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }
      const payload = {
        caseId: caseId,
        claimReason,
        ...values,
        otherUnpaid,
        otherReason,
        agreement,
        amountType,
        procedureType,
        otherProcedureType,
        progress: 40,
      };

      console.log(payload, "payload of api");

      const { data } = await axios.post(
        "/api/client/category/overtime/createOvertime",
        payload
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");

      if (action == "next") {
        router.push(
          `/client/overtime-pay-claim-form?${searchParam.toString()}`
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

  const handleReset = () => {
    setValues({ overtimePay: "" });
    setValue("");
    setUnpaid("");
    setOther("");
    setAgreement(""), setProcedure("");
    setOtherType("");
    setAmount("");
  };
  const [data, setOvertimeData] = useState<any>({});

  useEffect(() => {
    const getCaseById = async () => {
      try {
        setLoading(true);
        if (caseId) {
          const { data } = await axios.get(
            `/api/client/category/overtime/getOvertime?caseId=${caseId}`
          );
          setOvertimeData(data.data);
          console.log(data.data);

          if (data.data) {
            // setIndividual(data.data.isIndividual);
          }
        }
        setLoading(false);
      } catch (error) {
        console.log("err", error);
        setLoading(false);
      }
    };
    getCaseById();
  }, [caseId]);
  return (
    <div className="lease-form white-card p-4 rounded mt-4">
      <h3 className="f-22 bold mt-4 pb-3 gray">Step 2/6: Claim Details</h3>
      <p className="f-14 gray">
        {data.role == "Employee"
          ? "Please provide details about the overtime claim:"
          : "Please provide details about the overtime claim filed by your employee:"}
      </p>

      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Reason for Claim
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={claimReason}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Not paid for all hours worked"
                      control={<Radio />}
                      label="Not paid for all hours worked (e.g., missed breaks, working through lunch)"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Misclassified as exempt from overtime"
                      control={<Radio />}
                      label="Misclassified as exempt from overtime (e.g., job duties do not meet the exemption criteria)"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Required to be on-call without adequate compensation"
                      control={<Radio />}
                      label="Required to be on-call without adequate compensation"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Expected to work before or after scheduled shift without pay"
                      control={<Radio />}
                      label="Expected to work before or after scheduled shift without pay"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="unpaid"
                      control={<Radio />}
                      label="Unpaid overtime due to... (please specify)"
                    />

                    {claimReason == "unpaid" && (
                      <div className="lease-input mb-4">
                        <label className="tooltip-title relative">
                          Unpaid Overtime
                        </label>

                        <TextField
                          fullWidth
                          id="filled-basic"
                          label="Unpaid Overtime"
                          variant="filled"
                          value={otherUnpaid}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setUnpaid(event.target.value);
                            setErrors((prev) => {
                              let newObj = { ...prev };
                              newObj.unpaidErr = false;
                              return newObj;
                            });
                          }}
                        />
                        {errors.unpaidErr && (
                          <span className="text-danger f-14">
                            Please specify the unpaid overtime
                          </span>
                        )}
                      </div>
                    )}
                    <FormControlLabel
                      className="radio-light-ip"
                      value="other"
                      control={<Radio />}
                      label="Other (please specify below)"
                    />

                    {claimReason == "other" && (
                      <div className="lease-input mb-4">
                        <label className="tooltip-title relative">Other</label>
                        <TextField
                          fullWidth
                          id="filled-basic"
                          label="Other"
                          variant="filled"
                          value={otherReason}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setOther(event.target.value);
                            setErrors((prev) => {
                              let newObj = { ...prev };
                              newObj.otherErr = false;
                              return newObj;
                            });
                          }}
                        />

                        {errors.otherErr && (
                          <span className="text-danger f-14">
                            Please specify the other statement
                          </span>
                        )}
                      </div>
                    )}
                  </RadioGroup>
                  {errors.claimErr && (
                    <span className="text-danger f-14">
                      Please select a reason for your claim
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
          </div>
          <h3 className="f-18 bold">What is overtime?</h3>
          <p className="f-14">
            Overtime is work performed beyond the legally established standard
            working hours, typically exceeding 40 hours per week. Specific
            regulations vary depending on your location and employment contract.
          </p>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Is there an existing collective agreement or procedure in
                  place?
                </label>

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={agreement}
                    onChange={agreementChange}
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
                      value="I don't know"
                      control={<Radio />}
                      label="I don't know"
                    />
                  </RadioGroup>
                  {errors.agreementErr && (
                    <span className="text-danger f-14">
                      Please select an option
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            {agreement == "yes" && (
              <div className="col-12 col-md-12 mb-4">
                <div className="mb-3 radio-end-input">
                  <label className="tooltip-title relative">
                    Please specify the type of procedure
                  </label>

                  <FormControl className="w-100">
                    <RadioGroup
                      className="w-100"
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={procedureType}
                      onChange={procedureChange}
                    >
                      <FormControlLabel
                        className="radio-light-ip"
                        value="Amicable procedure"
                        control={<Radio />}
                        label="Amicable procedure"
                      />
                      <FormControlLabel
                        className="radio-light-ip"
                        value="Judicial liquidation"
                        control={<Radio />}
                        label="Judicial liquidation"
                      />
                      <FormControlLabel
                        className="radio-light-ip"
                        value="other"
                        control={<Radio />}
                        label="Other (please specify below)"
                      />

                      {procedureType == "other" && (
                        <div className="lease-input mb-4">
                          <label className="tooltip-title relative">
                            Other
                          </label>
                          <TextField
                            fullWidth
                            id="filled-basic"
                            label="Other"
                            variant="filled"
                            value={otherProcedureType}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setOtherType(event.target.value);
                              setErrors((prev) => {
                                let newObj = { ...prev };
                                newObj.otherTypeErr = false;
                                return newObj;
                              });
                            }}
                          />

                          {errors.otherTypeErr && (
                            <span className="text-danger f-14">
                              Please specify the other statement
                            </span>
                          )}
                        </div>
                      )}
                    </RadioGroup>
                    {errors.typeErr && (
                      <span className="text-danger f-14">
                        Please select an option
                      </span>
                    )}
                  </FormControl>
                </div>
              </div>
            )}
            <div className="col-12 col-md-6 mb-4">
              <h3 className="f-18 bold">Total Overtime Pay Amount Requested</h3>
              <div className="lease-input mb-4">
                <InputField
                  type="number"
                  error={formState.errors["overtimePay"]}
                  label="€0.00"
                  name="overtimePay"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>

            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                {/* <label className="tooltip-title relative">
                  Please specify the type of procedure
                </label> */}
                <label className="f-18 bold d-block relative">
                  Is this amount net or gross?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={amountType}
                    onChange={handleAmount}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="net"
                      control={<Radio />}
                      label="Net"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="gross"
                      control={<Radio />}
                      label="Gross"
                    />
                  </RadioGroup>
                  {errors.amountErr && (
                    <span className="text-danger f-14">Please specify</span>
                  )}
                </FormControl>
              </div>
            </div>

            <div className="col-12 text-center mt-4">
              <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
                <Button
                  type="submit"
                  variant="contained"
                  size="lg"
                  className="client-btn"
                  onClick={() => {
                    errHandle();
                    setAction("edit");
                  }}
                >
                  <span className="f-16">Edit Section</span>
                </Button>
                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  className="next-btn f-16"
                  onClick={() => {
                    errHandle();
                    setAction("next");
                  }}
                >
                  <span className="f-16">Next</span>
                </Button>
                <Button
                  variant="contained"
                  className="client-btn"
                  size="lg"
                  onClick={handleReset}
                >
                  Reset Form
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default ClaimDetails;
