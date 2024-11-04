"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import SelectField from "@/components/Form/SelectField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormControl, FormGroup, Radio, RadioGroup } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import TextField from "@mui/material/TextField";
import axios from "axios";

type FormValues = {
  numberOfDefendants: number;
  defendantActivity: string;
  empDefendantCompanyHave: number;
};

const options = [
  {
    label: "Admministration publique et organisation associatives",
    value: "adminstration",
  },
  { label: "Activités informatiques", value: "ActivitesInformatiques" },
  {
    label:
      "Activités juridiques et comptables, conseil et gestion des entreprises",
    value: "ActiviesJuridiques",
  },
  { label: "Agroalimentaire", value: "Agroalimentaire" },
  {
    label: "Automobile, aéronautique et autres matériels de transport",
    value: "Automobile",
  },
  { label: "Banques et assurances", value: "BanquesAssurances" },
  { label: "Bois - papier - imprimerie", value: "BoisPapier" },
  {
    label: "Chimie - caoutchouc - plastique",
    value: "Chimie",
  },
  { label: "Commerce interentreprises", value: "CommerceInterentreprises" },
  { label: "Communication et média", value: "CommunicationEtMedia" },
  { label: "Construction", value: "Construction" },
  {
    label: "Distribution généraliste et spécialisée",
    value: "Distribution",
  },
  {
    label: "Energie - eau - gestion des déchets ",
    value: "Energie ",
  },
  {
    label: "Equipements électriques et électroniques",
    value: "Equipements",
  },
  {
    label: "Formation initiale et continue",
    value: "FormationInitiable",
  },
  {
    label: "Hôtellerie - restauration - loisirs",
    value: "Hotellerie",
  },
  { label: "Immobilier", value: "Immobilier" },
  { label: "Industrie pharmaceutique", value: "IndustriePharmaceutique" },
  { label: "Ingénierie - R&D", value: "IngenierieR&D" },
  { label: "Métalurgie - mécanique", value: "Metalurgie" },
  {
    label: "Meuble, textile et autres industries manufacturières",
    value: "Meuble",
  },
  { label: "Santé - action sociale", value: "Sante" },
  {
    label: "Services divers aux entreprises - intermédiaires du recrutement",
    value: "ServicesDivers",
  },
  { label: "Télécoms", value: "Telecoms" },
  { label: "Transports et logistique", value: "TransportsEtLogistique" },
  { label: "Other", value: "other" },
];
const schema = z.object({
  numberOfDefendants: z
    .number({ required_error: "Please enter number of defendants" })
    .min(1, "Please enter number of defendants"),
  defendantActivity: z
    .string({ required_error: "Please select the sector of activity" })
    .min(1, "Please select the sector of activity"),

  empDefendantCompanyHave: z
    .number({
      required_error: "Please enter number of defendants company have",
    })
    .min(1, "Please enter number of defendants company have"),
});

