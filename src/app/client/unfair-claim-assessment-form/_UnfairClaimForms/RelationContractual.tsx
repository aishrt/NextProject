"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

type FormValues = {
  date: string;
  other: string;
  employee: string;
  amount: number;
  contract: string;
};

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
});
const options = [
  { label: "Employment contract", value: "employmentContract" },
  { label: "Distribution contract", value: "distributionContract" },
  { label: "Franchise contract", value: "franchiseContract" },
  { label: "Manufacturing contract", value: "manufacturingContract" },
  { label: "Commercial agent contract", value: "commercialContract" },
  { label: "Other", value: "other" },
];
const RelationContractual = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const [loadingData, setDataLoading] = useState(false);
  const router = useRouter();
  const [value, setValue] = React.useState("yes");
  const [valueNo, setValueNo] = React.useState("no");

  const [contractWithCompetingCompany, setContract] = React.useState("");
  const [err, setErr] = React.useState(false);

  const [typeOfContract, setTypeOfContract] = React.useState("");
  const [contractErr, setContractErr] = React.useState(false);

  const [otherErr, setOtherErr] = useState(false);
  const [otherContract, setOtherContract] = useState("");

  const [clauseErr, setClauseErr] = useState(false);
  const [contractIncludeClause, setContractClause] = useState("");

  const [situationErr, setSituationErr] = useState(false);
  const [competitiveSituation, setSituation] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  const handleChangeNo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueNo((event.target as HTMLInputElement).value);
  };

  const [errors, setErrors] = useState({
    err: false,
    contractErr: false,
    otherErr: false,
    clauseErr: false,
    situationErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!contractWithCompetingCompany) {
      isError = true;
      errorObj = { ...errorObj, err: true };
      //   return setErr(true);
    }

    if (contractWithCompetingCompany == "yes" && !typeOfContract) {
      isError = true;
      errorObj = { ...errorObj, contractErr: true };
    }

    if (typeOfContract == "other" && !otherContract) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }

    if (contractWithCompetingCompany == "yes" && !contractIncludeClause) {
      isError = true;
      errorObj = { ...errorObj, clauseErr: true };
    }
    if (contractWithCompetingCompany == "yes" && !competitiveSituation) {
      isError = true;
      errorObj = { ...errorObj, situationErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }

    return isError;
  };

  const handleType = (event: any, newValue: any) => {
    setTypeOfContract(newValue.value);

    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.contractErr = false;
      return newErrorObj;
    });
  };
  const [unfairData, setUnfairData] = useState<any>({});

  useEffect(() => {
    const getCaseById = async () => {
      try {
        setLoading(true);
        if (caseId) {
          const { data } = await axios.get(
            `/api/client/category/unfair/getUnfair?caseId=${caseId}`
          );
          setUnfairData(data.data);
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
          contractWithCompetingCompany,
          typeOfContract,
          otherContract,
          contractIncludeClause,
          competitiveSituation,
          progress: 60,
        }
      );
      if (data && data.data) {
        let id = data.data.caseId;
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "70");
        router.push(
          `/client/unfair-claim-assessment-form?${searchParam.toString()}`
        );
      }

      setDataLoading(false);
    } catch (err) {
      console.log(err);
      setDataLoading(false);
    } finally {
      setDataLoading(false);
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
                  Relationship and Contractual Information
                </h6>

                <div className="row">
                  <div className="col-12 col-md-6 mb-4">
                    <label className="d-block">
                      Do you have a contract with the competing company?
                    </label>

                    <div>
                      <div className="buttons-row d-flex gap-3">
                        <Button
                          // variant={useClause == true ? "contained" : "white"}
                          variant="outline"
                          size="lg"
                          value="yes"
                          className={
                            contractWithCompetingCompany == "yes"
                              ? "bg-black text-white"
                              : ""
                          }
                          onClick={() => {
                            setContract("yes");
                            //setErr(false);
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
                            contractWithCompetingCompany == "no"
                              ? "bg-black text-white"
                              : ""
                          }
                          onClick={() => {
                            setContract("no");
                            // setErr(false);
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
                      {errors.err && (
                        <span className="text-danger">
                          Please select the this field
                        </span>
                      )}
                    </div>
                    {contractWithCompetingCompany == "yes" && (
                      <div className="lease-input mt-4 represent-form">
                        <label className="relative">
                          What type of contract?
                        </label>
                        {/* <SelectField
                          options={options}
                          label=""
                          name="contract"
                          className="bglight-select"
                          error={formState.errors["contract"]}
                          control={control}
                        /> */}

                        <Autocomplete
                          disablePortal
                          id="combo-box-demo"
                          options={options}
                          sx={{ width: 430, backgroundColor: "#d5eae0" }}
                          renderInput={(params) => (
                            <TextField {...params} label="" />
                          )}
                          onChange={handleType}
                        />
                        {errors.contractErr && (
                          <span className="text-danger">
                            Please select the type of contract
                          </span>
                        )}
                      </div>
                    )}
                    {typeOfContract == "other" &&
                      contractWithCompetingCompany == "yes" && (
                        <div className="lease-input mt-4">
                          <label>Other:</label>
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
                            value={otherContract}
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setOtherContract(event.target.value);
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

                  {contractWithCompetingCompany == "yes" && (
                    <>
                      <div className="col-12 col-md-6 mb-4">
                        <label className="d-block">
                          Does the contract include a non-compete clause?
                        </label>

                        <div>
                          <div className="buttons-row d-flex gap-3">
                            <Button
                              // variant={useClause == true ? "contained" : "white"}
                              variant="outline"
                              size="lg"
                              value="yes"
                              className={
                                contractIncludeClause == "yes"
                                  ? "bg-black text-white"
                                  : ""
                              }
                              onClick={() => {
                                setContractClause("yes");
                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.clauseErr = false;
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
                                contractIncludeClause == "no"
                                  ? "bg-black text-white"
                                  : ""
                              }
                              onClick={() => {
                                setContractClause("no");
                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.clauseErr = false;
                                  return newErrorObj;
                                });
                              }}
                            >
                              No
                            </Button>
                          </div>
                          <div>
                            {errors.clauseErr && (
                              <span className="text-danger">
                                This is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-12 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            Are you and the competing company in a competitive
                            situation?
                          </label>
                          <div>
                            <div className="buttons-row d-flex gap-3">
                              <Button
                                // variant={useClause == true ? "contained" : "white"}
                                variant="outline"
                                size="lg"
                                value="yes"
                                className={
                                  competitiveSituation == "yes"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setSituation("yes");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.situationErr = false;
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
                                  competitiveSituation == "no"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setSituation("no");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.situationErr = false;
                                    return newErrorObj;
                                  });
                                }}
                              >
                                No
                              </Button>
                            </div>

                            <div>
                              {errors.situationErr && (
                                <span className="text-danger">
                                  This is required
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

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

export default RelationContractual;
