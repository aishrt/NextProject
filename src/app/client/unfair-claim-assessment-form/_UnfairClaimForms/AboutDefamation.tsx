"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import DateField from "@/components/Form/DateField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FormGroup } from "@mui/material";
import Image from "next/image";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { InputField } from "@/components/Form/InputField";
import TextField from "@mui/material/TextField";
import axios from "axios";

type FormValues = {
  describeDefameStatement: string;
};

const createSchema = (isDefamation: boolean): z.ZodSchema => {
  return z.object({
    describeDefameStatement: isDefamation
      ? z
        .string({ required_error: "Please describe the defame statement" })
        .min(1, "Please describe the defame statement")
      : z.string().optional(),
  });
};

const AboutDefamation = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");
  const [defamatoryStatement, setDefamatoryStatement] = React.useState("");
  const [unfairData, setUnfairData] = useState<any>({});
  const [isDefamation, setIsDefamation] = useState(false);

  const { methods, setValues } = useHookForm<FormValues>(
    createSchema(isDefamation)
  );
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const [loadingData, setDataLoading] = useState(false);
  const router = useRouter();
  const [valueAbout, setValueAbout] = React.useState("company");

  const [defameStatementMade, setDefameStatement] = React.useState<string[]>(
    []
  );

  const [legalAction, setLegalAction] = useState("");
  const [statements, setStatement] = useState("");
  const [isCompanyName, setCompany] = useState("");

  const [otherDefameStatement, setOtherDefameStatement] = useState("");

  let defameStatemnt: any = [
    {
      label: "Mail (postal or email)",
      value: "mail",
    },
    {
      label: "Billboards",
      value: "billboards",
    },
    {
      label: "TV ads",
      value: "tvAds",
    },
    {
      label: "Website",
      value: "website",
    },

    {
      label: "Social media",
      value: "socialMedia",
    },

    {
      label: "Phone calls",
      value: "phoneCalls",
    },

    {
      label: "Door-to-door",
      value: "doorToDoor",
    },

    {
      label: "Other",
      value: "other",
    },
  ];

  useEffect(() => {
    if (defamatoryStatement == "company" || defamatoryStatement == "products") {
      setIsDefamation(true);
    } else {
      setIsDefamation(false);
    }
  }, [defamatoryStatement]);

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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDefamatoryStatement((event.target as HTMLInputElement).value);
    console.log(event.target.value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.defameErr = false;
      return newErrorObj;
    });
  };
  const handleChangeAbout = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueAbout((event.target as HTMLInputElement).value);
  };

  const [errors, setErrors] = useState({
    defameErr: false,
    defameStateErr: false,
    otherErr: false,
    legalErr: false,
    statemntErr: false,
    companyErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!defamatoryStatement) {
      isError = true;
      errorObj = { ...errorObj, defameErr: true };
    }

    if (defameStatementMade.length == 0) {
      isError = true;
      errorObj = { ...errorObj, defameStateErr: true };
    }

    if (defameStatementMade.includes("other") && !otherDefameStatement) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }

    if (!legalAction) {
      isError = true;
      errorObj = { ...errorObj, legalErr: true };
    }
    if (!statements) {
      isError = true;
      errorObj = { ...errorObj, statemntErr: true };
    }

    if (!isCompanyName) {
      isError = true;
      errorObj = { ...errorObj, companyErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }

    return isError;
  };

  const conditonalProgress = (data: any): string => {
    let progress = "";
    if (
      data.practiceKind.includes("customerDiversion") ||
      data.practiceKind.includes("systematic")
    ) {
      return progress = "40"
    }
    else if (
      data.websitePractice?.includes("copyingContent") ||
      data.websitePractice?.includes("sellingSimilar")
    ) {
      return progress = "50"
    }
    else if (data.practiceOccur !== "practiceNotOccur") {
      return progress = "60"
    }
    else {
      return progress = "70"
    }
  }

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
          defamatoryStatement,
          defameStatementMade,
          otherDefameStatement,
          legalAction,
          statements,
          isCompanyName,
          progress: 30,
        }
      );

      if (data && data.data) {
        const newProgress = conditonalProgress(data.data)
        let id = data.data.caseId;
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", newProgress);

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
  console.log(formState.errors, "errors");
  const handleDefame = (label: number) => {
    setDefameStatement((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.defameStateErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
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
              <h6 className="f-26  fw-400 pb-3"> About the Defamation</h6>

                <div className="row">
                  <div className="col-12 col-md-6 mb-4">
                    <div className="radio-end-input">
                      <label className="d-block">
                        Who or what was the subject of the defamatory
                        statements?
                      </label>
                      <div className="business-radio">
                        <FormControl className="w-100">
                          <RadioGroup
                            className="w-100"
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={defamatoryStatement}
                            onChange={handleChange}
                          >
                            <FormControlLabel
                              className="radio-light-ip"
                              value="company"
                              control={<Radio />}
                              label="My company"
                            />
                            <FormControlLabel
                              className="radio-light-ip"
                              value="individual"
                              control={<Radio />}
                              label="An individual"
                            />
                            <FormControlLabel
                              className="radio-light-ip"
                              value="products"
                              control={<Radio />}
                              label="My products/services"
                            />
                          </RadioGroup>
                          {errors.defameErr && (
                            <span className="text-danger">
                              Please select the defametory statement
                            </span>
                          )}
                        </FormControl>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    {(defamatoryStatement == "company" ||
                      defamatoryStatement == "products") && (
                        <div className="radio-end-input">
                          <label className="d-block">
                            Briefly describe the statements :
                          </label>
                          {/* <div className="business-radio">
                        <FormControl className="w-100">
                          <RadioGroup
                            className="w-100"
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={valueAbout}
                            onChange={handleChangeAbout}
                          >
                            <FormControlLabel
                              className="radio-light-ip"
                              value="company"
                              control={<Radio />}
                              label="My company"
                            />

                            <FormControlLabel
                              className="radio-light-ip"
                              value="indivisual"
                              control={<Radio />}
                              label="My products/services"
                            />
                          </RadioGroup>
                        </FormControl>
                      </div> */}
                          <InputField
                            error={formState.errors["describeDefameStatement"]}
                            label="Describe the statement"
                            name="describeDefameStatement"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      )}
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="radio-end-input">
                      <label className="d-block">
                        How were the defamatory statements made?
                      </label>
                      <div className="webclick">
                        <FormGroup>
                          {defameStatemnt.map((i: any, index: number) => {
                            return (
                              <FormControlLabel
                                key={index}
                                className="radio-light-ip"
                                control={<Checkbox />}
                                label={i.label}
                                onChange={() => handleDefame(i.value)}
                              />
                            );
                          })}

                          {errors.defameStateErr && (
                            <span className="text-danger">
                              Please select the defamatory statements
                            </span>
                          )}
                        </FormGroup>
                      </div>
                    </div>
                    {defameStatementMade.includes("other") && (
                      <div className="lease-input mt-4">
                        {/* <InputField
                          error={formState.errors["otherDefameStatement"]}
                          label="Other"
                          name="otherDefameStatement"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        /> */}
                        <TextField
                          id="filled-basic"
                          label="Other"
                          className="bglight-ip w-100"
                          variant="filled"
                          value={otherDefameStatement}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>
                          ) => {
                            setOtherDefameStatement(event.target.value);
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
                              Please describe the other defame statement
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <label className="d-block">
                      Do the statements relate to a legal action that resulted
                      in a conviction?
                    </label>
                    <div>
                      <div className="buttons-row d-flex gap-3">
                        <Button
                          //  variant={legalAction == 'yes' ? "contained" : "outline"}
                          variant="outline"
                          size="lg"
                          value="yes"
                          className={
                            legalAction == "yes" ? "bg-black text-white " : ""
                          }
                          onClick={() => {
                            setLegalAction("yes");
                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.legalErr = false;
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
                            legalAction == "no" ? "bg-black text-white" : ""
                          }
                          onClick={() => {
                            setLegalAction("no");
                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.legalErr = false;
                              return newErrorObj;
                            });
                          }}
                        >
                          No
                        </Button>
                      </div>
                      <div>
                        {errors.legalErr && (
                          <span className="text-danger">This is required </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <label className="d-block">Are the statements false?</label>
                    <div>
                      <div className="buttons-row d-flex gap-3">
                        <Button
                          // variant={useClause == true ? "contained" : "white"}
                          variant="outline"
                          size="lg"
                          value="yes"
                          className={
                            statements == "yes" ? "bg-black text-white" : ""
                          }
                          onClick={() => {
                            setStatement("yes");
                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.statemntErr = false;
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
                            statements == "no" ? "bg-black text-white" : ""
                          }
                          onClick={() => {
                            setStatement("no");
                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.statemntErr = false;
                              return newErrorObj;
                            });
                          }}
                        >
                          No
                        </Button>
                      </div>
                      <div>
                        {errors.statemntErr && (
                          <span className="text-danger">This is required </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <label className="d-block">
                      Is your company named in the statement?
                    </label>

                    <div>
                      <div className="buttons-row d-flex gap-3">
                        <Button
                          // variant={useClause == true ? "contained" : "white"}
                          variant="outline"
                          size="lg"
                          value="yes"
                          className={
                            isCompanyName == "yes" ? "bg-black text-white" : ""
                          }
                          onClick={() => {
                            setCompany("yes");
                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.companyErr = false;
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
                            isCompanyName == "no" ? "bg-black text-white" : ""
                          }
                          onClick={() => {
                            setCompany("no");
                            setErrors((prev) => {
                              let newErrorObj = { ...prev };
                              newErrorObj.companyErr = false;
                              return newErrorObj;
                            });
                          }}
                        >
                          No
                        </Button>
                      </div>
                      <div>
                        {errors.companyErr && (
                          <span className="text-danger">This is required </span>
                        )}
                      </div>
                    </div>
                  </div>
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
                        onClick={()=>router.push('/client/cases-list?type=preLitigation')}
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

export default AboutDefamation;
