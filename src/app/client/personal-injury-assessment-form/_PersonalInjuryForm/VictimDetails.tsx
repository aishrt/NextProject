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
import {
  Autocomplete,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  TextField,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import { axios } from "@/utils/axios";
import { Injury } from "@/types/Injury";

type FormValues = {
  age: string;
  gender: string;
  current_age: string;
  occupation: string;
  faultPercent: string;
  others: string;
  occupationAfter: string;
  relationship: string;
  otherRelationship: string;
  economicLevel: string;
  live: string;
  dependentChildren: string;
  protection: string;
  protectionRelation: string;
  otherProtectionRelation: string;
};
const familyProtectionArr = [
  {
    label: "Tutelle (Guardianship)",
    value: "Tutelle",
    tooltip:
      "A legal measure for protecting an adult who cannot manage their own affairs due to impairment. A guardian is appointed by the family or the court to handle the person's personal and financial matters.",
  },
  {
    label: "Curatelle (Curatorship)",
    value: "Curatelle",
    tooltip:
      "Less restrictive than tutelle, curatorship is for adults who need assistance with significant acts of daily life. A curator is appointed to assist the person in managing their affairs, but the person retains some autonomy.",
  },
  {
    label: "Sauvegarde de Justice (Judicial Protection)",
    value: "Sauvegarde de Justice",
    tooltip:
      "A temporary and less restrictive measure than tutelle and curatelle, used when a person needs protection due to an impairment but can still manage their own affairs to some extent. It allows for the protection of rights and property without fully removing autonomy.",
  },
];

const stateProtectionArr = [
  {
    label: "Tutelle d'État (State Guardianship)",
    value: "Tutelle",
    tooltip:
      "When no family member is available or willing to act as a guardian, the court appoints a state guardian, typically a public administrator or an organization dedicated to guardianship services, to manage the personal and financial affairs of the protected person.",
  },
  {
    label: "Curatelle d'État (State Curatorship)",
    value: "Curatelle",
    tooltip:
      "Similar to state guardianship, but for those who need assistance rather than full guardianship. A state-appointed curator assists the person in managing significant acts of daily life while allowing them to retain some degree of autonomy.",
  },
  {
    label: "Sauvegarde de Justice d'État (State Judicial Protection)",
    value: "Sauvegarde de Justice",
    tooltip:
      "This temporary measure can also be applied by the state when there is no available family member to provide the necessary support. It ensures the protection of the person's rights and property while maintaining their autonomy to a large extent.",
  },
];

const options = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Prefer not to say", value: "prefer" },
];
const occupation = [
  { label: "Student", value: "student" },
  { label: "Manual Laborer", value: "laborer" },
  { label: "Office/Desk Worker", value: "officeWorker" },
  { label: "Unemployed/On Welfare", value: "welfare" },
  { label: "Retired", value: "retired" },
];

const protectionArr = [
  { label: "No protection measure", value: "No protection measure" },
  { label: "Family protection", value: "Family protection" },
  { label: "State protection", value: "State protection" },
];

const live = [
  { label: "Home", value: "Home" },
  {
    label: "Residence (Healthcare facility or nursing home)",
    value: "Residence",
  },
];
const relationship = [
  { label: "Parent", value: "Parent" },
  { label: "Spouse or Partner", value: "Spouse or Partner" },
  { label: "Child", value: "Child" },
  { label: "Sibling", value: "Sibling" },
  { label: "Grandparent", value: "Grandparent" },

  { label: "Grandchild", value: "Grandchild" },
  { label: "Legal Guardian", value: "Legal Guardian" },
  {
    label: "Other Family Member (e.g., aunt, uncle, cousin)",
    value: "Other Family Member",
  },
  { label: "Professional Caregiver", value: "Professional Caregiver" },
  { label: "Other (please specify)", value: "other" },
];

const economicLevel = [
  { label: "Very Wealthy (> 5000€)", value: "Very Wealthy" },
  { label: "Wealthy (2500€ - 5000€)", value: "Wealthy" },
  { label: "Median (1301€ - 2499€)", value: "Median" },
  { label: "Minimum Wage (1000€ - 1300€)", value: "Minimum Wage" },
  { label: "Disadvantaged (< 1000€)", value: "Disadvantaged" },
];

const faultPercent = [
  { label: "100% - No Fault", value: "noFault" },
  { label: "75% Fault", value: "75% Fault" },
  { label: "50% Fault", value: "50% Fault" },
  { label: "25% Fault", value: "25% Fault" },
  { label: "Other", value: "other" },
];
const occupationAfter = [
  { label: "Total Disability", value: "totalDisability" },
  { label: "Partial Manual Disability", value: "Partial Manual Disability" },
  {
    label: "Partial Intellectual Disability",
    value: "Partial Intellectual Disability",
  },
  { label: "Unable to Work (any type)", value: "Unable to Work (any type)" },
  {
    label: "Inactive (retired, student, etc.)",
    value: "Inactive (retired, student, etc.)",
  },
  { label: "Employed", value: "Employed" },
];

