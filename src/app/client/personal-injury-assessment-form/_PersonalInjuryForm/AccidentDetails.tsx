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
import { axios } from "@/utils/axios";
import { Injury } from "@/types/Injury";
import { MaterialSelectField } from "@/components/Form/MaterialSelectField";
import { Country } from "country-state-city";

type FormValues = {
  accident_place: string;
  abroad: string;
  other_place: string;
  situation: string;
  accident_type: string;
  nature: string;
  other_nature: string;
  statusAcc: string;
  dependent: string;
  legal: string;
  faultPercentage: string;
  otherFault: string;
  currentCondition: string;
  otherCondition: string;
  deceased: string;
  otherDeceased: string;
};

const options = [
  { label: "France", value: "France" },
  { label: "Abroad", value: "Abroad" },
];
const situation = [
  { label: "Home", value: "Home" },
  { label: "Residence", value: "Residence" },
];
const nature = [
  { label: "Traffic", value: "Traffic" },
  { label: "Work (public/private)", value: "Work" },
  { label: "Medical", value: "Medical" },
  { label: "Other", value: "others" },
  { label: "Victim of Crime", value: "Victim of Crime" },
];
const statusAcc = [
  {
    label: "Very Wealthy (> $5000/month)",
    value: "Very Wealthy",
  },
  {
    label: "Wealthy ($2500-$5000/month)",
    value: "Wealthy",
  },
  {
    label: "Average ($1301-$2499/month)",
    value: "Average",
  },
  {
    label: "Minimum Wage ($1000-$1300/month)",
    value: "Minimum Wage",
  },
  {
    label: "Disadvantaged (< $1000/month)",
    value: "Disadvantaged",
  },
];
const legal = [
  { label: "No Legal Protection", value: "No Legal Protection" },
  { label: "Family Protection", value: "Family Protection" },
  {
    label: "State Protection",
    value: "State Protection",
  },
];

const faultPercentage = [
  {
    label: "100%: The other party was entirely at fault",
    value: "100%: The other party was entirely at fault",
  },
  {
    label: "75%: The other party was mostly at fault",
    value: "75%: The other party was mostly at fault",
  },
  {
    label: "50%: Both parties were equally at fault",
    value: "50%: Both parties were equally at fault",
  },
  {
    label: "25%: You were mostly at fault",
    value: "25%: You were mostly at fault",
  },
  { label: "Other", value: "Other" },
];

const conditionArr = [
  { label: "Injured", value: "Injured" },
  { label: "Deceased", value: "Deceased" },
  {
    label: "Other",
    value: "Other",
  },
];

