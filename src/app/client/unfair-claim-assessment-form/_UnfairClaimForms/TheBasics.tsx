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
import axios from "axios";

type FormValues = {
  unfairPractices: string;
};

const schema = z.object({
  unfairPractices: z
    .string({ required_error: "Please enter the month" })
    .min(1, "Please enter the month")
    .regex(/^\d+(\.\d+)?$/, "Only digits are allowed"),
});

const TheBasics = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const [loadingData, setDataLoading] = useState(false);
  const router = useRouter();

  const [unfairPractice, setunfairPractice] = React.useState("");
  const [websitePractice, setWebsitePractice] = React.useState<string[]>([]);
  const [unfairData, setUnfairData] = useState<any>({});

  const [practiceKind, setPracticeKind] = React.useState<string[]>([]);
  const [customerDiversion, setCustomerDiversion] = React.useState<string[]>(
    []
  );

  const [errors, setErrors] = useState({
    practiceErr: false,
    webErr: false,
    unfairKindErr: false,
    lostErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!unfairPractice) {
      isError = true;
      errorObj = { ...errorObj, practiceErr: true };
    }
    if (websitePractice.length == 0 && unfairPractice == "onWebsite") {
      isError = true;
      errorObj = { ...errorObj, webErr: true };
    }
    if (practiceKind.length == 0) {
      isError = true;
      errorObj = { ...errorObj, unfairKindErr: true };
    }
    if (
      customerDiversion.length == 0 &&
      practiceKind.includes("customerDiversion")
    ) {
      isError = true;
      errorObj = { ...errorObj, lostErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }

    return isError;
  };

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

  const conditonalProgress = (data: any): string => {
    let progress = "";
    if (
      data.websitePractice.includes("copyingContent") ||
      data.websitePractice?.includes("domainName")
    ) {
      return (progress = "30");
    } else if (
      data.practiceKind.includes("customerDiversion") ||
      data.practiceKind.includes("systematic")
    ) {
      return (progress = "40");
    } else if (
      data.websitePractice?.includes("copyingContent") ||
      data.websitePractice?.includes("sellingSimilar")
    ) {
      return (progress = "50");
    } else if (data.practiceOccur !== "practiceNotOccur") {
      return (progress = "60");
    } else {
      return (progress = "70");
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setunfairPractice((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.practiceErr = false;
      return newErrorObj;
    });
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
          practiceOccur: unfairPractice,
          websitePractice,
          practiceKind,
          customerDiversion,
          progress: 30,
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

  let unfairOccur: any = [
    {
      label: "Copying content",
      value: "copyingContent",
    },
    {
      label: "Domain name or search engine issues",
      value: "domainName",
    },
    {
      label: "Selling similar products/services",
      value: "sellingSimilar",
    },
    {
      label: "Redirecting traffic from my site",
      value: "traffic",
    },
  ];

  let unfairKind: any = [
    {
      label: "Customer diversion (taking my customers)",
      value: "customerDiversion",
    },
    {
      label: "Data theft",
      value: "dataTheft",
    },
    {
      label: "Diverting orders, deliveries, or tenders",
      value: "divertingOrders",
    },
    {
      label: "Systematic solicitation of my customers",
      value: "systematic",
    },
  ];

  let lostCustomer: any = [
    {
      label: "Conflict with my company",
      value: "conflictWithCompany",
    },
    {
      label: "Dissatisfaction with my products/services",
      value: "dissatisfaction",
    },
    {
      label: "Customers had a non-exclusive relationship with my company",
      value: "nonExclusive",
    },
    {
      label: "Customers initiated contact with the competitor",
      value: "customersInitiated",
    },
  ];

  const handleWeb = (label: number) => {
    setWebsitePractice((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.webErr = false;
        return newErrorObj;
      });

      return updatedCategories;
    });
  };

  const handlePractice = (label: number) => {
    setPracticeKind((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.unfairKindErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const handleCustomer = (label: number) => {
    setCustomerDiversion((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];

      return updatedCategories;
    });
  };
  useEffect(() => {
    console.log(practiceKind);
  }, [practiceKind]);
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
                <h6 className="f-26  fw-400 pb-3">The Basics</h6>
                <div className="row">
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="f-18 fw-500">
                        How long have the unfair practices been happening?
                      </label>

                      <InputField
                        error={formState.errors["unfairPractices"]}
                        label="Enter the months (in number)"
                        variant="filled"
                        className="bglight-ip"
                        name="unfairPractices"
                        control={control}
                      />
                      {/* <DateField
                        error={formState.errors["date"]}
                        label=""
                        name="date"
                        variant="filled"
                        className="bglight-ip"
                        control={control}
                      /> */}
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 col-md-6 mb-4">
                    <div className="radio-end-input">
                      <label className="d-block">
                        Where did the unfair practices occur?
                      </label>
                      <div className="business-radio">
                        <FormControl className="w-100">
                          <RadioGroup
                            className="w-100"
                            aria-labelledby="demo-controlled-radio-buttons-group"
                            name="controlled-radio-buttons-group"
                            value={unfairPractice}
                            onChange={handleChange}
                          >
                            <FormControlLabel
                              className="radio-light-ip"
                              value="practiceNotOccur"
                              control={<Radio />}
                              label="The unfair practice did not occur online"
                            />
                            <FormControlLabel
                              className="radio-light-ip"
                              value="onWebsite"
                              control={<Radio />}
                              label="On a website (check all that apply)"
                            />
                          </RadioGroup>

                          {errors.practiceErr && (
                            <span className="text-danger">
                              Please select the unfair practices occur
                            </span>
                          )}
                        </FormControl>
                      </div>
                      {unfairPractice == "onWebsite" && (
                        <div className="webclick mt-4">
                          <FormGroup>
                            {unfairOccur.map((i: any, index: number) => {
                              return (
                                <FormControlLabel
                                  key={index}
                                  className="radio-light-ip"
                                  control={<Checkbox />}
                                  label={i.label}
                                  onChange={() => handleWeb(i.value)}
                                />
                              );
                            })}
                          </FormGroup>

                          {errors.webErr && (
                            <span className="text-danger">
                              Plese select the unfair practice
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="radio-end-input">
                      <label className="d-block">
                        What kind of unfair practices are you experiencing?
                      </label>
                      <div className="webclick">
                        <FormGroup>
                          {unfairKind.map((i: any, index: number) => {
                            return (
                              <FormControlLabel
                                key={index}
                                className="radio-light-ip"
                                control={<Checkbox />}
                                label={i.label}
                                onChange={() => handlePractice(i.value)}
                              />
                            );
                          })}

                          {errors.unfairKindErr && (
                            <span className="text-danger">
                              Plese select the unfair practice experience
                            </span>
                          )}
                        </FormGroup>
                      </div>
                      {practiceKind.includes("customerDiversion") && (
                        <div className="webclick mt-4">
                          <label className="d-block">
                            {" "}
                            If you lost customers, what was the context? (check
                            all that apply)
                          </label>
                          <FormGroup>
                            {lostCustomer.map((i: any, index: number) => {
                              return (
                                <FormControlLabel
                                  key={index}
                                  className="radio-light-ip"
                                  control={<Checkbox />}
                                  label={i.label}
                                  onChange={() => handleCustomer(i.value)}
                                />
                              );
                            })}
                            {errors.lostErr && (
                              <span className="text-danger">
                                Plese select the context
                              </span>
                            )}
                          </FormGroup>
                        </div>
                      )}
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
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default TheBasics;