const schema = (
  condition: string,
  relation: string,
  age: string,
  protection: string,
  protectionRelation: string
): z.ZodSchema => {
  return z.object({
    age: z
      .string({ required_error: "Please enter age" })
      .min(1, "Please enter age"),
    gender: z
      .string({
        required_error: "Please select gender",
        invalid_type_error: "Please select gender",
      })
      .min(1, "Please select gender"),
    current_age: z
      .string({ required_error: "Please enter your current age" })
      .min(1, "Please enter your current age"),
    occupation: z
      .string({
        required_error: "Please enter occupation before accident",
        invalid_type_error: "Please enter occupation before accident",
      })
      .min(1, "Please enter occupation before accident"),
    // faultPercent: z
    //   .string({
    //     required_error: "Please enter percentage of fault",
    //     invalid_type_error: "Please enter percentage of fault",
    //   })
    //   .min(1, "Please enter percentage of fault"),
    occupationAfter: z
      .string({
        required_error: "Please enter current occupation",
        invalid_type_error: "Please enter current occupation",
      })
      .min(1, "Please enter current occupation"),
    // others:
    //   condition === "other"
    //     ? z
    //         .string({ required_error: "Please specify other" })
    //         .min(1, "Please specify other")
    //     : z.string().optional(),

    relationship:
      age && Number(age) < 18
        ? z
            .string({
              required_error: "Please select the relationship of the person",
              invalid_type_error:
                "Please select the relationship of the person",
            })
            .min(1, "Please select the relationship of the person")
        : z.string().optional(),

    otherRelationship:
      relation === "other"
        ? z
            .string({ required_error: "Please specify other" })
            .min(1, "Please specify other")
        : z.string().optional(),

    economicLevel: z
      .string({
        required_error: "Please select the socio-economic level",
        invalid_type_error: "Please select the socio-economic level",
      })
      .min(1, "Please select the socio-economic level"),

    live: z
      .string({
        required_error: "Please select, where you live after the accident",
        invalid_type_error: "Please select, where you live after the accident",
      })
      .min(1, "Please select, where you live after the accident"),

    dependentChildren: z
      .string({
        required_error: "Select 0 if you have no dependent children under 21",
      })
      .min(1, "Select 0 if you have no dependent children under 21"),

    protection: z
      .string({
        required_error: "Please select, if you under any protection measure",
        invalid_type_error:
          "Please select, if you under any protection measure",
      })
      .min(1, "Please select, if you under any protection measure"),

    protectionRelation:
      protection == "Family protection" || protection == "State protection"
        ? z
            .string({
              required_error: "Please select the relationship of the person",
              invalid_type_error:
                "Please select the relationship of the person",
            })
            .min(1, "Please select the relationship of the person")
        : z.string().optional(),

    otherProtectionRelation:
      protectionRelation === "other"
        ? z
            .string({ required_error: "Please specify other" })
            .min(1, "Please specify other")
        : z.string().optional(),
  });
};

