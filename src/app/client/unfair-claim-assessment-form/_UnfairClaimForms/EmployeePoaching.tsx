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
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import axios from "axios";

type FormValues = {
  adsPostedMonth: string;
  departuresMonths: string;
  numberOfEmployees: string;
};

const schema = z.object({
  // date: z
  //   .string({ required_error: "Please select month" })
  //   .min(1, "Please select month"),
  numberOfEmployees: z
    .string({ required_error: "Please enter the Employee number" })
    .min(1, "Please enter the Employee number"),

  // adsPostedMonth: z
  // .string({ required_error: "Please enter the posted date" })
  // .min(1, "Please enter the posted date"),

  // departuresMonths: z
  // .string({ required_error: "Please enter the departures date" })
  // .min(1, "Please enter the departures date"),
});

const EmployeePoaching = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const [loadingData, setDataLoading] = useState(false);
  const router = useRouter();
  const [serveNoticePeriod, setServeNotice] = React.useState("");

  const [valueNo, setValueNo] = React.useState("no");
  const [employeePoached, setEmployeePoach] = React.useState("");
  const [err, setErr] = React.useState(false);
  const [employeePositions, setEmpPosition] = React.useState<string[]>([]);

  const [previousJob, setPreviousJob] = React.useState<string[]>([]);
  const [prevJobErr, setPrevJobErr] = useState(false);

  const [workAreas, setWorkArea] = React.useState<string[]>([]);
  const [areaErr, setAreaErr] = useState(false);

  const [otherPreviousJob, setOtherPreviousJob] = useState("");

  const [regularTurnover, setRegularTurnover] = useState("");

  const [activelyLooking, setActivelyLooking] = useState("");

  const [companyPostJob, setCompanyPost] = useState("");

  const [adsPostedMonth, setAddPost] = useState<Dayjs | null>(dayjs(""));

  const [departureErr, setDepartureErr] = useState(false);
  const [departuresMonths, setDeparture] = useState<Dayjs | null>(dayjs(""));

  const [vacErr, setVacaErr] = useState(false);
  const [vacatedPositions, setVacatedPositions] = useState("");

  const [competingErr, setCompetingErr] = useState(false);
  const [competingCompany, setCompetingCompany] = useState("");

  const [leaveErr, setLeaveErr] = useState(false);
  const [clientsLeave, setClientsLeave] = useState("");

  const [nonCompeteClause, setNonCompeteClause] = useState("");

  const [competingCompanyAware, setCompanyAware] = useState("");

  const [unfairData, setUnfairData] = useState<any>({});

  const [errors, setErrors] = useState({
    err: false,
    empPositionErr: false,
    areaErr: false,
    prevJobErr: false,
    otherErr: false,
    regularErr: false,
    activelyErr: false,
    noticeErr: false,
    jobErr: false,
    addErr: false,
    departureErr: false,
    vacErr: false,
    competingErr: false,
    leaveErr: false,
    clauseErr: false,
    compnayAwareErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    // if (!employeePoached) {
    //   isError = true;
    //   errorObj = { ...errorObj, err: true };
    // }
    if (employeePositions.length == 0) {
      isError = true;
      errorObj = { ...errorObj, empPositionErr: true };
    }

    if (workAreas.length == 0) {
      isError = true;
      errorObj = { ...errorObj, areaErr: true };
    }
    if (previousJob.length == 0) {
      isError = true;
      errorObj = { ...errorObj, prevJobErr: true };
    }

    if (previousJob.includes("other") && !otherPreviousJob) {
      isError = true;
      errorObj = { ...errorObj, otherErr: true };
    }

    if (!regularTurnover) {
      isError = true;
      errorObj = { ...errorObj, regularErr: true };
    }

    if (!activelyLooking) {
      isError = true;
      errorObj = { ...errorObj, activelyErr: true };
    }

    if (!serveNoticePeriod) {
      isError = true;
      errorObj = { ...errorObj, noticeErr: true };
    }
    if (!companyPostJob) {
      isError = true;
      errorObj = { ...errorObj, jobErr: true };
    }

    if (
      companyPostJob == "yes" &&
      dayjs(adsPostedMonth).format("DD/MM/YYYY") == "Invalid Date"
    ) {
      isError = true;
      errorObj = { ...errorObj, addErr: true };
    }
    if (
      companyPostJob == "yes" &&
      dayjs(departuresMonths).format("DD/MM/YYYY") == "Invalid Date"
    ) {
      isError = true;
      errorObj = { ...errorObj, departureErr: true };
    }

    if (!vacatedPositions) {
      isError = true;
      errorObj = { ...errorObj, vacErr: true };
    }

    if (!competingCompany) {
      isError = true;
      errorObj = { ...errorObj, competingErr: true };
    }

    if (!clientsLeave) {
      isError = true;
      errorObj = { ...errorObj, leaveErr: true };
    }
    if (!nonCompeteClause) {
      isError = true;
      errorObj = { ...errorObj, clauseErr: true };
    }

    if (nonCompeteClause == "yes" && !competingCompanyAware) {
      isError = true;
      errorObj = { ...errorObj, compnayAwareErr: true };
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
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setServeNotice((event.target as HTMLInputElement).value);
  };
  const handleChangeNo = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValueNo((event.target as HTMLInputElement).value);
  };

  let positions: any = [
    {
      label: "Non-qualified",
      value: "nonQualified",
    },
    {
      label: "Skilled worker/technician",
      value: "skilledWorker",
    },
    {
      label: "Supervisor",
      value: "supervisor",
    },
    {
      label: "Senior manager",
      value: "seniorManager",
    },

    {
      label: "Executive employee",
      value: "executiveEmployee",
    },

    {
      label: "Executive director",
      value: "executiveDirector",
    },
  ];
  let area: any = [
    {
      label: "Front office",
      value: "frontOffice",
    },
    {
      label: "Human resources",
      value: "humanResources",
    },
    {
      label: "Back office",
      value: "backOffice",
    },
    {
      label: "Legal",
      value: "legal",
    },

    {
      label: "Finance/accounting",
      value: "finance",
    },

    {
      label: "IT",
      value: "IT",
    },

    {
      label: "R&D",
      value: "RD",
    },

    {
      label: "Business (commercial/procurement/communications)",
      value: "business",
    },

    {
      label: "Management",
      value: "management",
    },
  ];

  let prevJobArr: any = [
    {
      label: "Lower compensation",
      value: "lowerCompensation",
    },
    {
      label: "Same compensation",
      value: "sameCompensation",
    },
    {
      label: "Higher compensation",
      value: "higherCompensation",
    },
    {
      label: "Bonuses/primes",
      value: "bonuses",
    },

    {
      label: "No trial period",
      value: "noTrial",
    },

    {
      label: "Higher level of responsibility",
      value: "higherLevel",
    },

    {
      label: "Other",
      value: "other",
    },
  ];
  const handlePosition = (label: number) => {
    setEmpPosition((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.empPositionErr = false;
        return newErrorObj;
      });

      return updatedCategories;
    });
  };
  const handleWorkArea = (label: number) => {
    setWorkArea((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.areaErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const handlePrevJob = (label: number) => {
    setPreviousJob((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.prevJobErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const handleDepartureChange = (date: any) => {
    if (date) {
      setDeparture(date);
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.departureErr = false;
        return newErrorObj;
      });
    } else {
      setDeparture(null);
    }
  };

  const handlePostedChange = (date: any) => {
    console.log(date);

    if (date) {
      setAddPost(date);
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.addErr = false;
        return newErrorObj;
      });
    } else {
      setAddPost(null);
    }
  };

  const conditonalProgress = (data: any): string => {
    let progress = "";
    if (
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
          employeePoached,
          employeePositions,
          workAreas,
          previousJob,
          otherPreviousJob,
          regularTurnover,
          activelyLooking,
          serveNoticePeriod,
          companyPostJob,
          adsPostedMonth: dayjs(adsPostedMonth).format("DD/MM/YYYY"),
          departuresMonths: dayjs(departuresMonths).format("DD/MM/YYYY"),
          vacatedPositions,
          competingCompany,
          clientsLeave,
          nonCompeteClause,
          competingCompanyAware,
          progress: 40,
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
                <h6 className="f-26  fw-400 pb-3"> Employee Poaching</h6>

                <div className="row">
                  <div className="col-12 col-md-6 mb-4">
                    <label className="d-block">Were employees poached?</label>
                    <div className="buttons-row d-flex gap-3">
                      <Button
                        // variant={useClause == true ? "contained" : "white"}
                        variant="outline"
                        size="lg"
                        value="yes"
                        className={
                          employeePoached == "yes" ? "bg-black text-white" : ""
                        }
                        onClick={() => {
                          setEmployeePoach("yes");
                          setErr(false);
                          // setErrors((prev) => {
                          //   let newErrorObj = { ...prev };
                          //   newErrorObj.err = false;
                          //   return newErrorObj;
                          // });
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
                          employeePoached == "no" ? "bg-black text-white" : ""
                        }
                        onClick={() => {
                          setEmployeePoach("no");
                          setErr(false);
                          // setErrors((prev) => {
                          //   let newErrorObj = { ...prev };
                          //   newErrorObj.err = false;
                          //   return newErrorObj;
                          // });
                        }}
                      >
                        No
                      </Button>
                    </div>
                    {err && (
                      <span className="text-danger">
                        Please select the employee poached
                      </span>
                    )}{" "}
                  </div>
                  {employeePoached == "yes" && (
                    <>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label>How many employees were involved?</label>
                          <InputField
                            error={formState.errors["numberOfEmployees"]}
                            label=""
                            name="numberOfEmployees"
                            variant="filled"
                            className="bglight-ip"
                            control={control}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="radio-end-input">
                          <label className="d-block">
                            What were their positions?
                          </label>
                          <div className="webclick">
                            <FormGroup>
                              {positions.map((i: any, index: number) => {
                                return (
                                  <FormControlLabel
                                    key={index}
                                    className="radio-light-ip"
                                    control={<Checkbox />}
                                    label={i.label}
                                    onChange={() => handlePosition(i.value)}
                                  />
                                );
                              })}

                              {errors.empPositionErr && (
                                <span className="text-danger">
                                  Please select the defamatory statements
                                </span>
                              )}
                            </FormGroup>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 col-md-6 mb-4">
                        <div className="radio-end-input">
                          <label className="d-block">
                            What areas did they work in?
                          </label>
                          <div className="webclick">
                            <FormGroup>
                              {area.map((i: any, index: number) => {
                                return (
                                  <FormControlLabel
                                    key={index}
                                    className="radio-light-ip"
                                    control={<Checkbox />}
                                    label={i.label}
                                    onChange={() => handleWorkArea(i.value)}
                                  />
                                );
                              })}
                              {errors.areaErr && (
                                <span className="text-danger">
                                  Please select the defamatory statements
                                </span>
                              )}
                            </FormGroup>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="radio-end-input">
                          <label className="d-block">
                            Compared to their previous job, did they receive:
                          </label>
                          <div className="webclick">
                            <FormGroup>
                              {prevJobArr.map((i: any, index: number) => {
                                return (
                                  <FormControlLabel
                                    key={index}
                                    className="radio-light-ip"
                                    control={<Checkbox />}
                                    label={i.label}
                                    onChange={() => handlePrevJob(i.value)}
                                  />
                                );
                              })}
                              {errors.prevJobErr && (
                                <span className="text-danger">
                                  Please select the field
                                </span>
                              )}
                            </FormGroup>
                          </div>
                          {previousJob.includes("other") && (
                            <div className="lease-input mt-4">
                              <TextField
                                id="filled-basic"
                                label="Other"
                                variant="filled"
                                value={otherPreviousJob}
                                onChange={(
                                  event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                  setOtherPreviousJob(event.target.value);
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
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="tooltip-title relative">
                            {`Is there regular turnover in your
                            company/department?`}
                            <Image className="bubble" src={bubble} alt="" />
                            <span className="hover-tip">
                              {`Sélectionner lorsqu'il y a un turn over dans votre
                              société, c'est à dire un roulement régulier des
                              effectifs de l'entreprise (ou des membres du
                              service concerne)`}
                            </span>
                          </label>

                          <div className="buttons-row d-flex gap-3">
                            <Button
                              // variant={useClause == true ? "contained" : "white"}
                              variant="outline"
                              size="lg"
                              value="yes"
                              className={
                                regularTurnover == "yes"
                                  ? "bg-black text-white"
                                  : ""
                              }
                              onClick={() => {
                                setRegularTurnover("yes");
                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.regularErr = false;
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
                                regularTurnover == "no"
                                  ? "bg-black text-white"
                                  : ""
                              }
                              onClick={() => {
                                setRegularTurnover("no");
                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.regularErr = false;
                                  return newErrorObj;
                                });
                              }}
                            >
                              No
                            </Button>
                          </div>

                          <div>
                            {errors.regularErr && (
                              <span className="text-danger">
                                This is required{" "}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="tooltip-title relative">
                            {`Were the employees actively looking for new jobs or
                            wanting to leave?`}
                            <Image className="bubble" src={bubble} alt="" />
                            <span className="hover-tip">
                              {`Sélectionner lorsque le ou les salariés
                              prétendument débauchés étaient à la recherche d'un
                              travail ou avaient exprimé une volonté de départ`}
                            </span>
                          </label>

                          <div className="buttons-row d-flex gap-3">
                            <Button
                              // variant={useClause == true ? "contained" : "white"}
                              variant="outline"
                              size="lg"
                              value="yes"
                              className={
                                activelyLooking == "yes"
                                  ? "bg-black text-white"
                                  : ""
                              }
                              onClick={() => {
                                setActivelyLooking("yes");

                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.activelyErr = false;
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
                                activelyLooking == "no"
                                  ? "bg-black text-white"
                                  : ""
                              }
                              onClick={() => {
                                setActivelyLooking("no");
                                setErrors((prev) => {
                                  let newErrorObj = { ...prev };
                                  newErrorObj.activelyErr = false;
                                  return newErrorObj;
                                });
                              }}
                            >
                              No
                            </Button>
                          </div>

                          <div>
                            {errors.activelyErr && (
                              <span className="text-danger">
                                This is required{" "}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="radio-end-input">
                          <label className="d-block">
                            Did the employees serve their notice period?
                          </label>
                          <div className="business-radio">
                            <FormControl className="w-100">
                              <RadioGroup
                                className="w-100"
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={serveNoticePeriod}
                                onChange={handleChange}
                              >
                                <FormControlLabel
                                  className="radio-light-ip"
                                  value="yes"
                                  control={<Radio />}
                                  label="Yes"
                                  onClick={() => {
                                    setServeNotice("yes");
                                    setErrors((prev) => {
                                      let newErrorObj = { ...prev };
                                      newErrorObj.noticeErr = false;
                                      return newErrorObj;
                                    });
                                  }}
                                />
                                <FormControlLabel
                                  className="radio-light-ip"
                                  value="employee"
                                  control={<Radio />}
                                  label="No, due to the employee"
                                  onClick={() => {
                                    setServeNotice("dueToEmployee");
                                    setErrors((prev) => {
                                      let newErrorObj = { ...prev };
                                      newErrorObj.noticeErr = false;
                                      return newErrorObj;
                                    });
                                  }}
                                />
                                <FormControlLabel
                                  className="radio-light-ip"
                                  value="company"
                                  control={<Radio />}
                                  label="No, due to the company"
                                  onClick={() => {
                                    setServeNotice("dueToCompany");
                                    setErrors((prev) => {
                                      let newErrorObj = { ...prev };
                                      newErrorObj.noticeErr = false;
                                      return newErrorObj;
                                    });
                                  }}
                                />
                              </RadioGroup>
                            </FormControl>
                            {errors.noticeErr && (
                              <span className="text-danger">
                                This is required{" "}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            Did the competing company post job ads around the
                            time of departure?
                          </label>

                          <div>
                            <div className="buttons-row d-flex gap-3">
                              <Button
                                // variant={useClause == true ? "contained" : "white"}
                                variant="outline"
                                size="lg"
                                value="yes"
                                className={
                                  companyPostJob == "yes"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setCompanyPost("yes");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.jobErr = false;
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
                                  companyPostJob == "no"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setCompanyPost("no");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.jobErr = false;
                                    return newErrorObj;
                                  });
                                }}
                              >
                                No
                              </Button>
                            </div>
                            <div>
                              {errors.jobErr && (
                                <span className="text-danger">
                                  This is required{" "}
                                </span>
                              )}
                            </div>
                          </div>
                          {companyPostJob == "yes" && (
                            <>
                              <div className="lease-input mt-4 mb-4">
                                <h6>
                                  When were the ads posted and when did the
                                  departures occur?
                                </h6>
                                <label>Ads posted</label>
                                {/* <DateField
                              error={formState.errors["adsPostedMonth"]}
                              label=""
                              name="adsPostedMonth"
                              variant="filled"
                              className="bglight-ip"
                              control={control}
                              // defaultValue={evictionData?.leaseInitialDate}
                            /> */}

                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                      sx={{
                                        width: 400,
                                        backgroundColor: "#d5eae0",
                                      }}
                                      value={adsPostedMonth}
                                      onChange={handlePostedChange}
                                      format="DD/MM/YYYY"
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>

                                {errors.addErr && (
                                  <span className="text-danger">
                                    Please enter the posted date
                                  </span>
                                )}
                              </div>

                              <div className="lease-input mb-4">
                                <label>Departures occurred</label>
                                {/* <DateField
                              error={formState.errors["departuresMonths"]}
                              label=""
                              name="departuresMonths"
                              variant="filled"
                              className="bglight-ip"
                              control={control}
                              // defaultValue={evictionData?.leaseInitialDate}
                            /> */}
                                <LocalizationProvider
                                  dateAdapter={AdapterDayjs}
                                >
                                  <DemoContainer components={["DatePicker"]}>
                                    <DatePicker
                                      sx={{
                                        width: 400,
                                        backgroundColor: "#d5eae0",
                                      }}
                                      value={departuresMonths}
                                      onChange={handleDepartureChange}
                                      // renderInput={(params:any) => (
                                      //   <TextField
                                      //     {...params}
                                      //     variant="outlined"
                                      //   />
                                      // )}
                                      format="DD/MM/YYYY"
                                    />
                                  </DemoContainer>
                                </LocalizationProvider>
                                {errors.departureErr && (
                                  <span className="text-danger">
                                    Please enter the departure date
                                  </span>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            Were the vacated positions filled?
                          </label>

                          <div>
                            <div className="buttons-row d-flex gap-3">
                              <Button
                                // variant={useClause == true ? "contained" : "white"}
                                variant="outline"
                                size="lg"
                                value="yes"
                                className={
                                  vacatedPositions == "yes"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setVacatedPositions("yes");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.vacErr = false;
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
                                  vacatedPositions == "no"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setVacatedPositions("no");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.vacErr = false;
                                    return newErrorObj;
                                  });
                                }}
                              >
                                No
                              </Button>
                            </div>

                            {errors.vacErr && (
                              <span className="text-danger">
                                This is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            Did the employees work for the competing company
                            previously?
                          </label>

                          <div>
                            <div className="buttons-row d-flex gap-3">
                              <Button
                                // variant={useClause == true ? "contained" : "white"}
                                variant="outline"
                                size="lg"
                                value="yes"
                                className={
                                  competingCompany == "yes"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setCompetingCompany("yes");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.competingErr = false;
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
                                  competingCompany == "no"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setCompetingCompany("no");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.competingErr = false;
                                    return newErrorObj;
                                  });
                                }}
                              >
                                No
                              </Button>
                            </div>

                            {errors.competingErr && (
                              <span className="text-danger">
                                This is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            Did clients leave your company for the competing
                            company at the same time?
                          </label>
                          <div>
                            <div className="buttons-row d-flex gap-3">
                              <Button
                                // variant={useClause == true ? "contained" : "white"}
                                variant="outline"
                                size="lg"
                                value="yes"
                                className={
                                  clientsLeave == "yes"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setClientsLeave("yes");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.leaveErr = false;
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
                                  clientsLeave == "no"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setClientsLeave("no");
                                  setErrors((prev) => {
                                    let newErrorObj = { ...prev };
                                    newErrorObj.leaveErr = false;
                                    return newErrorObj;
                                  });
                                }}
                              >
                                No
                              </Button>
                            </div>

                            {errors.leaveErr && (
                              <span className="text-danger">
                                This is required
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="col-12 col-md-6 mb-4">
                        <div className="lease-input">
                          <label className="relative">
                            Did the employees have a non-compete clause in their
                            contracts?
                          </label>
                          <div>
                            <div className="buttons-row d-flex gap-3">
                              <Button
                                // variant={useClause == true ? "contained" : "white"}
                                variant="outline"
                                size="lg"
                                value="yes"
                                className={
                                  nonCompeteClause == "yes"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setNonCompeteClause("yes");
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
                                  nonCompeteClause == "no"
                                    ? "bg-black text-white"
                                    : ""
                                }
                                onClick={() => {
                                  setNonCompeteClause("no");
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

                            {errors.clauseErr && (
                              <span className="text-danger">
                                This is required
                              </span>
                            )}
                          </div>
                        </div>
                        {nonCompeteClause == "yes" && (
                          <div className="radio-end-input mt-4">
                            <label className="d-block">
                              Was the competing company aware of it?
                            </label>
                            <div className="business-radio">
                              <FormControl className="w-100">
                                <RadioGroup
                                  className="w-100"
                                  aria-labelledby="demo-controlled-radio-buttons-group"
                                  name="controlled-radio-buttons-group"
                                  value={competingCompanyAware}
                                  onChange={handleChangeNo}
                                >
                                  <FormControlLabel
                                    className="radio-light-ip"
                                    value="no"
                                    control={<Radio />}
                                    label="No"
                                    onClick={() => {
                                      setCompanyAware("no");
                                      setErrors((prev) => {
                                        let newErrorObj = { ...prev };
                                        newErrorObj.compnayAwareErr = false;
                                        return newErrorObj;
                                      });
                                    }}
                                  />

                                  <FormControlLabel
                                    className="radio-light-ip"
                                    value="yesRegistered"
                                    control={<Radio />}
                                    label="Yes, we sent them a registered letter"
                                    onClick={() => {
                                      setCompanyAware("yesRegistered");
                                      setErrors((prev) => {
                                        let newErrorObj = { ...prev };
                                        newErrorObj.compnayAwareErr = false;
                                        return newErrorObj;
                                      });
                                    }}
                                  />
                                  <FormControlLabel
                                    className="radio-light-ip"
                                    value="yesTestimonies"
                                    control={<Radio />}
                                    label="Yes, there are testimonies/declarations proving this"
                                    onClick={() => {
                                      setCompanyAware("yesTestimonies");
                                      setErrors((prev) => {
                                        let newErrorObj = { ...prev };
                                        newErrorObj.compnayAwareErr = false;
                                        return newErrorObj;
                                      });
                                    }}
                                  />
                                </RadioGroup>
                              </FormControl>

                              {errors.compnayAwareErr && (
                                <span className="text-danger">
                                  This is required
                                </span>
                              )}
                            </div>
                          </div>
                        )}
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
                            type="submit"
                            variant="outline"
                            size="lg"
                            className="next-btn f-16"
                            onClick={() =>
                              router.push(
                                "/client/cases-list?type=preLitigation"
                              )
                            }
                          >
                            <span className="f-16">Exit</span>
                          </Button>
                        </div>
                      </div>
                    </>
                  )}

                  {(employeePoached == "" || employeePoached == "no") && (
                    <div className="col-12 col-md-12 mt-4">
                      <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
                        <Button
                          variant="contained"
                          className="client-btn"
                          size="lg"
                          onClick={async () => {
                            if (!employeePoached) {
                              return setErr(true);
                            }
                            const { data } = await axios.post(
                              "/api/client/category/unfair/createUnfair",
                              {
                                caseId: caseId,
                                employeePoached,
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
                          }}
                        >
                          <span className="f-16">Save and Continue</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          className="next-btn f-16"
                          onClick={() =>
                            router.push("/client/cases-list?type=preLitigation")
                          }
                        >
                          <span className="f-16">Exit</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default EmployeePoaching;
