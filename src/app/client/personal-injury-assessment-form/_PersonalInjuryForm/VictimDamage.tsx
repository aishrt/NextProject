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
import { Checkbox, FormGroup, Input } from "@mui/material";
import axios from "axios";
import { Injury } from "@/types/Injury";

type FormValues = {
  deficitRate: string;
  dfp: string;
  dftPercentage: string;
  dftdays: string;
  daysNumber: string;
  points: string;
  tempPoints: string;
  permantPoints: string;
};

// const conditionalSchema = (conditions: any): z.ZodSchema => {

const VictimDamage = ({
  data,
  hide,
}: {
  data: Injury | undefined | null;
  hide: boolean;
}) => {
  const router = useRouter();
  const searchParmas = useSearchParams();
  const [customDft, setCustomDft] = useState<number>();
  const [personalized, setPersonalized] = useState("");

  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");
  const [loading, setLoading] = useState(false);
  const [daysPercntage, setDaysPercntage] = React.useState("");
  const [psychological, setPsychologic] = React.useState("");

  const schema = (condition: any): z.ZodSchema => {
    return z.object({
      deficitRate: z
        .string({ required_error: "Deficit is required" })
        .min(1, "Deficit is required")
        .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed"),
      dfp:
        condition.psychological == "yes"
          ? z
              .string({
                required_error:
                  "Please enter, if you know the psychological component",
              })
              .min(1, "Please enter, if you know the psychological component")
              .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed")
          : z.string().optional(),
      daysNumber: condition.daysPercntage
        ? z
            .string({ required_error: "Please specify no. of days" })
            .min(1, "Please specify no. of days")
            .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed")
        : z.string().optional(),
      dftPercentage:
        condition.personalized == "yes"
          ? z
              .string({
                required_error: "Please enter the rate of personalized DFT",
              })
              .min(1, "Please enter the rate of personalized DFT")
          : z.string().optional(),
      dftdays:
        condition.personalized == "yes"
          ? z
              .string({ required_error: "Please specify days" })
              .min(1, "Please specify days")
              .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed")
          : z.string().optional(),
      points: z
        .string({
          required_error: "Select 0 if no rate has been assigned to you",
        })
        .min(1, "Select 0 if no rate has been assigned to you")
        .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed"),

      tempPoints: z
        .string({
          required_error: "Select 0 if no rate has been assigned to you",
        })
        .min(1, "Select 0 if no rate has been assigned to you")
        .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed"),

      permantPoints: z
        .string({
          required_error: "Select 0 if no rate has been assigned to you",
        })
        .min(1, "Select 0 if no rate has been assigned to you")
        .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed"),
    });
  };

  const { methods, setValues } = useHookForm<FormValues>(
    schema({ customDft, psychological, daysPercntage, personalized })
  );
  const { formState, control } = methods;

  const [errors, setErrors] = useState({
    psychologicErr: false,
    dayErr: false,
    personalizedErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!psychological) {
      isError = true;
      errorObj = { ...errorObj, psychologicErr: true };
    }
    if (!daysPercntage) {
      isError = true;
      errorObj = { ...errorObj, dayErr: true };
    }
    if (!personalized) {
      isError = true;
      errorObj = { ...errorObj, personalizedErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPsychologic((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.psychologicErr = false;
      return newErrorObj;
    });
  };

  const handleExperience = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDaysPercntage((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.dayErr = false;
      return newErrorObj;
    });
  };
  const handlePersonalized = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPersonalized((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.personalizedErr = false;
      return newErrorObj;
    });
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      let payload: any = {
        caseId: caseId,

        deficitRate: values.deficitRate,
        psychological,
        personalized,
        dfp: psychological == "yes" ? values.dfp : "",
        daysPercentage: daysPercntage,
        dftdays: personalized == "yes" ? values.dftdays : "",
        dftPercentage: personalized == "yes" ? values.dftPercentage : "",
        daysNumber: values.daysNumber,
        points: values.points,
        temporaryPoints: values.tempPoints,
        permanentPoints: values.permantPoints,
        // progress: 60,
        // nextProgress: 60,
      };
      if (!hide) {
        payload = { ...payload, progress: 60, nextProgress: 60 };
      }
      const response = await axios.post(
        "/api/client/category/injury/createInjury",
        payload
      );
      console.log(response, "response");

      let id = response?.data?.data?.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "60");

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
          progress: 40,
        }
      );
      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
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
      deficitRate: data?.deficitRate,
      dfp: data?.dfp?.toString(),
      daysNumber: data?.daysNumber,
      dftPercentage: data?.dftPercentage,
      dftdays: data?.dftdays,
      points: data?.points,
      tempPoints: data?.temporaryPoints,
      permantPoints: data?.permanentPoints,
    });
    setPsychologic(data?.psychological ?? "");
    setPersonalized(data?.personalized ?? "");
    setDaysPercntage(data?.daysPercentage ?? "");
  }, [data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold my-4 gray">
        {`Detailed Victim's Damage Assessment`}
      </h3>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-3">
              <label className="tooltip-title relative">
                What is your permanent functional deficit rate (DFP)?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  This is a percentage determined by a medical professional that
                  reflects the permanent impact of your injuries on your ability
                  to function.
                </span>
              </label>
              <InputField
                type="text"
                error={formState.errors["deficitRate"]}
                label="DFP in %"
                name="deficitRate"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-3">
              <label className="tooltip-title relative">
                Do you know the psychological component of your DFP?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  This is the percentage of your DFP that is attributed to
                  psychological or mental health impacts resulting from the
                  accident.
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={psychological}
                  onChange={handleChange}
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

                {errors.psychologicErr && (
                  <span className="text-danger">
                    Please select, if you know the psychological component
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          {psychological == "yes" && (
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mt-3">
                <label className="tooltip-title relative">
                  Do you know the psychological component of your DFP?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    This is the percentage of your DFP that is attributed to
                    psychological or mental health impacts resulting from the
                    accident.
                  </span>
                </label>

                <InputField
                  error={formState.errors["dfp"]}
                  type="text"
                  label="Psychological component in %"
                  name="dfp"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
          )}

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input mt-3">
              <label className="tooltip-title relative">
                How many days did you experience the following levels of
                temporary functional deficit (DFT)?
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={daysPercntage}
                  onChange={handleExperience}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="10"
                    control={<Radio />}
                    label="10%"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="25"
                    control={<Radio />}
                    label="25%"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="50"
                    control={<Radio />}
                    label="50%"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="75"
                    control={<Radio />}
                    label="75%"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="100"
                    control={<Radio />}
                    label="100% (Total Disability or Hospitalization)"
                  />
                </RadioGroup>

                {errors.dayErr && (
                  <span className="text-danger">
                    Please select, the experience level of DFT
                  </span>
                )}
              </FormControl>
            </div>
            {daysPercntage && (
              <div className="lease-input mb-3">
                <label className="tooltip-title relative">
                  The number of days for each level
                </label>
                <InputField
                  type="text"
                  error={formState.errors["daysNumber"]}
                  label="The number of days for each level"
                  name="daysNumber"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            )}
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-3">
              <label className="tooltip-title relative">
                Do you have a personalized DFT ?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  The personalized DFT percentage assesses the degree of bodily
                  and functional harm you suffered from an accident, customized
                  based on your personal situation to determine your
                  compensation.
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={personalized}
                  onChange={handlePersonalized}
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

                {errors.personalizedErr && (
                  <span className="text-danger">
                    Please select, if you have personalized DFT
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          {personalized == "yes" && (
            <>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mt-3">
                  <label className="tooltip-title relative">
                    What is the rate of your personalized DFT?
                  </label>
                  <InputField
                    error={formState.errors["dftPercentage"]}
                    label="% of the custom DFT"
                    name="dftPercentage"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mt-3">
                  <label className="tooltip-title relative">
                    Number of days with a personalized DFT?{" "}
                  </label>
                  <InputField
                    type="text"
                    error={formState.errors["dftdays"]}
                    label="number of days"
                    name="dftdays"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            </>
          )}

          <div className="col-12 col-md-12 mb-4">
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                How many points (in sevenths) were assigned to your endured
                suffering (Select 0 if no rate has been assigned to you)?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Enter the number of points (1 out of 7) assigned by a medical
                  professional to rate the severity of your pain and suffering
                  on a scale of 1/7th (minor) to 7/7th (severe)
                </span>
              </label>
              <InputField
                type="text"
                error={formState.errors["points"]}
                label="Endured suffering points "
                name="points"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-12 mb-4">
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                How many points (in sevenths) were assigned to your temporary
                aesthetic damage (Select 0 if no rate has been assigned to you)
                ?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Enter the number of points (1 out of 7) assigned by a medical
                  professional to rate the severity of the temporary impact of
                  your injuries on your appearance.
                </span>
              </label>
              <InputField
                type="text"
                error={formState.errors["tempPoints"]}
                label="Temporary aesthetic damage points "
                name="tempPoints"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>

          <div className="lease-input mt-4">
            <label className="tooltip-title relative">
              How many points (in sevenths) were assigned to your permanent
              aesthetic damage (Select 0 if no rate has been assigned to you)?
              <Image className="bubble" src={bubble} alt="" />
              <span className="hover-tip">
                Enter the number of points (1 out of 7) assigned by a medical
                professional to rate the severity of your permanent scarring or
                disfigurement.
              </span>
            </label>
            <InputField
              type="text"
              error={formState.errors["permantPoints"]}
              label="Temporary aesthetic damage points "
              name="permantPoints"
              variant="filled"
              className="bglight-ip"
              control={control}
            />
          </div>

          {/* <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-3">
              <label className="tooltip-title relative">
                Do you have a custom DFT percentage? If so, what is it?
              </label>
              <InputField
                type="number"
                error={formState.errors["dftPercentage"]}
                label="DFT %"
                name="dftPercentage"
                variant="filled"
                className="bglight-ip"
                control={control}
                emitChange={(val) => {
                  if (!val) setValues({ dftdays: "" });
                  setCustomDft(parseInt(val));
                }}
              />
            </div>

            {customDft && customDft > 0 ? (
              <div className="lease-input mt-4">
                <label className="tooltip-title relative">
                  How many days did you experience this custom DFT?
                </label>
                <InputField
                  type="number"
                  error={formState.errors["dftdays"]}
                  label="How many days did you experience this custom DFT?"
                  name="dftdays"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            ) : null}
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                How many points (in sevenths) were assigned to your endured
                suffering?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  This rating reflects the severity of your pain and suffering
                  on a scale of 1/7th (minor) to 7/7th (severe), as assessed by
                  a medical professional.
                </span>
              </label>
              <InputField
                type="number"
                error={formState.errors["points"]}
                label="How many points (in sevenths) were assigned to your endured suffering? "
                name="points"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                How many points (in sevenths) were assigned to your temporary
                aesthetic damage?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  This rating reflects the temporary impact of your injuries on
                  your appearance, on a scale of 1/7th (minor) to 7/7ths
                  (severe), as assessed by a medical professional.
                </span>
              </label>
              <InputField
                type="number"
                error={formState.errors["tempPoints"]}
                label="How many points (in sevenths) were assigned to your endured suffering? "
                name="tempPoints"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div> */}
        </div>

        <div className="col-12 text-center mt-4">
          <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
            <Button
              isLoading={loading}
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
              isLoading={loading}
              onClick={() => errHandle()}
            >
              <span className="f-16"> Next</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default VictimDamage;
