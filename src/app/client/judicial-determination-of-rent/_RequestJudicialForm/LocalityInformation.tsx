"use client";

import React from "react";
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
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { Judicial } from "@/types/Judicial";

type FormValues = {
  townSize: string;
  premisesLocation: string;
  premisesSituation: string;
  transportLinks: string;
  parkingSituation: string;
  quality: string;

  reputedBrands: string;
  competingBrands: string;
  advantages: string;
  otherAdvantages: string;
};

const options = [
  { label: "Under 10,000", value: "Under 10,000" },
  { label: "10,000-50,000", value: "10,000-50,000" },
  { label: "50,000-200,000", value: "50,000-200,000" },
  { label: "200,000-400,000 ", value: "200,000-400,000 " },
  { label: "Over 400,000", value: "Over 400,000" },
  { label: "Paris & Suburbs", value: "Paris & Suburbs" },
];
const location = [
  { label: "Downtown Retail", value: "Downtown Retail" },
  { label: "Mall & Transit", value: "Mall & Transit" },
  { label: "Outskirts  ", value: "Outskirts" },
  { label: "Rural ", value: "Rural" },
  { label: "Resort ", value: "Resort" },
  { label: "Market ", value: "Market" },
];
const premises = [
  { label: "Tertiary Artery ", value: "Tertiary Artery" },
  { label: "Secondary Artery ", value: "Secondary Artery" },
  { label: "Main Artery ", value: "Main Artery" },
];
const transport = [
  { label: "Poor", value: "Poor" },
  { label: "Medium ", value: "Medium" },
  { label: "Good", value: "Good" },
];
const parking = [
  { label: "None", value: "None" },
  { label: "Street Parking", value: "Street Parking" },
  { label: "Nearby Lot", value: "Nearby Lot" },
  { label: "Dedicated Parking", value: "Dedicated Parking" },
];
const quality = [
  { label: "Lower", value: "Lower" },
  { label: "Comparable", value: "Comparable" },
  { label: "Higher", value: "Higher" },
];
const compete_brands = [
  { label: "No", value: "No" },
  { label: "Yes", value: "yes" },
  { label: "Large Number", value: "Large Number" },
];
const brands = [
  { label: "None", value: "None" },
  { label: "A Few ", value: "A Few" },
  { label: "Several", value: "Several" },
  { label: "Exclusively ", value: "Exclusively" },
];
const miscellaneous = [
  { label: "None", value: "None" },
  { label: "Right to Display", value: "Right to Display" },
  { label: "Terrace", value: "Terrace" },
  { label: "Other (specify)", value: "other" },
];
const schema = z.object({
  townSize: z
    .string({
      required_error: "Town size is required",
      invalid_type_error: "Town Size is required",
    })
    .min(1, "Town Size is required"),
  premisesLocation: z
    .string({
      required_error: "Premises location is required",
      invalid_type_error: "Premises location is required",
    })
    .min(1, "Premises location is required"),
  premisesSituation: z
    .string({
      required_error: "Premises situation is required",
      invalid_type_error: "Premises situation is required",
    })
    .min(1, "Premises situation is required"),

  transportLinks: z
    .string({
      required_error: "Please select the transport link",
      invalid_type_error: "Please select the transport link",
    })
    .min(1, "Please select the transport link"),

  parkingSituation: z
    .string({
      required_error: "Please select the parking situation",
      invalid_type_error: "Please select the parking situation",
    })
    .min(1, "Please select the parking situation"),

  quality: z
    .string({
      required_error: "Please select the quality",
      invalid_type_error: "Please select the quality",
    })
    .min(1, "Please select the quality"),

  reputedBrands: z.string({ invalid_type_error: "" }).optional(),
  competingBrands: z.string({ invalid_type_error: "" }).optional(),
  advantages: z.string({ invalid_type_error: "" }).optional(),
  otherAdvantages: z.string({ invalid_type_error: "" }).optional(),
});