const deceasedArr = [
  {
    label: "Parent",
    value: "parent",
  },
  {
    label: "Child",
    value: "child",
  },

  {
    label: "Spouse/Partner",
    value: "spouse",
  },
  {
    label: "Sibling",
    value: "sibling",
  },

  {
    label: "Grandparent",
    value: "grandparent",
  },

  {
    label: "Grandchild",
    value: "grandchild",
  },

  {
    label: "Legal Guardian",
    value: "legalGuardian",
  },

  {
    label: "Other Family Member (e.g., aunt, uncle, cousin)",
    value: "otherFamilyMember",
  },

  {
    label: "Professional Caregiver",
    value: "professionalCaregiver",
  },

  {
    label: "Other",
    value: "other",
  },
];
const conditionalSchema = (conditions: any): z.ZodSchema => {
  return z.object({
    accident_place: z
      .string({
        required_error: "Accident place is required",
        invalid_type_error: "Accident place is required",
      })
      .min(1, "Accident place is required"),
    abroad:
      conditions.accidentLoc === "Abroad"
        ? z
            .string({
              required_error:
                "Please select the country where the accident occurred",
            })
            .min(1, "Please select the country where the accident occurred")
        : z.string().optional(),
    // situation: z
    //   .string({
    //     required_error: "Situation is required",
    //     invalid_type_error: "Situation is required",
    //   })
    //   .min(1, "Situation is required"),
    // accident_type:
    //   conditions.livingSituation === "Residence"
    //     ? z
    //         .string({ required_error: "Please specify the type of residence" })
    //         .min(1, "Please specify the type of residence")
    //     : z.string().optional(),
    // nature: z
    //   .string({
    //     required_error: "Nature is required",
    //     invalid_type_error: "Nature is required",
    //   })
    //   .min(1, "Nature is required"),
    // other_nature:
    //   conditions.natureOfAccident === "others"
    //     ? z
    //         .string({
    //           required_error: "Please specify other nature of accident",
    //         })
    //         .min(1, "Please specify other nature of accident")
    //     : z.string().optional(),
    // statusAcc: z
    //   .string({
    //     required_error: "Status is required",
    //     invalid_type_error: "Status is required",
    //   })
    //   .min(1, "Status is required"),
    // dependent: z
    //   .string({ required_error: "This is required" })
    //   .min(1, "This is required"),
    // legal: z
    //   .string({
    //     required_error: "Legal is required",
    //     invalid_type_error: "Legal is required",
    //   })
    //   .min(1, "Legal is required"),

    faultPercentage: z
      .string({
        required_error: "Please enter the percentage of fault attributed",
        invalid_type_error: "Please enter the percentage of fault attributed",
      })
      .min(1, "Please enter the percentage of fault attributed"),
    otherFault:
      conditions.percentage == "Other"
        ? z
            .string({
              required_error: "Please specify the other percentage",
              invalid_type_error: "Please specify the other percentage",
            })
            .min(1, "Please specify the other percentage")
        : z.string().optional(),

    currentCondition: z
      .string({
        required_error: "Please select your current condition",
        invalid_type_error: "Please select your current condition",
      })
      .min(1, "Please select your current condition"),

    deceased:
      conditions.condition == "Deceased"
        ? z
            .string({
              required_error: "Please select",
              invalid_type_error: "Please select",
            })
            .min(1, "Please select")
        : z.string().optional(),

    otherCondition:
      conditions.condition == "Other"
        ? z
            .string({
              required_error: "Please specify the other condition",
              invalid_type_error: "Please specify the other condition",
            })
            .min(1, "Please specify the other condition")
        : z.string().optional(),

    otherDeceased:
      conditions.decease == "other"
        ? z
            .string({
              required_error: "Please specify the other relationship",
              invalid_type_error: "Please specify the other relationship",
            })
            .min(1, "Please specify the other relationship")
        : z.string().optional(),
  });
};

