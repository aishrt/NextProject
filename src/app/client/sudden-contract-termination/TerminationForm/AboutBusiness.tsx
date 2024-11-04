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
import SelectField from "@/components/Form/SelectField";
import { NumberField } from "@/components/Form/NumberField";
import { useHookForm } from "@/hooks/useHookForm";
import bubble from "@/assets/info.png";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Form/Button";
import Image from "next/image";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Sudden } from "@/types/Sudden";
import { Tooltip } from "@mui/material";

type FormValues = {
  industry: string;
  otherIndustry: string;
  proceedings: string;
  courtType: string;
  courtName: string;
  courtLocation: string;
};

const options = [
  {
    label: "Public Administration and Nonprofit Organizations",
    value: "Public Administration",
  },

  { label: "IT Services", value: "IT Services" },

  {
    label: "Legal and Accounting, Business Consulting, and Management",
    value: "Legal and Accounting",
  },

  { label: "Food and Beverage Industry", value: "Food and Beverage Industry" },

  {
    label: "Automotive, Aeronautics, and Other Transportation Equipment",
    value: "Automotive, Aeronautics",
  },

  {
    label: "Banking and Insurance",
    value: "Banking and Insurance",
  },

  {
    label: "Wood, Paper, and Printing",
    value: "Wood, Paper, and Printing",
  },

  {
    label: "Chemical, Rubber, and Plastic",
    value: "Chemical, Rubber, and Plastic",
  },

  {
    label: "B2B Commerce",
    value: "B2B Commerce",
  },

  {
    label: "Communication and Media",
    value: "Communication and Media",
  },

  {
    label: "Construction",
    value: "Construction",
  },

  {
    label: "General and Specialized Retail",
    value: "General and Specialized Retail",
  },

  {
    label: "Energy, Water, Waste Management",
    value: "Energy, Water, Waste Management",
  },

  {
    label: "Electrical and Electronic Equipment",
    value: "Electrical and Electronic Equipment",
  },

  {
    label: "Initial and Continuing Education",
    value: "Initial and Continuing Education",
  },

  {
    label: "Hospitality, Catering, and Leisure",
    value: "Hospitality, Catering, and Leisure",
  },

  {
    label: "Real Estate",
    value: "Real Estate",
  },

  {
    label: "Pharmaceutical Industry",
    value: "Pharmaceutical Industry",
  },

  {
    label: "Engineering and R&D",
    value: "Engineering and R&D",
  },

  {
    label: "Metallurgy and Mechanical Industry",
    value: "Metallurgy and Mechanical Industry",
  },

  {
    label: "Furniture, Textile, and Other Manufacturing Industries",
    value: "Furniture, Textile, and Other Manufacturing Industries",
  },

  {
    label: "Healthcare and Social Work",
    value: "Healthcare and Social Work",
  },

  {
    label: "Miscellaneous Business Services and Recruitment Agencies",
    value: "Miscellaneous Business Services and Recruitment Agencies",
  },

  {
    label: "Telecommunications",
    value: "Telecommunications",
  },

  {
    label: "Transport and Logistics",
    value: "Transport and Logistics",
  },

  {
    label: "Other",
    value: "Other",
  },
];
const proceedingsArr = [
  {
    label: "Redressement judiciaire (Judicial Reorganization)",
    value: "Redressement judiciaire",
  },
  {
    label: "Liquidation judiciaire (Judicial Liquidation)",
    value: "Liquidation judiciaire",
  },
  {
    label: "Procédure de sauvegarde (Safeguard Procedure)",
    value: "Procédure de sauvegarde",
  },
  { label: "Mandat ad hoc (Ad Hoc Mandate)", value: "Mandat ad hoc" },
  { label: "Conciliation (Conciliation)", value: "Conciliation" },
  { label: "Plan de cession (Transfer Plan)", value: "Plan de cession" },
];

const courtTypeArr = [
  {
    label: "Tribunal de commerce (Commercial Court)",
    value: "Tribunal de commerce",
  },
  {
    label: "Tribunal judiciaire (Judicial Court)",
    value: "Tribunal judiciaire",
  },
];