const VictimDetails = ({
  data,
  hide,
}: {
  data: Injury | undefined | null;
  hide: boolean;
}) => {
  const router = useRouter();
  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");
  const [loading, setLoading] = useState(false);
  const [faultVal, setFaultVal] = useState<string>("");
  const [relation, setRelation] = useState<string>("");
  const [protectionRelation, setProtectionRelation] = useState<string>("");
  const [protection, setProtection] = React.useState("");

  const [age, setAge] = useState("");
  const { methods, setValues } = useHookForm<FormValues>(
    schema(faultVal, relation, age, protection, protectionRelation)
  );
  const { formState, control } = methods;

  const [stabilized, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.err = false;
      return newErrorObj;
    });
  };

  const [selectedOption, setSelectedOption] = React.useState<{
    label: string;
    value: string;
    tooltip: string;
  }>();

  const [selectOption, setSelectOption] = React.useState<{
    label: string;
    value: string;
    tooltip: string;
  }>();

  const [errors, setErrors] = useState({
    err: false,
    protectErr: false,
    stateprotectErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!stabilized) {
      isError = true;
      errorObj = { ...errorObj, err: true };
    }

    if (protection == "Family protection" && !selectedOption) {
      isError = true;
      errorObj = { ...errorObj, protectErr: true };
    }

    if (protection == "State protection" && !selectOption) {
      isError = true;
      errorObj = { ...errorObj, stateprotectErr: true };
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

      let payload: any = {
        caseId: caseId,
        ...values,
        stabilized,
        protectionRelation:
          protection == "Family protection" || protection == "State protection"
            ? protectionRelation
            : "",
        otherProtection:
          protection == "Family protection"
            ? selectedOption?.value
            : protection == "State protection"
            ? selectOption?.value
            : "",
        // progress: 30,
        // nextProgress: 30,
      };

      if (!hide) {
        payload = {
          ...payload,
          progress: 30,
          nextProgress: 30,
        };
      }

      const response: {
        caseId: string;
      } = await axios.post("/api/client/category/injury/createInjury", payload);

      let id = response?.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "30");

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
      const data: { caseId: string } = await axios.post(
        "/api/client/category/injury/createInjury",
        {
          caseId: caseId,
          progress: 10,
        }
      );
      let id = data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "10");
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
      age: data?.age,
      gender: data?.gender,
      current_age: data?.current_age?.toString(),
      occupation: data?.occupation,
      // faultPercent: data?.faultPercent,
      // others: data?.others,
      occupationAfter: data?.occupationAfter,
      relationship: data?.relationship,
      economicLevel: data?.economicLevel,
      live: data?.live,
      dependentChildren: data?.dependentChildren?.toString(),
      protection: data?.protection,
      protectionRelation: data?.protectionRelation,
    });
    setValue(data?.stabilized ?? "");
    setProtection(data?.protection ?? "");
    setProtectionRelation(data?.protectionRelation ?? "");

    const res = stateProtectionArr.find((i) => {
      return i.value == data?.otherProtection;
    });
    setSelectOption(res);

    const response = familyProtectionArr.find((i) => {
      return i.value == data?.otherProtection;
    });
    setSelectedOption(response);
  }, [data]);

  return (
    <div className="lease-form">
      <h3 className="f-22 bold my-4 gray">Personal Information</h3>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                How old were you at the time of the accident?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Please provide your age when the accident happened.
                </span>
                {/* </div> */}
              </label>
              <InputField
                error={formState.errors["age"]}
                label="Please provide your age when the accident happened."
                name="age"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input md-3">
              <label className="d-block">What is your gender ?</label>
              <SelectField
                options={options}
                label=""
                name="gender"
                className="bglight-select"
                error={formState.errors["gender"]}
                control={control}
              />
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Is your condition stabilized?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  If your injuries have reached a point where significant
                  improvement is unlikely, please select &quot;Yes.&quot;
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={stabilized}
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
                  {errors.err && (
                    <span className="text-danger">
                      Please select your stabilized condition
                    </span>
                  )}
                </RadioGroup>
              </FormControl>
            </div>
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                What is your current age?
                {/* <div className="tooltip-icn relative"> */}
                {/* <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  If your injuries have reached a point where they are unlikely
                  to significantly improve, please provide your current age.
                </span> */}
                {/* </div> */}
              </label>
              <InputField
                type="number"
                error={formState.errors["current_age"]}
                label="Current Age"
                name="current_age"
                variant="filled"
                className="bglight-ip"
                control={control}
                emitChange={(val: any) => {
                  setAge(val);
                }}
              />
            </div>
          </div>

          {age && Number(age) < 18 && (
            <>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mt-4">
                  <label className="d-block">
                    What is the relationship of the person completing this form
                    on behalf of the victim?
                  </label>
                  <SelectField
                    options={relationship}
                    label=""
                    name="relationship"
                    className="bglight-select"
                    error={formState.errors["relationship"]}
                    control={control}
                    emitChange={(val) => {
                      setRelation(val ?? "");
                      if (val !== "other") {
                        setValues({
                          otherRelationship: "",
                        });
                      }
                    }}
                  />
                </div>
              </div>

              {relation == "other" && (
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input">
                    <label className="tooltip-title relative">
                      Please specify the other relationship
                    </label>
                    <InputField
                      error={formState.errors["otherRelationship"]}
                      label="Other"
                      name="otherRelationship"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-4">
              <label className="d-block">
                What was your occupation before the incident?
              </label>
              <SelectField
                options={occupation}
                label=""
                name="occupation"
                className="bglight-select"
                error={formState.errors["occupation"]}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                What is your socio-economic level (CSP) or that of your parents
                if you are a minor?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  {`Select the socio-economic level based on your or your parents' net taxable income.`}
                </span>
              </label>
              <SelectField
                options={economicLevel}
                label=""
                name="economicLevel"
                className="bglight-select"
                error={formState.errors["economicLevel"]}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                Where do you live after the accident?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  {`Select "Residence" if you are staying in a healthcare facility or a nursing home.`}
                </span>
              </label>
              <SelectField
                options={live}
                label=""
                name="live"
                className="bglight-select"
                error={formState.errors["live"]}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-4">
              <label className="d-block">
                What is your current occupation status after the incident?
              </label>
              <SelectField
                options={occupationAfter}
                label=""
                name="occupationAfter"
                className="bglight-select"
                error={formState.errors["occupationAfter"]}
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                How many dependent children under the age of 21 do you have?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  {`Please enter the number of children under 21 who are financially dependent on you. Select 0 if you have no dependent children under 21.`}
                </span>
              </label>
              <InputField
                type="number"
                error={formState.errors["dependentChildren"]}
                label="Dependent Children"
                name="dependentChildren"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-4">
              <label className="tooltip-title relative">
                Are you under any protection measure?{" "}
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  {`If applicable, please specify any legal protection measures such as guardianship, curatorship, or judicial protection. Select "No protection measure" if none are in place.`}
                </span>
              </label>

              <SelectField
                options={protectionArr}
                name="protection"
                className="bglight-select"
                error={formState.errors["protection"]}
                control={control}
                emitChange={(val) => {
                  setProtection(val ?? "");
                }}
              />
            </div>
          </div>

          {(protection == "Family protection" ||
            protection == "State protection") && (
            <>
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    What is the relationship of the person completing this form
                    on behalf of the victim?
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      {`Since individuals under 18 and/or under protection cannot represent themselves in legal matters, please indicate the relationship of the person completing this form on their behalf.`}
                    </span>
                  </label>
                  <SelectField
                    options={relationship}
                    label=""
                    name="protectionRelation"
                    className="bglight-select"
                    error={formState.errors["protectionRelation"]}
                    control={control}
                    emitChange={(val) => {
                      setProtectionRelation(val ?? "");
                      if (val !== "other") {
                        setValues({
                          otherProtectionRelation: "",
                        });
                      }
                    }}
                  />
                </div>
              </div>

              {protectionRelation == "other" && (
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input">
                    <label className="tooltip-title relative">
                      Please specify the other relationship
                    </label>
                    <InputField
                      error={formState.errors["otherProtectionRelation"]}
                      label="Other"
                      name="otherProtectionRelation"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          {protection == "Family protection" && (
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mt-4">
                <label className="tooltip-title relative">
                  Family Protection
                </label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={familyProtectionArr}
                  sx={{ width: 450, backgroundColor: "#d6eadf" }}
                  value={selectedOption}
                  onChange={(event, newValue: any) => {
                    setSelectedOption(newValue);
                    setErrors((prev) => {
                      let newErrorObj = { ...prev };
                      newErrorObj.protectErr = false;
                      return newErrorObj;
                    });
                  }}
                  renderInput={(params) => (
                    <Tooltip title={selectedOption?.tooltip ?? ""} arrow>
                      <TextField {...params} label="" />
                    </Tooltip>
                  )}
                  getOptionLabel={(option) => option.label}
                />
              </div>
              {errors.protectErr && (
                <span className="text-danger">Please select</span>
              )}
            </div>
          )}

          {protection == "State protection" && (
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mt-4">
                <label className="tooltip-title relative">
                  State Protection
                </label>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={stateProtectionArr}
                  sx={{ width: 450, backgroundColor: "#d6eadf" }}
                  value={selectOption}
                  onChange={(event, newValue: any) => {
                    setSelectOption(newValue);
                    setErrors((prev) => {
                      let newErrorObj = { ...prev };
                      newErrorObj.stateprotectErr = false;
                      return newErrorObj;
                    });
                  }}
                  renderInput={(params) => (
                    <Tooltip title={selectOption?.tooltip ?? ""} arrow>
                      <TextField {...params} label="" />
                    </Tooltip>
                  )}
                  getOptionLabel={(option) => option.label}
                />
              </div>
              {errors.stateprotectErr && (
                <span className="text-danger">Please select</span>
              )}
            </div>
          )}
          {/* <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mt-4">
              <label className="d-block">
                What percentage of the fault for the accident do you believe you
                hold?{" "}
              </label>
              <SelectField
                options={faultPercent}
                name="faultPercent"
                className="bglight-select"
                error={formState.errors["faultPercent"]}
                control={control}
                emitChange={(val) => {
                  setFaultVal(val ?? "");
                  if (val !== "other") {
                    setValues({
                      others: "",
                    });
                  }
                }}
              />
            </div>
            {faultVal == "other" && (
              <div className="lease-input mt-4">
                <label className="tooltip-title relative">
                  Other (Please Specify)
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    If you were not at fault, select 100%. If you were partially
                    at fault, please estimate the percentage. This helps
                    determine potential compensation.
                  </span>
                </label>
                <InputField
                  error={formState.errors["others"]}
                  label="Others"
                  name="others"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            )}
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

export default VictimDetails;
