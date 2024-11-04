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
import bubble from "@/assets/info.png";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import axios from "axios";
import TextField from "@mui/material/TextField";

type FormValues = {
  date: string;
  other: string;
  employee: string;
  amount: number;
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

const ConfusionParasitism = () => {
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

  const [experiencingConfusion, setConfusion] = React.useState("");
  const [err, setErr] = React.useState(false);

  const [kindOfConfusion, setConfusionKind] = React.useState<string[]>([]);
  const [confusionErr, setConfusionErr] = useState(false);

  const [categoryOfTangible, setTangible] = React.useState<string[]>([]);
  const [tangibleErr, setTangibleErr] = useState(false);

  const [otherErr, setOtherErr] = useState(false);
  const [otherTangible, setOtherTangible] = useState("");

  const [similarities, setSimilarities] = React.useState<string[]>([]);
  const [similarityErr, setsimilarityErr] = useState(false);

  const [otherSimilarErr, setOtherSimilarErr] = useState(false);
  const [otherSimilarities, setOtherSimilarities] = useState("");

  const [paraErr, setParaErr] = useState(false);
  const [experiencingParasitism, setexperiencing] = useState("");

  const [demoErr, setDemoErr] = useState(false);
  const [demonstrateInvestments, setDemonstrate] = useState("");

  const [investmentErr, setInvestmntErr] = useState(false);
  const [investmentAmount, setInvestment] = useState("");

  const [competitorErr, setCompetitorErr] = useState(false);
  const [competitorViolated, setCompetitor] = useState("");

  let confusionArr: any = [
    {
      label: "Tangible goods (physical products)",
      value: "tangible",
    },
    {
      label: "Intangible goods (services, branding, etc.)",
      value: "intangible",
    },
  ];

  let tangible: any = [
    {
      label: "Leather goods",
      value: "leather",
    },
    {
      label: "Apparel/jewelry",
      value: "apparel",
    },

    {
      label: "Footwear",
      value: "footwear",
    },

    {
      label: "Furniture",
      value: "furniture",
    },

    {
      label: "Beauty products",
      value: "beautyProducts",
    },

    {
      label: "Electronics",
      value: "electronics",
    },

    {
      label: "Other",
      value: "other",
    },
  ];

  let similarityArr: any = [
    {
      label: "Colors",
      value: "colors",
    },
    {
      label: "Shapes",
      value: "shapes",
    },

    {
      label: "Materials",
      value: "materials",
    },

    {
      label: "Layout",
      value: "layout",
    },

    {
      label: "Packaging",
      value: "packaging",
    },

    {
      label: "Product range",
      value: "productRange",
    },

    {
      label: "Name",
      value: "name",
    },

    {
      label: "Marketing elements",
      value: "marketingElements",
    },
    {
      label: "Motifs",
      value: "motifs",
    },
    {
      label: "Other",
      value: "other",
    },
  ];

  const handleConfusion = (label: number) => {
    setConfusionKind((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.confusionErr = false;
        return newErrorObj;
      });

      return updatedCategories;
    });
  };

  const handleTangible = (label: number) => {
    setTangible((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.tangibleErr = false;
        return newErrorObj;
      });

      return updatedCategories;
    });
  };

  const handleSimilarity = (label: number) => {
    setSimilarities((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.similarityErr = false;
        return newErrorObj;
      });

      return updatedCategories;
    });
  };

  const [errors, setErrors] = useState({
    confusionErr: false,
    tangibleErr: false,
    otherErr: false,
    similarityErr: false,
    otherSimilarErr: false,
    paraErr: false,
    demoErr: false,
    investmentErr: false,
    competitorErr: false,
  });

  const conditonalProgress = (data: any): string => {
    let progress = "";
    if (data.practiceOccur !== "practiceNotOccur") {
      return (progress = "60");
    } else {
      return (progress = "70");
    }
  };

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    // if (!experiencingConfusion) {
    //   isError = true;
    //   errorObj = { ...errorObj, practiceErr: true };
    //   return setErr(true);
    // }
    if (kindOfConfusion.length == 0) {
      isError = true;
      errorObj = { ...errorObj, confusionErr: true };
    }
    if (
      kindOfConfusion.includes("tangible") &&
      categoryOfTangible.length == 0
    ) {
      isError = true;
      errorObj = { ...errorObj, tangibleErr: true };
    }

    if (categoryOfTangible.includes("other") && !otherTangible) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }

    if (similarities.length == 0) {
      isError = true;
      errorObj = { ...errorObj, similarityErr: true };
    }

    if (similarities.includes("other") && !otherSimilarities) {
      isError = true;
      errorObj = { ...errorObj, otherSimilarErr: true };
    }

    if (!experiencingParasitism) {
      isError = true;
      errorObj = { ...errorObj, paraErr: true };
    }

    if ( experiencingParasitism == "yes" && !demonstrateInvestments) {
      isError = true;
      errorObj = { ...errorObj, demoErr: true };
    }
    if (
      demonstrateInvestments == "yes" &&
      experiencingParasitism == "yes" &&
      !investmentAmount
    ) {
      isError = true;
      errorObj = { ...errorObj, investmentErr: true };
    }

    if (!competitorViolated) {
      isError = true;
      errorObj = { ...errorObj, competitorErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }

    return isError;
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
          experiencingConfusion,
          kindOfConfusion,
          categoryOfTangible,
          otherTangible,
          similarities,
          otherSimilarities,
          experiencingParasitism,
          demonstrateInvestments,
          investmentAmount,
          competitorViolated,
          progress: 50,
        }
      );
      if (data && data.data) {
        const newProgress = conditonalProgress(data.data);
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
              <h6 className="f-26  fw-400 pb-3"> Confusion and Parasitism</h6>

                <div className="row">
                  <div className="col-12 col-md-12 mb-4">
                    <label className="d-block">
                      {`Are you experiencing confusion between your
                      products/services and the competitor's?`}{" "}
                    </label>
                    <div>
                      <div className="buttons-row d-flex gap-3">
                        <Button
                          // variant={useClause == true ? "contained" : "white"}
                          variant="outline"
                          size="lg"
                          value="yes"
                          className={
                            experiencingConfusion == "yes"
                              ? "bg-black text-white"
                              : ""
                          }
                          onClick={() => {
                            setConfusion("yes");
                            setErr(false);
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
                            experiencingConfusion == "no"
                              ? "bg-black text-white"
                              : ""
                          }
                          onClick={() => {
                            setConfusion("no");
                            setErr(false);
                          }}
                        >
                          No
                        </Button>
                      </div>

                      {err && (
                        <span className="text-danger">
                          This field is required
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {experiencingConfusion == "yes" && (
                  <div className="row">
                    <div className="col-12 col-md-12 mb-4">
                      <div className="radio-end-input">
                        <label className="d-block">
                          What kind of confusion are you experiencing?
                        </label>
                        <div className="webclick">
                          <FormGroup>
                            {confusionArr.map((i: any, index: number) => {
                              return (
                                <FormControlLabel
                                  key={index}
                                  className="radio-light-ip"
                                  control={<Checkbox />}
                                  label={i.label}
                                  onChange={() => handleConfusion(i.value)}
                                />
                              );
                            })}

                            {errors.confusionErr && (
                              <span className="text-danger">
                                This field is required
                              </span>
                            )}
                          </FormGroup>
                        </div>
                      </div>
                      <div className="tangible-selected">
                        {kindOfConfusion.includes("tangible") && (
                          <div className="radio-end-input  four-cols mt-4">
                            <label className="d-block w-100">
                              What category of tangible goods are involved?
                            </label>
                            <div className="webclick">
                              <FormGroup>
                                {tangible.map((i: any, index: number) => {
                                  return (
                                    <FormControlLabel
                                      key={index}
                                      className="radio-light-ip"
                                      control={<Checkbox />}
                                      label={i.label}
                                      onChange={() => handleTangible(i.value)}
                                    />
                                  );
                                })}
                              </FormGroup>
                              {errors.tangibleErr && (
                                <div>
                                  <span className="text-danger">
                                    This field is required
                                  </span>
                                </div>
                              )}
                            </div>

                            {categoryOfTangible.includes("other") && (
                              <div className="lease-input mt-4">
                                <TextField
                                  fullWidth
                                  id="filled-basic"
                                  label="Other"
                                  variant="filled"
                                  value={otherTangible}
                                  onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                  ) => {
                                    setOtherTangible(event.target.value);
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
                                      Please describe the other tangible
                                      statement
                                    </span>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* <div className="lease-input mt-4">
                            <label>Others:</label>
                            <InputField
                              error={formState.errors["other"]}
                              label="Others"
                              name="other"
                              variant="filled"
                              className="bglight-ip"
                              control={control}
                            />
                          </div> */}
                          </div>
                        )}
                        <div className="radio-end-input  four-cols mt-4">
                          <label className="d-block w-100">
                            What are the similarities?
                          </label>
                          <div className="webclick">
                            <FormGroup>
                              {similarityArr.map((i: any, index: number) => {
                                return (
                                  <FormControlLabel
                                    key={index}
                                    className="radio-light-ip"
                                    control={<Checkbox />}
                                    label={i.label}
                                    onChange={() => handleSimilarity(i.value)}
                                  />
                                );
                              })}
                            </FormGroup>

                            {errors.similarityErr && (
                              <div>
                                <span className="text-danger">
                                  This field is required
                                </span>
                              </div>
                            )}
                          </div>
                          {similarities.includes("other") && (
                            <div className="lease-input mt-4">
                              <TextField
                                fullWidth
                                id="filled-basic"
                                label="Other"
                                variant="filled"
                                value={otherSimilarities}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setOtherSimilarities(event.target.value);
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.otherSimilarErr = false;
                                    return newErrorObj;
                                  });
                                }}
                              />
                              {errors.otherSimilarErr && (
                                <div>
                                  <span className="text-danger">
                                    Please describe the other similar statement
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-12 col-md-12 mb-4">
                      <div className="lease-input">
                        <label className="relative">
                          Are you experiencing parasitism (the competitor
                          benefiting unfairly from your investments)?
                        </label>

                        <div>
                          <div className="buttons-row d-flex gap-3">
                            <Button
                              // variant={useClause == true ? "contained" : "white"}
                              variant="outline"
                              size="lg"
                              value="yes"
                              className={
                                experiencingParasitism == "yes"
                                  ? "bg-black text-white"
                                  : ""
                              }
                              onClick={() => {
                                setexperiencing("yes");
                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.paraErr = false;
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
                                experiencingParasitism == "no"
                                  ? "bg-black text-white"
                                  : ""
                              }
                              onClick={() => {
                                setexperiencing("no");
                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.paraErr = false;
                                  return newErrorObj;
                                });
                              }}
                            >
                              No
                            </Button>
                          </div>

                          {errors.paraErr && (
                            <span className="text-danger">
                              This is required
                            </span>
                          )}
                        </div>
                      </div>
                      {experiencingParasitism == "yes" && (
                        <div className="lease-input mt-4">
                          <label className="relative">
                            {`Can you demonstrate the investments you've made?`}
                          </label>

                          <div>
                            <div className="buttons-row d-flex gap-3">
                              <Button
                                // variant={useClause == true ? "contained" : "white"}
                                variant="outline"
                                size="lg"
                                value="yes"
                                className={
                                  demonstrateInvestments == "yes"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setDemonstrate("yes");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.demoErr = false;
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
                                  demonstrateInvestments == "no"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setDemonstrate("no");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.demoErr = false;
                                    return newErrorObj;
                                  });
                                }}
                              >
                                No
                              </Button>
                            </div>

                            {errors.demoErr && (
                              <span className="text-danger">
                                This is required
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      {demonstrateInvestments == "yes" &&
                        experiencingParasitism == "yes" && (
                          <div className="lease-input mt-4">
                            <label className="tooltip-title relative">
                              Specify the amount (EUR):
                            </label>
                            {/* <NumberField
                          error={formState.errors["amount"]}
                          label="specify the amount (EUR):"
                          name="amount"
                          variant="filled"
                          className="bglight-ip"
                          control={control}
                        /> */}

                            <TextField
                              fullWidth
                              type="number"
                              id="filled-basic"
                              label="Specify the amount (EUR):"
                              variant="filled"
                              value={investmentAmount}
                              onChange={(
                                event: React.ChangeEvent<HTMLInputElement>
                              ) => {
                                setInvestment(event.target.value);
                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.investmentErr = false;
                                  return newErrorObj;
                                });
                              }}
                            />
                            {errors.investmentErr && (
                              <div>
                                <span className="text-danger">
                                  Please enter the amount
                                </span>
                              </div>
                            )}
                            {/* {!errors.investmentErr &&
                              investmentAmount &&
                              !regex.test(investmentAmount) && (
                                <div>
                                  <span className="text-danger">
                                    Only digits are allowed
                                  </span>
                                </div>
                              )} */}
                          </div>
                        )}
                    </div>

                    <div className="col-12 col-md-12 mb-4">
                      <div className="lease-input">
                        <label className="relative">
                          Has the competitor violated any laws or regulations?
                        </label>

                        <div>
                          <div className="buttons-row d-flex gap-3">
                            <Button
                              // variant={useClause == true ? "contained" : "white"}
                              variant="outline"
                              size="lg"
                              value="yes"
                              className={
                                competitorViolated == "yes"
                                  ? "bg-black text-white"
                                  : ""
                              }
                              onClick={() => {
                                setCompetitor("yes");

                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.competitorErr = false;
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
                                competitorViolated == "no"
                                  ? "bg-black text-white"
                                  : ""
                              }
                              onClick={() => {
                                setCompetitor("no");
                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.competitorErr = false;
                                  return newErrorObj;
                                });
                              }}
                            >
                              No
                            </Button>
                          </div>

                          <div>
                            {errors.competitorErr && (
                              <span className="text-danger">
                                Please select the field
                              </span>
                            )}{" "}
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
                            onClick={() => router.push("/client/cases-list?type=preLitigation")}
                          >
                            <span className="f-16">Exit</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(experiencingConfusion == "" ||
                  experiencingConfusion == "no") && (
                  <div className="col-12 col-md-12 mt-4">
                    <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
                      <Button
                        variant="contained"
                        className="client-btn"
                        size="lg"
                        onClick={async () => {
                          if (!experiencingConfusion) {
                            return setErr(true);
                          }
                          const { data } = await axios.post(
                            "/api/client/category/unfair/createUnfair",
                            {
                              caseId: caseId,
                              experiencingConfusion,
                              progress: 60,
                            }
                          );
                          console.log(data);

                          let id = data.data.caseId;

                          const searchParam = new URLSearchParams();
                          searchParam.set("caseId", id);
                          searchParam.set("progress", "60");

                          router.push(
                            `/client/unfair-claim-assessment-form?${searchParam.toString()}`
                          );
                        }}
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
                )}
              </div>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default ConfusionParasitism;
