"use client";

import React from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import bubble from "@/assets/info.png";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Injury } from "@/types/Injury";

type FormValues = {
  hours: string;
  salary: string;
  netSalary: string;
  financialLosses: string;
  tableUsed: string;
  compensationDuration: string;
  otherCapitalization: string;
  years: string;
};

const options = [
  { label: "Various BCRIV", value: "Various" },
  { label: "Gazette du Palais", value: "Gazette" },
  { label: "Others", value: "others" },
];

const insurer = [
  { label: "Lifetime", value: "Lifetime" },
  { label: "Until Retirement", value: "Until Retirement" },
  { label: "Temporary", value: "Temporary" },
  { label: "Don't know", value: "Don't know" },
];

const EconomicSupportDamages = ({
  data,
  hide,
}: {
  data: Injury | undefined | null;
  hide: boolean;
}) => {
  const alldata = data;

  const router = useRouter();
  const searchParmas = useSearchParams();

  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const schema = (condition: any): z.ZodSchema => {
    return z.object({
      hours: z
        .string({
          required_error: "Please enter the no. of hours",
          invalid_type_error: "Please enter the no. of hours",
        })
        .min(1, "Please enter the no. of hours"),
      salary: z
        .string({
          required_error: "Please enter your monthly salary before accident",
          invalid_type_error:
            "Please enter your monthly salary before accident",
        })
        .min(1, "Please enter your monthly salary before accident"),
      netSalary: z
        .string({
          required_error: "Please enter your current monthly salary",
          invalid_type_error: "Please enter your current monthly salary",
        })
        .min(1, "Please enter your current monthly salary"),
      tableUsed:
        condition.capitalizationTable == "yes"
          ? z
              .string({
                required_error: "Please select capitalization table",
                invalid_type_error: "Please select capitalization table",
              })
              .min(1, "Please select capitalization table")
          : z.string().optional(),
      compensationDuration: z
        .string({ required_error: "Please select duration of compensation" })
        .min(1, "Please select duration of compensation"),
      otherCapitalization:
        condition.capitalization === "others"
          ? z
              .string({
                required_error: "Please specify other capitalization table",
              })
              .min(1, "Please specify other capitalization table")
          : z.string().optional(),

      financialLosses:
        condition.workAbility == "yes"
          ? z
              .string({ required_error: "Please enter the financial losses" })
              .min(1, "Please enter the financial losses")
          : z.string().optional(),
      years:
        condition.capitalizationTable == "yes" &&
        (condition.capitalization === "Various" ||
          condition.capitalization === "Gazette")
          ? z
              .string({
                required_error: "Please enter the years",
              })
              .min(1, "Please enter the years")
          : z.string().optional(),
    });
  };

  const [capitalization, setCapitalization] = React.useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = React.useState({
    workErr: false,
    capitlerr: false,
    victimerr: false,
    claimerr: false,
  });
  const checkError = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!workAbility) {
      isError = true;
      errorObj.workErr = true;
    }
    if (!capitalizationTable) {
      isError = true;
      errorObj.capitlerr = true;
    }
    if (!victims) {
      isError = true;
      errorObj.victimerr = true;
    }
    if (victims == "no" && !claimProposal) {
      isError = true;
      errorObj.claimerr = true;
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const [workAbility, setWork] = useState("");
  const handleWork = (event: React.ChangeEvent<HTMLInputElement>) => {
    setWork((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.workErr = false;
      return newErr;
    });
  };

  const [capitalizationTable, setCapital] = useState("");
  const handleCapital = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCapital((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.capitlerr = false;
      return newErr;
    });
  };
  const [victims, setVictim] = useState("");

  const handleVictim = (event: React.ChangeEvent<HTMLInputElement>) => {
    setVictim((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.victimerr = false;
      return newErr;
    });
  };

  const [claimProposal, setClaim] = useState("");

  const handleClaim = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClaim((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.claimerr = false;
      return newErr;
    });
  };
  const { methods, setValues } = useHookForm<FormValues>(
    schema({ capitalization, workAbility, capitalizationTable })
  );
  const { formState, control } = methods;

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (checkError()) {
        return;
      }

      let payload: any = {
        ...values,
        caseId: caseId,
        workAbility,
        financialLosses: workAbility == "yes" ? values.financialLosses : "",
        capitalizationTable,
        tableUsed: capitalizationTable == "yes" ? values.tableUsed : "",
        years:
          capitalizationTable == "yes" &&
          (capitalization === "Various" || capitalization === "Gazette")
            ? values.years
            : "",
        victims,
        claimProposal: victims == "no" ? claimProposal : "",
        otherCapitalization:
          values.tableUsed === "others" && capitalizationTable == "yes"
            ? values.otherCapitalization
            : "",
        // progress: victims == "yes" ? 80 : claimProposal == "yes" ? 90 : 100,
        // nextProgress: victims == "yes" ? 80 : claimProposal == "yes" ? 90 : 100,
      };

      console.log(payload);
      if (!hide) {
        payload = {
          ...payload,
          progress: victims == "yes" ? 80 : claimProposal == "yes" ? 90 : 100,
          nextProgress:
            victims == "yes" ? 80 : claimProposal == "yes" ? 90 : 100,
        };
      }
      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        payload
      );
      console.log(data, "response of accident api");

      let id = data?.data?.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set(
          "progress",
          victims == "yes" ? "80" : claimProposal == "yes" ? "90" : "100"
        );

        router.push(
          `/client/personal-injury-assessment-form?${searchParam.toString()}`
        );
      }
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        {
          caseId: caseId,
          progress: alldata?.isMedicalExamined === "yes" ? "60" : "40",
        }
      );
      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set(
        "progress",
        alldata?.isMedicalExamined === "yes" ? "60" : "40"
      );

      router.push(
        `/client/personal-injury-assessment-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      hours: data?.hours?.toString(),
      salary: data?.salary?.toString(),
      netSalary: data?.netSalary?.toString(),
      financialLosses: data?.financialLosses?.toString(),
      tableUsed: data?.tableUsed,
      compensationDuration: data?.compensationDuration,
      otherCapitalization: data?.otherCapitalization,
      years: data?.years,
    });

    setWork(data?.workAbility ?? "");
    setCapital(data?.capitalizationTable ?? "");
    setVictim(data?.victims ?? "");
    setClaim(data?.claimProposal ?? "");
  }, [data]);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold my-4 gray">Economic and Support Needs </h3>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-3">
              <label className="tooltip-title relative">
                How many hours per week do you require third-party assistance?
              </label>
              <InputField
                type="number"
                error={formState.errors["hours"]}
                label="No.of hours"
                name="hours"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-3">
              <label className="tooltip-title relative">
                What was your net monthly salary before the accident?
              </label>
              <InputField
                type="number"
                error={formState.errors["salary"]}
                label="Salary (in $)"
                name="salary"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-3">
              <label className="tooltip-title relative">
                What is your current net monthly salary ?
              </label>
              <InputField
                type="number"
                error={formState.errors["netSalary"]}
                label="Current salary (in $)"
                name="netSalary"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Has your injury affected your ability to work or your career
                prospects?
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={workAbility}
                  onChange={handleWork}
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
                {errors.workErr && (
                  <span className="text-danger">
                    Please select if the injury affected
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          {workAbility == "yes" && (
            <>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mb-3">
                  <label className="tooltip-title relative">
                    What financial losses have you experienced due to this
                    impact? <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Enter the amount of income, bonuses, promotions, or other
                      financial opportunities you have lost due to your injury.
                      If you don&apos;t know the exact amount, provide an
                      estimate.
                    </span>
                  </label>

                  <InputField
                    type="number"
                    error={formState.errors["financialLosses"]}
                    label="$"
                    name="financialLosses"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            </>
          )}

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Have you used a capitalization table to assess your financial
                losses and future needs?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Capitalization tables are used to estimate the present value
                  of future losses (such as lost income). Different tables use
                  different assumptions and interest rates.
                </span>
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={capitalizationTable}
                  onChange={handleCapital}
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
                {errors.capitlerr && (
                  <span className="text-danger">
                    Please select if the injury affected
                  </span>
                )}
              </FormControl>
            </div>
          </div>
          {capitalizationTable == "yes" && (
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input md-3">
                <label className="tooltip-title relative">
                  What capitalization tables have you used?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Capitalization tables are used to estimate the present value
                    of future losses (such as lost income). Different tables use
                    different assumptions and interest rates.
                  </span>
                </label>
                <SelectField
                  options={options}
                  name="tableUsed"
                  className="bglight-select"
                  error={formState.errors["tableUsed"]}
                  control={control}
                  emitChange={(val) => setCapitalization(val ?? "")}
                />
              </div>

              {(capitalization === "Various" ||
                capitalization === "Gazette") && (
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">Which year:</label>
                  <InputField
                    type="number"
                    error={formState.errors["years"]}
                    label="Year"
                    name="years"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              )}

              {capitalization === "others" && (
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    Other (Please Specify)
                  </label>
                  <InputField
                    error={formState.errors["otherCapitalization"]}
                    label="Others"
                    name="otherCapitalization"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              )}
            </div>
          )}

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input md-3">
              <label className="d-block">
                What duration of compensation do you request?
              </label>
              <SelectField
                options={insurer}
                name="compensationDuration"
                className="bglight-select"
                error={formState.errors["compensationDuration"]}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Are there any indirect victims of this accident?
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={victims}
                  onChange={handleVictim}
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
                {errors.victimerr && (
                  <span className="text-danger">
                    Please select if the injury affected
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          {victims == "no" && (
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Has the insurance company made a claim proposal?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={claimProposal}
                    onChange={handleClaim}
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
                  {errors.claimerr && (
                    <span className="text-danger">
                      Please select the claim proposal
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
          )}
        </div>

        {/* <div className="col-12 col-md-12 text-end">
          <Button
            type="submit"
            variant="primary"
            className="green-btn"
            size="lg"
            isLoading={loading}
          >
            <span className="f-16"> Next</span>
          </Button>
        </div> */}
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
              className={`green-btn injury-submit-btn ${
                hide ? "d-none" : "block"
              }`}
              size="lg"
              onClick={() => checkError()}
            >
              <span className="f-16"> Next</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default EconomicSupportDamages;
