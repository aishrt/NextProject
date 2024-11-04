"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import SelectField from "@/components/Form/SelectField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormGroup } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import axios from "axios";

type FormValues = {
  date: string;
  other: string;
  employee: string;
  amount: number;
  claimBasedOn: string;
  sectorOfActivity: string;
  employeesCompanyHave: number;
};
const options = [
  { label: "A harmful act (delictual basis)", value: "harmfulAct" },
  {
    label: "A breach of contract (contractual basis)",
    value: "breachOfContract",
  },
];
const actoptions = [
  {
    label: "Admministration publique et organisation associatives",
    value: "adminstration",
  },
  { label: "Activités informatiques", value: "activitesInformatiques" },
  {
    label:
      "Activités juridiques et comptables, conseil et gestion des entreprises",
    value: "activitesJuridiques",
  },
  { label: "Agroalimentaire", value: "agroalimentaire" },
  {
    label: "Automobile, aéronautique et autres matériels de transport",
    value: "automobile",
  },
  { label: "Banques et assurances", value: "banquesEtAssurances" },
  { label: "Bois - papier - imprimerie", value: "boisPapier" },
  {
    label: "Chimie - caoutchouc - plastique",
    value: "chimie",
  },
  { label: "Commerce interentreprises", value: "commerceInterentreprises" },
  { label: "Communication et média", value: "CommunicationMedia" },
  { label: "Construction", value: "construction" },
  {
    label: "Distribution généraliste et spécialisée",
    value: "distributionSpecialisee",
  },
  {
    label: "Energie - eau - gestion des déchets ",
    value: "energie",
  },
  {
    label: "Equipements électriques et électroniques",
    value: "equipements",
  },
  {
    label: "Formation initiale et continue",
    value: "formation",
  },
  {
    label: "Hôtellerie - restauration - loisirs",
    value: "hotellerie",
  },
  { label: "Immobilier", value: "immobilier" },
  { label: "Industrie pharmaceutique", value: "industriePharmaceutique" },
  { label: "Ingénierie - R&D", value: "ingenierie" },
  { label: "Métalurgie - mécanique", value: "metalurgie" },
  {
    label: "Meuble, textile et autres industries manufacturières",
    value: "meuble",
  },
  { label: "Santé - action sociale", value: "sante" },
  {
    label: "Services divers aux entreprises - intermédiaires du recrutement",
    value: "services",
  },
  { label: "Télécoms", value: "telecoms" },
  { label: "Transports et logistique", value: "transports" },
  { label: "Other", value: "other" },
];

const schema = z.object({
  // date: z
  //   .string({ required_error: "Please select month" })
  //   .min(1, "Please select month"),
  // employee: z
  //   .string({ required_error: "Please enter Employee number" })
  //   .min(1, "Please enter Employee number"),
  // amount: z
  //   .string({ required_error: "Please enter Amount" })
  //   .min(1, "Please enter Amount"),

  claimBasedOn: z
    .string({ required_error: "Please select the claim" })
    .min(1, "Please select the claim"),

  sectorOfActivity: z
    .string({ required_error: "Please select the sector of activity" })
    .min(1, "Please select the sector of activity"),

  employeesCompanyHave: z
    .string({ required_error: "Please enter the number of employee" })
    .min(1, "Please enter the number of employee")
    .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed"),
});