const AccusedCompany = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const [loadingData, setDataLoading] = useState(false);
  const router = useRouter();
  const [isAccusedCompanyLinked, setAccusedCompany] = React.useState("");
  const [accuseErr, setAccuserErr] = useState(false);

  const [valueNo, setValueNo] = React.useState("no");

  const [otherErr, setOtherErr] = useState(false);
  const [otherDefendantActivity, setOtherDefendantActivity] = useState("");
  const [activityVal, setActivityVal] = useState("");

  const [workErr, setWorkErr] = useState(false);
  const [stillWorking, setStillWorking] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAccusedCompany((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.accuseErr = false;
      return newErrorObj;
    });
  };
  const handleChangeNo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueNo((event.target as HTMLInputElement).value);
  };

  const [errors, setErrors] = useState({
    otherErr: false,
    accuseErr: false,
    workErr,
  });
  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (
      activityVal == "other" &&
      !otherDefendantActivity
    ) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }
    if (!isAccusedCompanyLinked) {
      isError = true;
      errorObj = { ...errorObj, accuseErr: true };
    }
    if (
      (isAccusedCompanyLinked == "employee" ||
        isAccusedCompanyLinked == "executive" ||
        isAccusedCompanyLinked == "partner") &&
      !stillWorking
    ) {
      isError = true;
      errorObj = { ...errorObj, workErr: true };
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

      const { data } = await axios.post(
        "/api/client/category/unfair/createUnfair",
        {
          caseId: caseId,
          ...values,
          otherDefendantActivity,
          isAccusedCompanyLinked,
          stillWorking,
          progress: 80,
        }
      );
      console.log(data);

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "90");
      router.push(
        `/client/unfair-claim-assessment-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      {loadingData ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : (
        <>
          <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
            <div className="row mt-2">
              <div className="col-12 col-md-12 mb-3">
              <h6 className="f-26  fw-400 pb-3"> 
                  About the Accused Company or Individual(s)
                </h6>

                <div className="row">
                  <div className="col-12 col-md-6 mb-4 defendant">
                    <div className="lease-input mt-4">
                      <label>How many defendants are there?</label>
                      <NumberField
                        error={formState.errors["numberOfDefendants"]}
                        label="How many defendants are there?"
                        name="numberOfDefendants"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mt-4">
                      <label className="relative">
                        {`What is the defendant company's sector of activity?`}
                      </label>
                      <SelectField
                        options={options}
                        label=""
                        name="defendantActivity"
                        className="bglight-select"
                        error={formState.errors["defendantActivity"]}
                        control={control}
                        emitChange={(val: any) => setActivityVal(val)}
                      />
                    </div>
                    {activityVal == "other" && (
                      <div className="lease-input mt-4">
                        <label>Other:</label>
                        <TextField
                          fullWidth
                          id="filled-basic"
                          label="Other"
                          variant="filled"
                          value={otherDefendantActivity}
                          sx={{ backgroundColor: "#d5eae0" }}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setOtherDefendantActivity(event.target.value);
                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.otherErr = false;
                              return newErrorObj;
                            });
                          }}
                        />
                        {errors.otherErr && (
                          <div>
                            <span className="text-danger">
                              Please describe the other statement
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-4 defendant">
                    <div className="lease-input mt-4">
                      <label>
                        {`How many employees does the defendant's company have?`}{" "}
                      </label>
                      <NumberField
                        error={formState.errors["empDefendantCompanyHave"]}
                        label="How many defendants are there?"
                        name="empDefendantCompanyHave"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4 mt-4">
                    <div className="business-radio">
                      <FormControl className="w-100">
                        <label>
                          Is the accused company linked to you by a former
                          employee, executive, or partner?
                        </label>
                        <RadioGroup
                          className="w-100"
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={isAccusedCompanyLinked}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            className="radio-light-ip"
                            value="employee"
                            control={<Radio />}
                            label="Yes, by an employee or former employee"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="executive"
                            control={<Radio />}
                            label="Yes, by an executive or former executive"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="partner"
                            control={<Radio />}
                            label="Yes, by a partner or former partner"
                          />
                          <FormControlLabel
                            className="radio-light-ip"
                            value="no"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>
                        {errors.accuseErr && (
                          <span className="text-danger">
                            {" "}
                            Please choose the accused company linked
                          </span>
                        )}
                      </FormControl>
                    </div>

                    {(isAccusedCompanyLinked == "employee" ||
                      isAccusedCompanyLinked == "executive" ||
                      isAccusedCompanyLinked == "partner") && (
                        <div className="mt-4 accused-cmpny">
                          <label className="d-block">
                            Was the company created while the employee, executive,
                            or partner was still working for you?
                          </label>

                          <div>
                            <div className="buttons-row d-flex gap-3">
                              <Button
                                // variant={useClause == true ? "contained" : "white"}
                                variant="outline"
                                size="lg"
                                value="yes"
                                className={
                                  stillWorking == "yes"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setStillWorking("yes");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.workErr = false;
                                    return newErrorObj;
                                  });
                                }}
                              >
                                Yes
                              </Button>
                              <Button
                                // variant={useClause == false ? "contained" : "white"}
                                variant="outline"
                                value="no"
                                size="lg"
                                className={
                                  stillWorking == "no"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setStillWorking("no");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.workErr = false;
                                    return newErrorObj;
                                  });
                                }}
                              >
                                No
                              </Button>
                            </div>

                            <div>
                              {errors.workErr && (
                                <span className="text-danger">
                                  Please let us know, employee, executive, or
                                  partner was still working for you
                                </span>
                              )}{" "}
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-md-12 mt-4">
                    <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
                      <Button
                        type="submit"
                        variant="contained"
                        className="client-btn"
                        size="lg"
                        onClick={() => errHandle()}
                      >
                        <span className="f-16">Submit</span>
                      </Button>
                      <Button
                        type="submit"
                        variant="outline"
                        size="lg"
                        className="next-btn f-16"
                      
                        onClick={() => errHandle()}
                      >
                        <span className="f-16">Save</span>
                      </Button>
                      <Button
                         variant="contained"
                         className="client-btn"
                         size="lg"
                        onClick={() => router.push("/client/cases-list?type=preLitigation")}
                      >
                        <span className="f-16">Exit</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default AccusedCompany;
