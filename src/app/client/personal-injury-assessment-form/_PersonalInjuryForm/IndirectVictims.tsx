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
import { Checkbox, FormGroup, TextField } from "@mui/material";
import TextAreaField from "@/components/Form/TextArea";
import axios from "axios";
import { Injury } from "@/types/Injury";
import { MultiSelect } from "@/components/Form/MultiSelect";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import { MaterialSelectField } from "@/components/Form/MaterialSelectField";

type IndirectErrors = {
  caregiving: string;
};
type IndividualValues = {
  name: string;
  surname: string;
  relation: string;
  otherRelation: string;
  damage: string;
};

type IndividualErrors = {
  name: string;
  surname: string;
  relation: string;
  otherRelation: string;
  damage: string;
};
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

type FormValues = {
  indirectVictim: string;
  damageDescription: string;
  // duration: string;
};

const schema = (victim: any): z.ZodSchema => {
  return z.object({
    indirectVictim: ((msg) =>
      z
        .string({
          required_error: msg,
        })
        .min(1, msg))("Please enter the indirect victims"),

    // duration:
    //   victim.isVictimLive === "yes"
    //     ? ((msg) => z.string({ required_error: msg }).min(1, msg))(
    //         "Please specify the duration"
    //       )
    //     : z.string().optional(),

    // damageDescription:56
    //   victim === "yes"
    //     ? z
    //         .string({ required_error: "Please specify about damages" })
    //         .min(1, "Please specify about damages")
    //     : z.string().optional(),
  });
};
function getStyles(name: string, personName: string[], theme: Theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const IndirectVictims = ({ data }: { data: Injury | undefined | null }) => {
  const theme = useTheme();

  const router = useRouter();
  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");
  const [loading, setLoading] = useState(false);
  const [isVictimLive, setIsVictimLive] = React.useState("");
  const [insurance, setInsurance] = React.useState("");
  const [victim, setVictim] = useState("");
  const [relation, setRelation] = useState("");
  const [individualData, setIndividualData] = useState<IndividualValues[]>([
    {
      name: "",
      surname: "",
      relation: "",
      otherRelation: "",
      damage: "",
    },
  ]);

  const [personName, setPersonName] = React.useState<string[]>([]);

  const { methods, setValues } = useHookForm<FormValues>(
    schema({ isVictimLive })
  );
  const { formState, control } = methods;
  const [names, setNames] = useState([""]);

  useEffect(() => {
    const data = individualData.map((i) => {
      return i.name + " " + i.surname;
    });
    setNames(data);
  }, [individualData]);

  const [careError, setCareErr] = useState<IndirectErrors[]>([
    {
      caregiving: "",
    },
  ]);

  const [careData, setCareData] = useState([
    {
      name: "",
      duration: "",
    },
  ]);

  const relationArr = [
    { label: " Spouse or Partner", value: "Spouse or Partner" },
    { label: "Child", value: "Child" },
    { label: "Parent of a Minor Child", value: "Parent of a Minor Child" },
    { label: "Parent of an Adult Child", value: "Parent of an Adult Child" },

    { label: "Grandparent", value: "Grandparent" },

    { label: "Grandchild", value: "Grandchild" },

    { label: "Sibling", value: "Sibling" },

    {
      label: "Other Emotional Relationship",
      value: "Other",
    },
  ];

  const handleMultiOptions = (values: any) => {
    if (values.length > 0) {
      const newValues = values.map((i: any) => ({
        label: i.value,
        value: i.id,
      }));
      return newValues;
    }
    return [];
  };

  // const handleMultiChange = (multiValues: string[], id: string) => {
  //   if (multiValues) {
  //     setFinalVal(multiValues);
  //     let attrs = [...selectedAttributes];
  //     attrs = attrs.map((i) => {
  //       if (i.id.toString() === id.toString()) {
  //         i.selectedValues = multiValues;
  //       }
  //       return i;
  //     });
  //     setSelectedAttributes(attrs);
  //     setFinalAttributes(attrs);
  //   }
  // };

  const [errors, setErrors] = useState({
    victimErr: false,
    insuranceErr: false,
    nameErr: false,
    err: false,
  });

  const [individualErrors, setIndividualErrors] = useState<IndividualErrors[]>([
    {
      name: "",
      surname: "",
      relation: "",
      otherRelation: "",
      damage: "",
    },
  ]);

  const victimChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsVictimLive((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.victimErr = false;
      return newErr;
    });
  };

  const handleInsurance = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInsurance((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.insuranceErr = false;
      return newErr;
    });
  };
  const [durationValid, setDurationValid] = useState(
    Array(personName.length).fill(true)
  );

  const handleNumberChange = (
    index: number,
    payload: { name: string; duration: string }
  ) => {
    setCareData((prev) => {
      let newPremises = [...prev];
      // if (newPremises[index]) {
      newPremises[index] = payload;
      //  }
      return newPremises;
    });
    setCareErr((prev) => {
      let prevErrs: any = [...prev];
      if (prevErrs[index]) {
        prevErrs[index].caregiving = "";
      }
      return prevErrs;
    });

    //checkDurationErr(index, payload.duration);
  };

  const checkDurationErr = (index: number, val: string) => {
    const newDurationValid = [...durationValid];
    const isValid = /^\d+$/.test(val);
    newDurationValid[index] = isValid;
    setDurationValid(newDurationValid);
  };

  const checkVictimValidations = () => {
    let victimItms = [...individualData];
    let errObj = [...individualErrors];
    let isError = false;

    individualData.forEach((item, index) => {
      let initialItm = victimItms[index];
      if (!initialItm.name) {
        isError = true;
        errObj[index].name = "Please enter the name";
      }
      if (!initialItm.surname) {
        isError = true;
        errObj[index].surname = "Please enter the surname";
      }
      if (!initialItm.relation) {
        isError = true;
        errObj[index].relation = "Please select the relation";
      }

      if (relation == "Other" && !initialItm.otherRelation) {
        isError = true;
        errObj[index].otherRelation = "Please select the other relationship";
      }
      if (!initialItm.damage) {
        isError = true;
        errObj[index].damage = "Please describe the damage";
      }
      if (isError) {
        setIndividualErrors(errObj);
      }
    });
    return isError;
  };

  const handleAddVictim = () => {
    // if (checkNumberValidation(noOfPremises)) return;
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.err = false;
      return newErr;
    });

    if (checkVictimValidations()) return;
    let newData = [...individualData];
    let newErrors = [...individualErrors];

    if (victim && individualData.length < Number(victim)) {
      newData.push({
        name: "",
        surname: "",
        relation: "",
        otherRelation: "",
        damage: "",
      });
      newErrors.push({
        name: "",
        surname: "",
        relation: "",
        otherRelation: "",
        damage: "",
      });
      setIndividualData(newData);
      setIndividualErrors(newErrors);
    }
  };

  const handleChangeValue = (val: string) => {
    const newValue = relationArr.find((i) => i.value === val);
    return newValue;
  };

  const handleIndividualChange = (
    index: number,
    val: string | number,
    field: keyof IndividualValues
  ) => {
    setIndividualData((prev) => {
      let newIndividual: any = [...prev];
      if (newIndividual[index]) {
        newIndividual[index][field] = val;
      }
      return newIndividual;
    });

    setIndividualErrors((prev) => {
      let prevErrs = [...prev];
      if (prevErrs[index]) {
        prevErrs[index][field] = "";
      }
      return prevErrs;
    });
  };

  const checkError = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (individualData.length !== Number(victim)) {
      isError = true;
      errorObj.err = true;
    }
    if (!isVictimLive) {
      isError = true;
      errorObj.victimErr = true;
    }

    if (!insurance) {
      isError = true;
      errorObj.insuranceErr = true;
    }

    if (isVictimLive == "yes" && personName.length == 0) {
      isError = true;
      errorObj.nameErr = true;
    }

    // const checkErr = careData.every((val) => {
    //   let data = Object.values(val?.duration);
    //   return data.every((value: any) => {
    //     return value === "" || value === null || value === undefined;
    //   });
    // });

    // if (checkErr) {
    //   if (checkValidations()) return;
    // }
    // if (checkValidations()) return;
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (checkVictimValidations()) return;

      if (checkError()) {
        return;
      }

      const payload = {
        caseId: caseId,
        ...values,
        isVictimLive,
        insurance,
        caregiving: careData,
        victimDetails: individualData,
        progress: insurance == "yes" ? 90 : 100,
        nextProgress: insurance == "yes" ? 90 : 100,
      };

      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        payload
      );

      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", insurance == "yes" ? "90" : "100");
      router.push(
        `/client/personal-injury-assessment-form?${searchParam.toString()}`
      );

      setLoading(false);
    } catch (err) {
      console.log(err, "uououiy");
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
          progress: "70",
        }
      );
      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");

      router.push(
        `/client/personal-injury-assessment-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleChange = (event: SelectChangeEvent<typeof personName>) => {
    const {
      target: { value },
    } = event;
    const namesArray = typeof value === "string" ? value.split(",") : value;
    setPersonName(namesArray);
    const res = careData.filter((item) => {
      return namesArray.includes(item.name);
    });
    setCareData(res);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.nameErr = false;
      return newErr;
    });
  };

  const checkValidations = () => {
    let premisesItms = [...careData];
    let errObj = [...careError];
    let isError = false;

    careData.forEach((item, index) => {
      let initialItm = premisesItms[index];

      if (!initialItm.duration) {
        isError = true;

        errObj[index].caregiving = "Please select duration of caregiving";

        // const newDurationValid = [...durationValid];
        // const isValid = /^\d+$/.test(item.duration); // Validation rule: Allows only digits
        // newDurationValid[index] = isValid;
        // setDurationValid(newDurationValid);
      }

      if (isError) {
        setCareErr(errObj);
      }
    });
    return isError;
  };

  useEffect(() => {
    setValues({
      indirectVictim: data?.indirectVictim?.toString(),
    });
    setInsurance(data?.insurance ?? "");
    setIsVictimLive(data?.isVictimLive ?? "");
    setIndividualData(data?.victimDetails ?? []);
    setCareData(data?.caregiving ?? []);
    setVictim(data?.indirectVictim?.toString() ?? "");
    let person = data?.caregiving.map((val) => {
      return val.name;
    });
    setPersonName(person ?? []);
  }, [data]);

  console.log(victim);

  return (
    <div className="lease-form">
      {/* <h3 className="f-22 bold my-4 gray">
        Step 6: Details of Indirect Victims (If Applicable)
      </h3> */}
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input mb-3">
              <label className="tooltip-title relative">
                How many indirect victims are there?
              </label>
              <InputField
                type="number"
                error={formState.errors["indirectVictim"]}
                label="Indirect victims"
                name="indirectVictim"
                variant="filled"
                className="bglight-ip"
                control={control}
                emitChange={(val: any) => setVictim(val)}
              />
            </div>
            {Number(victim) > 0 && (
              <div className="lease-input mb-3">
                <label className="tooltip-title relative">
                  Please provide the following details for each individual:
                </label>

                {individualData.map((i, index) => {
                  return (
                    <div key={index}>
                      <h3 className="f-18 bold mt-4 gray">
                        Victim {index + 1}
                      </h3>
                      <div className="row mt-3">
                        <div className="col-12 col-md-6 mb-4">
                          <div className="lease-input mb-4">
                            <label className="d-block">Name</label>
                            <TextField
                              sx={{ width: "100%" }}
                              value={i.name}
                              className="bglight-ip"
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                handleIndividualChange(
                                  index,
                                  event.target.value,
                                  "name"
                                );
                              }}
                            />
                          </div>
                          {individualErrors[index] && (
                            <span className="text-danger f-14">
                              {individualErrors[index].name}
                            </span>
                          )}
                        </div>
                        <div className="col-12 col-md-6 mb-4">
                          <div className="lease-input mb-4">
                            <label className="d-block">Surname</label>
                            <TextField
                              sx={{ width: "100%" }}
                              value={i.surname}
                              className="bglight-ip"
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                handleIndividualChange(
                                  index,
                                  event.target.value,
                                  "surname"
                                );
                              }}
                            />
                          </div>
                          {individualErrors[index] && (
                            <span className="text-danger f-14">
                              {individualErrors[index].surname}
                            </span>
                          )}
                        </div>
                        <div className="col-12 col-md-12 mb-4">
                          <div className="lease-input mb-4">
                            <label className="d-block">Relation to you</label>
                            <MaterialSelectField
                              options={relationArr}
                              className="bglight-select"
                              changeValue={handleChangeValue(i.relation)}
                              setChangeValue={(inputVal: any) => {
                                setRelation(inputVal.value);
                                handleIndividualChange(
                                  index,
                                  inputVal.value,
                                  "relation"
                                );
                              }}
                            />
                          </div>
                          {individualErrors[index] && (
                            <span className="text-danger f-14">
                              {individualErrors[index].relation}
                            </span>
                          )}
                        </div>
                        {individualData[index].relation == "Other" && (
                          <div className="col-12 col-md-12 mb-4">
                            <div className="lease-input mb-4">
                              <label className="tooltip-title relative">
                                Other{" "}
                              </label>
                              <TextField
                                sx={{ width: "100%" }}
                                value={i.otherRelation}
                                className="bglight-ip"
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  handleIndividualChange(
                                    index,
                                    event.target.value,
                                    "otherRelation"
                                  );
                                }}
                              />
                            </div>
                            {individualErrors[index] && (
                              <span className="text-danger f-14">
                                {individualErrors[index].otherRelation}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="col-12 col-md-12 mb-4">
                          <div className="lease-input mb-4">
                            <label className="tooltip-title relative">
                              Describe the damages they have suffered
                            </label>
                            <TextField
                              sx={{ width: "100%" }}
                              value={i.damage}
                              className="bglight-ip"
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                handleIndividualChange(
                                  index,
                                  event.target.value,
                                  "damage"
                                );
                              }}
                            />
                          </div>
                          {individualErrors[index] && (
                            <span className="text-danger f-14">
                              {individualErrors[index].damage}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {errors.err && (
                  <span className="text-danger">
                    Please provide the remaining indirect victims details
                  </span>
                )}
                <div className="text-end">
                  <Button
                    variant="primary"
                    size="sm"
                    className="green-btn"
                    onClick={handleAddVictim}
                    disabled={individualData.length == Number(victim)}
                  >
                    Add Victim
                  </Button>
                </div>
              </div>
            )}
            <div className="mb-3 radio-end-input mt-3">
              <label className="tooltip-title relative">
                Did any of the indirect victims live with you after the
                accident?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Indicate which indirect victim lived with you after the
                  accident.
                </span>
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={isVictimLive}
                  onChange={victimChange}
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
                {errors.victimErr && (
                  <span className="text-danger">
                    Please select, if indirect victims live with you after the
                    accident
                  </span>
                )}
              </FormControl>
            </div>
            {isVictimLive == "yes" && (
              <>
                <div className="lease-input mb-3">
                  <label className="tooltip-title relative">
                    Please select the names of those who lived with you and
                    specify the duration of caregiving for each:
                  </label>
                  <FormControl
                    sx={{ m: 1, width: 400, backgroundColor: "#d5eae0" }}
                  >
                    <Select
                      labelId="demo-multiple-name-label"
                      id="demo-multiple-name"
                      multiple
                      value={personName}
                      onChange={handleChange}
                      input={<OutlinedInput label="Name" />}
                      MenuProps={MenuProps}
                    >
                      {names.map((name) => (
                        <MenuItem
                          key={name}
                          value={name}
                          style={getStyles(name, personName, theme)}
                        >
                          {name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {errors.nameErr && (
                    <span className="text-danger">Please select</span>
                  )}
                </div>

                {personName.length > 0 && (
                  <div className="mb-3 radio-end-input mt-3">
                    <label className="tooltip-title relative">
                      For each selected individual, provide the following
                      details:
                    </label>
                    {personName.map((val, index) => {
                      return (
                        <div
                          key={index}
                          className="mb-3 p-2"
                          style={{ backgroundColor: "lightgrey" }}
                        >
                          <h5>Individual {index + 1}</h5>
                          <h6>Name and Surname: {val}</h6>

                          <div className="lease-input">
                            <label className="tooltip-title relative">
                              Duration of caregiving
                            </label>
                            <TextField
                              type="number"
                              sx={{ width: "100%" }}
                              value={careData[index]?.duration}
                              className="bglight-ip"
                              // className={`bglight-ip ${
                              //   !durationValid[index] ? "error" : ""
                              // }`}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                handleNumberChange(index, {
                                  name: val,
                                  duration: event.target.value,
                                });
                              }}
                            />
                          </div>

                          {/* {!durationValid[index] && (
                            <span className="text-danger">
                              Please enter a valid number.
                            </span>
                          )} */}

                          {careError[index] && (
                            <span className="text-danger f-14">
                              {careError[index].caregiving}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            <div className="mb-3 radio-end-input mt-3">
              <label className="tooltip-title relative">
                Has the insurance company made a claim proposal for you and/or
                Indirect Victims?
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={insurance}
                  onChange={handleInsurance}
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
                {errors.insuranceErr && (
                  <span className="text-danger">
                    Please select, if insurance company made a claim proposal
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
              // onClick={() => checkError()}
            >
              <span className="f-16"> Next</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default IndirectVictims;