const AboutBusiness = ({
  data,
  hide,
}: {
  data: Sudden | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const [value, setIndustry] = useState("");
  const [collective, setcollective] = React.useState("");

  const schema = z.object({
    industry: z
      .string({
        required_error: "Please select your business industry",
        invalid_type_error: "Please select your business industry",
      })
      .min(1, "Please select your business industry"),
    otherIndustry:
      value == "Other"
        ? z
            .string({
              required_error: "Please describe the other industry",

              invalid_type_error: "Please describe the other industry",
            })
            .min(1, "Please describe the other industry")
        : z.string().optional(),

    proceedings:
      collective == "yes"
        ? z
            .string({
              required_error: "Please select the type of proceedings",
              invalid_type_error: "Please select the type of proceedings",
            })
            .min(1, "Please select the type of proceedings")
        : z.string().optional(),

    courtType:
      collective == "yes"
        ? z
            .string({
              required_error: "Please select the court type",
              invalid_type_error: "Please select the court type",
            })
            .min(1, "Please select the court type")
        : z.string().optional(),

    courtName:
      collective == "yes"
        ? z
            .string({
              required_error: "Please enter the court name",
              invalid_type_error: "Please enter the court name",
            })
            .min(1, "Please enter the court name")
        : z.string().optional(),

    courtLocation:
      collective == "yes"
        ? z
            .string({
              required_error: "Please enter the court location",
              invalid_type_error: "Please enter the court location",
            })
            .min(1, "Please enter the court location")
        : z.string().optional(),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [openCollective, setOpen] = React.useState("");
  const [opnErr, setOpnErr] = useState(false);

  const handleOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
    setOpen((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.openErr = false;
      return newObj;
    });
  };
  const [marketCondition, setContract] = React.useState("");

  const contractChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContract((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.partyErr = false;
      return newObj;
    });
  };
  const [newPartner, setNew] = React.useState("");
  const [err, setErr] = React.useState(false);
  const [errors, setErrors] = useState({
    partyErr: false,
    err: false,
    openErr: false,
    collectiveerr: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.err = false;
      return newObj;
    });
    setNew((event.target as HTMLInputElement).value);
  };

  const handleCollective = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => {
      let newObj = { ...prev };
      newObj.collectiveerr = false;
      return newObj;
    });
    setcollective((event.target as HTMLInputElement).value);
  };

  const checkBusinessFormError = (): boolean => {
    let isError = false;
    let errorObj = { ...errors };

    if (!marketCondition) {
      isError = true;
      errorObj.partyErr = true;
    }

    // if (!newPartner) {
    //   isError = true;
    //   errorObj.err = true;
    // }

    if (!collective) {
      isError = true;
      errorObj.collectiveerr = true;
    }

    // if (!openCollective) {
    //   isError = true;
    //   errorObj.openErr = true;
    // }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (checkBusinessFormError()) {
        return;
      }
      let payload: any = {
        caseId: caseId,
        ...values,
        otherIndustry: value == "Other" ? values.otherIndustry : "",
        marketCondition,
        collective,

        proceedings: collective == "yes" ? values.proceedings : "",
        courtType: collective == "yes" ? values.courtType : "",
        courtName: collective == "yes" ? values.courtName : "",
        courtLocation: collective == "yes" ? values.courtLocation : "",
        // newPartner,
        // openCollective,
        // progress: 50,
        // nextProgress: 50,
      };

      if (!hide) {
        payload = { ...payload, progress: 50, nextProgress: 50 };
      }
      const { data } = await axios.post(
        "/api/client/category/sudden/createSudden",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "50");

        router.push(
          `/client/sudden-contract-termination?${searchParam.toString()}`
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

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/sudden/createSudden",
        {
          caseId: caseId,
          progress: 30,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");
      router.push(
        `/client/sudden-contract-termination?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({ ...data });
    setcollective(data?.collective ?? "");
    setContract(data?.marketCondition ?? "");
  }, [data]);

  return (
    <div className="lease-form white-card p-4 mt-4 indivi-form side-story rounded">
      <h3 className="f-26 my-4">About Your Business</h3>
      <h4 className="f-16 my-4">
        Next, we need some information about your business. This will help us
        better understand your context and the market you operate in.
      </h4>
      {loading ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-3">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input">
                <label className="relative">
                  What industry is your business in?
                </label>
                <SelectField
                  options={options}
                  label=""
                  disabled={hide}
                  name="industry"
                  className="bglight-select"
                  error={formState.errors["industry"]}
                  control={control}
                  emitChange={(val: any) => setIndustry(val)}
                />
              </div>
            </div>

            {value == "Other" && (
              <div className="col-12 col-md-6">
                <label className="tooltip-title relative">
                  Please specify :
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Please select the industry that best describes your
                    business.
                  </span>
                </label>

                <InputField
                  error={formState.errors["otherIndustry"]}
                  disabled={hide}
                  label={`Please specify`}
                  name="otherIndustry"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            )}
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Describe the current market conditions in your industry.
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={marketCondition}
                    onChange={contractChange}
                  >
                    <Tooltip title="Select this if the market conditions are currently bad for your industry.">
                      <FormControlLabel
                        className="radio-light-ip"
                        value="unfavorable"
                        disabled={hide}
                        control={<Radio />}
                        label="Unfavorable"
                      />
                    </Tooltip>

                    <Tooltip title="Select this if the market conditions are neither good nor bad.">
                      <FormControlLabel
                        className="radio-light-ip"
                        value="neutral"
                        disabled={hide}
                        control={<Radio />}
                        label="Neutral"
                      />
                    </Tooltip>
                    <Tooltip title="Select this if the market conditions are currently good for your industry.">
                      <FormControlLabel
                        className="radio-light-ip"
                        disabled={hide}
                        value="favorable"
                        control={<Radio />}
                        label="Favorable"
                      />
                    </Tooltip>
                  </RadioGroup>
                  {errors.partyErr && (
                    <span className="text-danger">This field is required</span>
                  )}
                </FormControl>
              </div>
            </div>
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Are there any ongoing collective proceedings against you as a
                  result of the other party&apos;s actions (for example,
                  bankruptcy or creditor agreements)?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={collective}
                    onChange={handleCollective}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="yes"
                      control={<Radio />}
                      label="Yes"
                      disabled={hide}
                    />
                    <Tooltip title="Select this if there are no ongoing collective proceedings against your business.">
                      <FormControlLabel
                        className="radio-light-ip"
                        value="no"
                        control={<Radio />}
                        label="No"
                        disabled={hide}
                      />
                    </Tooltip>
                  </RadioGroup>
                  {errors.collectiveerr && (
                    <span className="text-danger">
                      Please select the ongoing collective proceedings
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
            {collective == "yes" && (
              <div className="col-12 col-md-6 mb-4">
                <div className="lease-input">
                  <label className="tooltip-title relative">
                    Please provide the following details:
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Specify the type of collective proceedings, such as
                      bankruptcy, insolvency, or creditor arrangements.
                    </span>
                  </label>
                  <p className="f-14">Type of Proceedings:</p>
                  <SelectField
                    options={proceedingsArr}
                    label=""
                    name="proceedings"
                    disabled={hide}
                    className="bglight-select"
                    error={formState.errors["proceedings"]}
                    control={control}
                  />
                </div>

                <div className="lease-input mt-4">
                  <label className="tooltip-title relative">
                    Court Information:
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Include the name and location of the court handling the
                      proceedings.
                    </span>
                  </label>
                  <p className="f-14">Court Type:</p>
                  <SelectField
                    disabled={hide}
                    options={courtTypeArr}
                    label=""
                    name="courtType"
                    className="bglight-select"
                    error={formState.errors["courtType"]}
                    control={control}
                  />
                </div>

                <div className="mt-4">
                  <p className="f-20 fw-500">Court Location:</p>
                  <div className="lease-input">
                    <InputField
                      error={formState.errors["courtName"]}
                      label="Court Name"
                      name="courtName"
                      disabled={hide}
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>

                  <div className="lease-input mt-3">
                    {/* <label className="tooltip-title relative">
                      Location of the Court
                    </label> */}
                    <InputField
                      error={formState.errors["courtLocation"]}
                      label="Court Location"
                      name="courtLocation"
                      disabled={hide}
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>
              </div>
            )}
            {/* <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="d-block">
                  Have you found a new partner or changed your business
                  direction since the contract ended?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={newPartner}
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
                  {errors.partyErr && (
                    <span className="text-danger"> This field is required</span>
                  )}
                </FormControl>
              </div>
            </div> */}
            {/* <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Are there any open collective proceedings against you?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Select this option if there are any ongoing collective
                    proceedings (e.g., bankruptcy, restructuring) against your
                    company.
                  </span>
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={openCollective}
                    onChange={handleOpen}
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

                  {errors.openErr && (
                    <span className="text-danger">
                      Please select, if open collective proceedings against you
                    </span>
                  )}
                </FormControl>
              </div>
            </div> */}
          </div>

          <div className="col-12 text-center mt-4">
            <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
              <Button
                variant="outline"
                size="lg"
                className={`next-btn f-16 ${hide ? "d-none" : "block"}`}
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                type="submit"
                variant="contained"
                className={`client-btn sudden-submit-btn ${
                  hide ? "d-none" : "block"
                }`}
                size="lg"
                onClick={() => checkBusinessFormError()}
              >
                <span className="f-16">Next</span>
              </Button>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default AboutBusiness;