const AccidentDetails = ({
  data,
  hide,
}: {
  data: Injury | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [accidentLoc, setAccidentLoc] = useState<string>("");
  const [livingSituation, setLivingSituation] = useState<string>("");
  const [natureOfAccident, setNatureOfAccident] = useState<string>("");
  const [isAlcoholInfluence, setIsAlcoholInfluence] = React.useState("");
  // const [currentCondition, setCurrentCondition] = React.useState("");
  const [percentage, setFaultPercentage] = React.useState("");

  const [condition, setCondition] = React.useState("");
  const [decease, setDeceased] = React.useState("");
  const countries = Country.getAllCountries().map((country) => ({
    value: country.name,
    label: country.name,
  }));

  const { methods, setValues } = useHookForm<FormValues>(
    conditionalSchema({
      accidentLoc,
      livingSituation,
      natureOfAccident,
      percentage,
      condition,
      decease,
    })
  );
  const { formState, control } = methods;

  const [errors, setErrors] = useState({
    influenceErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    // if (!isAlcoholInfluence) {
    //   isError = true;
    //   errorObj = { ...errorObj, influenceErr: true };
    // }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const handlePrevious = async () => {
    try {
      setLoading(true);
      const data: { caseId: string } = await axios.post(
        "/api/client/category/injury/createInjury",
        {
          caseId: caseId,
          progress: 20,
        }
      );
      let id = data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
      router.push(
        `/client/personal-injury-assessment-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }
      
      let payload: any = {
        caseId: caseId,
        ...values,
        // isAlcoholInfluence,
        otherFault: percentage == "Other" ? values.otherFault : "",
        abroad: accidentLoc === "Abroad" ? values?.abroad : "",
        otherCondition: condition == "Other" ? values.otherCondition : "",
        deceased: condition == "Deceased" ? values?.deceased : "",
        otherDeceased:
          condition == "Deceased" && decease == "other"
            ? values.otherDeceased
            : "",
        //   progress: 40,
        //   nextProgress: 40,
      };
      if (!hide) {
        payload = { ...payload, progress: 40, nextProgress: 40 };
      }

      const response: {
        caseId: string;
      } = await axios.post("/api/client/category/injury/createInjury", payload);

      let id = response?.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "40");

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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsAlcoholInfluence((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.influenceErr = false;
      return newErrorObj;
    });
  };

  useEffect(() => {
    setValues({
      accident_place: data?.accident_place,
      abroad: data?.abroad,
      // situation: data?.situation,
      // accident_type: data?.accident_type,
      // nature: data?.nature,
      // other_nature: data?.other_nature,
      // statusAcc: data?.statusAcc,
      // dependent: data?.dependent,
      // legal: data?.legal,
      faultPercentage: data?.faultPercentage,
      otherFault: data?.otherFault?.toString(),
      deceased: data?.deceased,
      currentCondition: data?.currentCondition,
      otherCondition: data?.otherCondition,
      otherDeceased: data?.otherDeceased,
    });

    const res = countries.find((i) => {
      return i.value == data?.abroad;
    });
    setAccidentLoc(data?.accident_place ?? "");
    // setLivingSituation(data?.situation ?? "");
    // setPlace(res);
    // setIsAlcoholInfluence(data?.isAlcoholInfluence ?? "");
    // setNatureOfAccident(data?.nature ?? "");
    setFaultPercentage(data?.faultPercentage ?? "");
    setCondition(data?.currentCondition ?? "");
    setDeceased(data?.deceased ?? "");
  }, [data]);
  console.log(formState.errors);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold my-4 gray">
        Accident Details and Current Condition
      </h3>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input md-3">
              <label className="d-block my-3">Where did the accident happen?</label>
              <SelectField
                options={options}
                name="accident_place"
                className="bglight-select"
                error={formState.errors["accident_place"]}
                control={control}
                emitChange={(val) => {
                  setAccidentLoc(val ?? "");
                }}
              />
            </div>
            {accidentLoc === "Abroad" && (
              <div className="lease-input mt-4">
                <label className="tooltip-title relative">
                  Abroad (Please Specify)
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Please specify the country where the accident occurred.
                  </span>
                </label>

                <SelectField
                  options={countries}
                  label=""
                  name="abroad"
                  className="bglight-select"
                  error={formState.errors["abroad"]}
                  control={control}
                />

                {/* <MaterialSelectField
                  label=""
                  placeholder=""
                  changeValue={abroad}
                  setChangeValue={handleCountry}
                  options={countries}
                />
                {errors.countryErr && (
                  <span className="text-danger">
                    Please select the country where the accident occurred.
                  </span>
                )} */}
              </div>
            )}
          </div>
          {/* <div className="col-12 col-md-6 mb-4">
            <div className="lease-input md-3">
              <label className="d-block">
                What is your living situation after the accident?
              </label>
              <SelectField
                options={situation}
                label=""
                name="situation"
                className="bglight-select"
                error={formState.errors["situation"]}
                control={control}
                emitChange={(val) => {
                  if (val !== "Residence") setValues({ accident_type: "" });
                  setLivingSituation(val ?? "");
                }}
              />
            </div>
            {livingSituation === "Residence" && (
              <div className="lease-input mt-4">
                <label className="tooltip-title relative">
                  {`Residence(Please specify type)`}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    {` Please specify the type of residence (e.g., assisted living,
                  nursing home, family member's home)`}
                  </span>
                </label>
                <InputField
                  error={formState.errors["accident_type"]}
                  label="please specify type"
                  name="accident_type"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            )}
          </div> */}
          {/* <div className="col-12 col-md-6 mb-4">
            <div className="lease-input md-3 mt-4">
              <label className="d-block">
                What was the nature of the accident?
              </label>
              <SelectField
                options={nature}
                label=""
                name="nature"
                className="bglight-select"
                error={formState.errors["nature"]}
                control={control}
                emitChange={(val) => {
                  if (val !== "others") setValues({ other_nature: "" });
                  setNatureOfAccident(val ?? "");
                }}
              />
            </div>
            {natureOfAccident === "others" && (
              <div className="lease-input mt-4">
                <label className="tooltip-title relative">
                  Other (Please Specify)
                </label>
                <InputField
                  error={formState.errors["other_nature"]}
                  label="Others"
                  name="other_nature"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            )}
          </div> */}
          {/* <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                {`What was your socio-economic status (SES) before the accident?`}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  {`Choose the income bracket that best reflects your household's
                  total income before the accident.`}
                </span>
              </label>
              <SelectField
                options={statusAcc}
                label=""
                name="statusAcc"
                className="bglight-select"
                error={formState.errors["statusAcc"]}
                control={control}
              />
            </div>
          </div> */}
          {/* <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Were you under the influence of alcohol or drugs at the time of
                the accident?
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={isAlcoholInfluence}
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
                {errors.influenceErr && (
                  <span className="text-danger">
                    Please select, if you under the influence of alcohol or
                    drugs
                  </span>
                )}
              </FormControl>
            </div>
          </div> */}
          {/* <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                How many dependent children under 21 years old do you have?
              </label>
              <InputField
                type="number"
                error={formState.errors["dependent"]}
                label="How many dependent children under 21 years old do you have?"
                name="dependent"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div> */}

          {/* <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                Does the victim have any legal protection?
              </label>
              <SelectField
                options={legal}
                name="legal"
                className="bglight-select"
                error={formState.errors["legal"]}
                control={control}
              />
            </div>
          </div> */}

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input md-4">
              <label className="tooltip-title relative">
                {`What is the percentage of fault attributed to the other party in
                the accident?`}
              </label>
              <SelectField
                options={faultPercentage}
                label=""
                name="faultPercentage"
                className="bglight-select"
                error={formState.errors["faultPercentage"]}
                control={control}
                emitChange={(val: any) => {
                  setFaultPercentage(val);
                }}
              />
            </div>
            {percentage == "Other" && (
              <div className="col-12 col-md-12 mb-4">
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    Other
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      {`The other party was partially at fault, but none of the above options accurately reflect the percentage. Please enter the specific percentage.`}
                    </span>
                  </label>

                  <InputField
                    type="number"
                    error={formState.errors["otherFault"]}
                    label="%"
                    name="otherFault"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                What is your current condition?
              </label>
              <SelectField
                options={conditionArr}
                name="currentCondition"
                className="bglight-select"
                error={formState.errors["currentCondition"]}
                control={control}
                emitChange={(val: any) => {
                  setCondition(val);
                }}
              />
            </div>

            {condition == "Other" && (
              <div className="col-12 col-md-12 mb-4">
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    Other
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      {`Please describe your current condition in detail. This information is important for us to understand the extent of your injuries or condition.`}
                    </span>
                  </label>

                  <InputField
                    error={formState.errors["otherCondition"]}
                    label="Other"
                    name="otherCondition"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            )}

            {condition == "Deceased" && (
              <div className="col-12 col-md-12 mb-4">
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    What is the relationship oft the person completing this form
                    on behalf of the victim?
                    {/* <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      {`Please describe your current condition in detail. This information is important for us to understand the extent of your injuries or condition.`}
                    </span> */}
                  </label>
                  <SelectField
                    options={deceasedArr}
                    name="deceased"
                    className="bglight-select"
                    error={formState.errors["deceased"]}
                    control={control}
                    emitChange={(val: any) => {
                      setDeceased(val);
                    }}
                  />
                </div>
              </div>
            )}

            {condition == "Deceased" && decease == "other" && (
              <div className="col-12 col-md-12 mb-4">
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">Other</label>
                  <InputField
                    error={formState.errors["otherDeceased"]}
                    label="Other"
                    name="otherDeceased"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </div>
            )}
          </div>
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

export default AccidentDetails;