const LocalityInformation = ({
  data,
  hide
}: {
  data: Judicial | undefined | null;
  hide: boolean
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);
  const [advantages, setAdvantages] = useState<string>("");
  const [parkSituation, setParkSituation] = useState<string>("");

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const [pedestrianZone, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.zoneErr = false;
      return newErrorObj;
    });
  };
  const [interest, setInterest] = React.useState("");
  const interestChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInterest((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.nearErr = false;
      return newErrorObj;
    });
  };

  const [spacesNumber, setSpace] = React.useState("");

  const [errors, setErrors] = useState({
    zoneErr: false,
    spaceErr: false,
    nearErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!pedestrianZone) {
      isError = true;
      errorObj = { ...errorObj, zoneErr: true };
    }

    if (parkSituation == "Dedicated Parking" && !spacesNumber) {
      isError = true;
      errorObj = { ...errorObj, spaceErr: true };
    }

    if (!interest) {
      isError = true;
      errorObj = { ...errorObj, nearErr: true };
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

      let payload = {}
      if (hide) {
        payload = {
          caseId: caseId,
          ...values,
          pedestrianZone,
          spacesNumber:
            parkSituation == "Dedicated Parking" ? spacesNumber : "",
          interest
        }
      } else {
        payload = {
          caseId: caseId,
          ...values,
          pedestrianZone,
          spacesNumber:
            parkSituation == "Dedicated Parking" ? spacesNumber : "",
          interest,
          progress: 70,
          nextProgress: 70,
        }
      }

      const { data } = await axios.post("/api/client/category/judicial/createJudicial", payload);
      if (!hide) {
        let id = data.data.caseId;
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "70");
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

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/judicial/createJudicial",
        {
          caseId: caseId,
          progress: 50,
        }
      );
      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");
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
      townSize: data?.townSize,
      premisesLocation: data?.premisesLocation,
      premisesSituation: data?.premisesSituation,
      transportLinks: data?.transportLinks,
      parkingSituation: data?.parkingSituation,
      quality: data?.quality,
      reputedBrands: data?.reputedBrands,
      competingBrands: data?.competingBrands,
      advantages: data?.advantages,
      otherAdvantages: data?.otherAdvantages,
    });
    setValue(data?.pedestrianZone ?? "");
    setParkSituation(data?.parkingSituation ?? "");
    setInterest(data?.interest ?? " ");
    setAdvantages(data?.advantages ?? "");
    setSpace(data?.spacesNumber?.toString() ?? "");
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> Locality Information</h6>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Town Size</label>
                <SelectField
                  options={options}
                  disabled={hide}
                  label=""
                  name="townSize"
                  className="bglight-select"
                  error={formState.errors["townSize"]}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Premises Location</label>
                <SelectField
                disabled={hide}
                  options={location}
                  label=""
                  name="premisesLocation"
                  className="bglight-select"
                  error={formState.errors["premisesLocation"]}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Premises Situation</label>
                <SelectField
                  options={premises}
                  label=""
                  disabled={hide}
                  name="premisesSituation"
                  className="bglight-select"
                  error={formState.errors["premisesSituation"]}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Pedestrian Zone?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={pedestrianZone}
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
                      disabled={hide}
                      control={<Radio />}
                      label="No"
                    />
                    {errors.zoneErr && (
                      <span className="text-danger">
                        Please select the pedestrian zone
                      </span>
                    )}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Transport Links</label>
                <SelectField
                  options={transport}
                  label=""
                  name="transportLinks"
                  className="bglight-select"
                  disabled={hide}
                  error={formState.errors["transportLinks"]}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Parking Situation</label>
                <SelectField
                  options={parking}
                  label=""
                  name="parkingSituation"
                  className="bglight-select"
                  error={formState.errors["parkingSituation"]}
                  disabled={hide}
                  control={control}
                  emitChange={(val: any) => {
                    if (val !== "Dedicated Parking") {
                      setSpace("");
                    }
                    setParkSituation(val);
                  }}
                />
              </div>
              {parkSituation == "Dedicated Parking" && (
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">
                    Number of Spaces
                  </label>
                  <TextField
                    fullWidth
                    type="number"
                    id="filled-basic"
                    disabled={hide}
                    label="Number of Spaces"
                    variant="filled"
                    value={spacesNumber}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setSpace(event.target.value);

                      setErrors((prev) => {
                        let newErrorObj = { ...prev };
                        newErrorObj.spaceErr = false;
                        return newErrorObj;
                      });
                    }}
                  />
                  {errors.spaceErr && (
                    <div>
                      <span className="text-danger">
                        Please enter the spaces number
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Nearby Point of Interest?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Landmarks, parks, attractions, etc.
                  </span>
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={interest}
                    onChange={interestChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="yes"
                      control={<Radio />}
                      disabled={hide}
                      label="Yes"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      disabled={hide}
                      value="no"
                      control={<Radio />}
                      label="No"
                    />

                    {errors.nearErr && (
                      <span className="text-danger">
                        {" "}
                        Please select the nearby point of interest{" "}
                      </span>
                    )}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">
                  Quality Compared to Similar Premises
                </label>
                <SelectField
                  options={quality}
                  label=""
                  disabled={hide}
                  name="quality"
                  className="bglight-select"
                  error={formState.errors["quality"]}
                  control={control}
                />
              </div>
            </div>
          </div>
          <h3 className="f-18 fw-500 my-4 ">Additional Details (Optional)</h3>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Reputed Brands Nearby</label>
                <SelectField
                  options={brands}
                  label=""
                  disabled={hide}
                  name="reputedBrands"
                  className="bglight-select"
                  error={formState.errors["reputedBrands"]}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Competing Brands Nearby</label>
                <SelectField
                  options={compete_brands}
                  label=""
                  disabled={hide}
                  name="competingBrands"
                  className="bglight-select"
                  error={formState.errors["competingBrands"]}
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="d-block">Miscellaneous Advantages</label>
                <SelectField
                  options={miscellaneous}
                  label=""
                  disabled={hide}
                  name="advantages"
                  className="bglight-select"
                  error={formState.errors["advantages"]}
                  control={control}
                  emitChange={(val: any) => setAdvantages(val)}
                />
              </div>
              {advantages == "other" && (
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">Others</label>
                  <InputField
                    error={formState.errors["otherAdvantages"]}
                    disabled={hide}
                    label="others"
                    name="otherAdvantages"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
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
                className={`client-btn submit-btn ${hide ? "d-none" : "block"}`}
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

export default LocalityInformation;