const ClaimEvidence = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);

  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const [loadingData, setDataLoading] = useState(false);
  const router = useRouter();
  const [value, setValue] = React.useState("yes");
  const [valueNo, setValueNo] = React.useState("no");

  const [collectiveProcedure, setProcedure] = React.useState("");
  const [err, setErr] = React.useState(false);

  const [activitySector, setActivitySector] = React.useState("");
  // const [activityErr, setActivityErr] = React.useState(false);

  const [otherErr, setOtherErr] = useState(false);
  const [otherActivity, setOtherActivity] = useState("");

  const [evidenceSupport, setEvidenceSupport] = React.useState<string[]>([]);
  const [evidenceErr, setEvidenceErr] = useState(false);

  const [financialLosses, setFinancial] = React.useState<string[]>([]);
  const [financialErr, setFinancialErr] = useState(false);

  const [revenueErr, setRevenueErr] = useState(false);
  const [revenueAmount, setRevenue] = useState("");

  const [grossErr, setGrossErr] = useState(false);
  const [grossMarginAmount, setGross] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const handleChangeNo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueNo((event.target as HTMLInputElement).value);
  };

  let evidenceArr: any = [
    {
      label: "Expert analysis submitted for consideration",
      value: "expertAnalysis",
    },
    {
      label: "Court-ordered expert analysis",
      value: "courtOrdered",
    },
    {
      label: "Bailiff's report",
      value: "bailiffReport",
    },
    {
      label: "Statements in favor of your company",
      value: "favorStatements",
    },

    {
      label: "Statements against your company",
      value: "againstStatements",
    },

    {
      label: "Conflicting results in the expert reports",
      value: "conflicting",
    },
  ];

  let financialArr: any = [
    {
      label: "Loss of revenue",
      value: "lossOfRevenue",
    },
    {
      label: "Loss of gross margin",
      value: "lossOfGrossMargin",
    },
  ];
  const handleEvidence = (label: number) => {
    setEvidenceSupport((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.evidenceErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const handleFinancial = (label: number) => {
    setFinancial((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.financialErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const [errors, setErrors] = useState({
    err: false,
    otherErr: false,
    evidenceErr: false,
    financialErr: false,
    revenueErr: false,
    grossErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!collectiveProcedure) {
      isError = true;
      errorObj = { ...errorObj, err: true };
    }

    if (activitySector == "other" && !otherActivity) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }
    if (evidenceSupport.length == 0) {
      isError = true;
      errorObj = { ...errorObj, evidenceErr: true };
    }
    if (financialLosses.length == 0) {
      isError = true;
      errorObj = { ...errorObj, financialErr: true };
    }

    if (financialLosses.includes("lossOfRevenue") && !revenueAmount) {
      isError = true;
      errorObj = { ...errorObj, revenueErr: true };
    }

    if (financialLosses.includes("lossOfGrossMargin") && !grossMarginAmount) {
      isError = true;
      errorObj = { ...errorObj, grossErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }

    return isError;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setDataLoading(true);
      if (errHandle()) {
        return;
      }
      const { data } = await axios.post(
        "/api/client/category/unfair/createUnfair",
        {
          caseId: caseId,
          ...values,
          collectiveProcedure,
          otherActivity,
          evidenceSupport,
          financialLosses,
          revenueAmount,
          grossMarginAmount,
          progress: 70,
        }
      );
      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "80");
      router.push(
        `/client/unfair-claim-assessment-form?${searchParam.toString()}`
      );
      setDataLoading(false);
    } catch (err) {
      console.log(err);
      setDataLoading(false);
    } finally {
      setDataLoading(false);
    }
  };
  const regex = /^\d+(\.\d+)?$/;

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
              <h6 className="f-26  fw-400 pb-3"> Your Claim and Evidence</h6>

                <div className="row">
                  <div className="col-12 col-md-6 mb-4 represent-form">
                    <div className="lease-input mt-4">
                      <label className="relative">
                        Is your claim based on:
                      </label>
                      <SelectField
                        options={options}
                        label=""
                        name="claimBasedOn"
                        className="bglight-select"
                        error={formState.errors["claimBasedOn"]}
                        control={control}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4 mt-4">
                    <label className="d-block">
                      Is there an ongoing collective procedure against your
                      company?
                    </label>

                    <div>
                      <div className="buttons-row d-flex gap-3">
                        <Button
                          // variant={useClause == true ? "contained" : "white"}
                          variant="outline"
                          size="lg"
                          value="yes"
                          className={
                            collectiveProcedure == "yes"
                              ? "bg-black text-white"
                              : ""
                          }
                          onClick={() => {
                            setProcedure("yes");

                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.err = false;
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
                            collectiveProcedure == "no"
                              ? "bg-black text-white"
                              : ""
                          }
                          onClick={() => {
                            setProcedure("no");
                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.err = false;
                              return newErrorObj;
                            });
                          }}
                        >
                          No
                        </Button>
                      </div>

                      <div>
                        {errors.err && (
                          <span className="text-danger">
                            Please select the collective procedure{" "}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mt-4">
                      <label className="relative">
                        {`What is your company's sector of activity?`}
                      </label>
                      <SelectField
                        options={actoptions}
                        label=""
                        name="sectorOfActivity"
                        className="bglight-select"
                        error={formState.errors["sectorOfActivity"]}
                        control={control}
                        emitChange={(val: any)=> setActivitySector(val)}
                      />
                    </div>

                    {activitySector == "other" && (
                      <div className="lease-input mt-4">
                        <label>Others:</label>
                        {/* <InputField
                          error={formState.errors["other"]}
                          label="Others"
                          name="other"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        /> */}

                        <TextField
                          fullWidth
                          id="filled-basic"
                          label="Other"
                          variant="filled"
                          value={otherActivity}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setOtherActivity(event.target.value);
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
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input mt-4">
                      <label className="tooltip-title relative">
                        How many employees does your company have?
                      </label>
                      <InputField
                        error={formState.errors["employeesCompanyHave"]}
                        label=""
                        name="employeesCompanyHave"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="radio-end-input">
                      <label className="d-block">
                        What evidence do you have to support your claim?
                      </label>
                      <div className="webclick">
                        <FormGroup>
                          {evidenceArr.map((i: any, index: number) => {
                            return (
                              <FormControlLabel
                                key={index}
                                className="radio-light-ip"
                                control={<Checkbox />}
                                label={i.label}
                                onChange={() => handleEvidence(i.value)}
                              />
                            );
                          })}

                          {errors.evidenceErr && (
                            <span className="text-danger">
                              Please select the evidence support
                            </span>
                          )}
                        </FormGroup>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="radio-end-input">
                      <label className="d-block">
                        Have you experienced financial losses?
                      </label>
                      <div className="webclick">
                        <FormGroup>
                          {financialArr.map((i: any, index: number) => {
                            return (
                              <FormControlLabel
                                key={index}
                                className="radio-light-ip"
                                control={<Checkbox />}
                                label={i.label}
                                onChange={() => handleFinancial(i.value)}
                              />
                            );
                          })}

                          {errors.financialErr && (
                            <span className="text-danger">
                              Please select the financial experience
                            </span>
                          )}
                        </FormGroup>
                      </div>

                      {financialLosses.includes("lossOfRevenue") && (
                        <div className="lease-input mt-4">
                          <label className="tooltip-title relative">
                            Loss of revenue (EUR):
                          </label>
                          {/* <NumberField
                            error={formState.errors["amount"]}
                            label="Loss of revenue (EUR):"
                            name="amount"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          /> */}

                          <TextField
                            fullWidth
                            id="filled-basic"
                            label="Loss of revenue (EUR):"
                            variant="filled"
                            value={revenueAmount}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setRevenue(event.target.value);
                              setErrors((prev) => {
                                let newErrorObj = { ...prev };
                                newErrorObj.revenueErr = false;
                                return newErrorObj;
                              });
                            }}
                          />
                          {errors.revenueErr && (
                            <div>
                              <span className="text-danger">
                                Please enter the revenue amount
                              </span>
                            </div>
                          )}

                          {!errors.revenueErr &&
                            revenueAmount &&
                            !regex.test(revenueAmount) && (
                              <div>
                                <span className="text-danger">
                                  Only digits are allowed
                                </span>
                              </div>
                            )}
                        </div>
                      )}

                      {financialLosses.includes("lossOfGrossMargin") && (
                        <div className="lease-input mt-4">
                          <label className="tooltip-title relative">
                            Loss of gross margin (EUR):
                          </label>
                          {/* <NumberField
                            error={formState.errors["amount"]}
                            label="Loss of gross margin (EUR):"
                            name="amount"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          /> */}

                          <TextField
                            fullWidth
                            id="filled-basic"
                            label="Loss of gross margin (EUR):"
                            variant="filled"
                            value={grossMarginAmount}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setGross(event.target.value);
                              setErrors((prev) => {
                                let newErrorObj = { ...prev };
                                newErrorObj.grossErr = false;
                                return newErrorObj;
                              });
                            }}
                          />
                          {errors.grossErr && (
                            <div>
                              <span className="text-danger">
                                Please enter the gross margin amount
                              </span>
                            </div>
                          )}

                          {!errors.grossErr &&
                            grossMarginAmount &&
                            !regex.test(grossMarginAmount) && (
                              <div>
                                <span className="text-danger">
                                  Only digits are allowed
                                </span>
                              </div>
                            )}
                        </div>
                      )}
                    </div>
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
                        <span className="f-16">Save and Continue</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="next-btn f-16"
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

export default ClaimEvidence;
