import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from "@mui/material";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import * as z from "zod";
import bubble from "@/assets/info.png";
import SelectField from "@/components/Form/SelectField";
import { NumberField } from "@/components/Form/NumberField";
import { Button } from "@/components/Form/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Injury } from "@/types/Injury";

type ProfValues = {
  // prof_dfp: number;
  //totalAmt: number;
  participation: string;
  evidence: string;
  //   compensation?: number;
  //   severity_points: number;
  //   wanted_compensation: number;
  activity: string;
  protectionMeasure: string;
};

const options = [
  {
    label: "Occasional (less than once a month)",
    value: "Occasional (less than once a month)",
  },
  {
    label: "Regular (at least once a month)",
    value: "Regular (at least once a month)",
  },
  {
    label: "Serious (weekly or more, with some level of skill or training)",
    value: "Serious",
  },
  {
    label: "Competitive (participated in competitions or events)",
    value: "Competitive (participated in competitions or events)",
  },
];

const evidence = [
  { label: "No Proof", value: "No Proof" },
  {
    label: "Personal Statements (yours or from others)",
    value: "Personal Statements (yours or from others)",
  },
  {
    label: "Memberships, Subscriptions, or Licenses",
    value: "Memberships, Subscriptions, or Licenses",
  },
  { label: "Awards or Certifications", value: "Awards or Certifications" },
];
const protect = [
  { label: "No protection measure", value: "No protection measure" },
  {
    label: "Family protection",
    value: "Family protection",
  },
  {
    label: "State protection",
    value: "State protection",
  },
];
const injuryCauseOptions = [
  {
    label: "Injury to sexual organs",
    value: "injury",
    tooltip:
      "Select this option if the accident caused damage to your sexual organs.",
  },
  {
    label: "Removal of internal sexual organs",
    value: "removal",
    tooltip:
      "Choose this option if internal sexual organs were surgically removed due to the accident.",
  },
  {
    label: "Amputation of external sexual organs",
    value: "amputation",
    tooltip:
      "Select this if the accident resulted in the amputation of external sexual organs.",
  },
  {
    label:
      "Difficulty or discomfort in sexual activity or experiencing pleasure",
    value: "difficulty",
    tooltip:
      "Choose this option if you experience pain or discomfort during sexual activity or have difficulty experiencing pleasure.",
  },
  {
    label: "Inability to experience pleasure",
    value: "inability",
    tooltip:
      "Select this if you are unable to experience sexual pleasure due to the accident.",
  },
  {
    label: "Total inability to perform sexual activity",
    value: "total_inability",
    tooltip:
      "Choose this option if you are completely unable to engage in sexual activity because of the accident.",
  },
  {
    label: "Difficulty in procreation",
    value: "dificulty_procreation",
    tooltip:
      "Select this if you have difficulty conceiving children due to injuries sustained in the accident.",
  },
  {
    label: "Partial sterility",
    value: "partial_sterility",
    tooltip:
      "Choose this option if the accident caused partial sterility, affecting your ability to conceive.",
  },
  {
    label: "Total and permanent sterility",
    value: "total_sterility",
    tooltip:
      "Select this if the accident resulted in total and permanent sterility, making it impossible to conceive children.",
  },
];

const ProfessionalImpact = ({
  data,
  hide,
}: {
  data: Injury | undefined | null;
  hide: boolean;
}) => {
  const [activity, setActivity] = useState();

  const schema = z.object({
    activity: z
      .string({ required_error: "Please enter no. of activites" })
      .min(1, "Please enter amount of activites")
      .regex(/^\d+(\.\d+)?$/, "Only digit`s are allowed"),
    //   prof_dfp: z
    //     .string({ required_error: "Permanent DFP is required" })
    //     .min(1, "Permanent DFP is required"),
    //   totalAmt: z
    //     .string({ required_error: "Amount of compensation is required" })
    //     .min(1, "Amount of compensation is required"),
    participation:
      activity && Number(activity) > 0
        ? z
            .string({
              required_error: "Please select the level of participation",
            })
            .min(1, "Please select the level of participation")
        : z.string().optional(),
    evidence:
      activity && Number(activity) > 0
        ? z
            .string({ required_error: "Please select participation proof" })
            .min(1, "Please select participation proof")
        : z.string().optional(),

    compensation: z.number().optional(),
    //   severity_points: z
    //     .number({ required_error: "Please enter the number of points" })
    //     .min(1, "Enter the number of points"),
    //   wanted_compensation: z
    //     .number({ required_error: "Please enter the amount of compenstation" })
    //     .min(1, "This is required"),

    protectionMeasure: z
      .string({
        required_error: "Please select the type of protection measure",
      })
      .min(1, "Please select the type of protection measure"),
  });

  const { methods, setValues } = useHookForm<ProfValues, typeof schema>(schema);
  const router = useRouter();
  const { formState, control } = methods;
  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");

  const [injuryEffectCarrier, setCareer] = React.useState("");
  const [isInjuryImpact, setIsInjuryImpact] = React.useState("");
  const [injuryCause, setInjuryCause] = React.useState<string[]>([]);
  const [errors, setErrors] = React.useState({
    fairAmtErr: false,
    injuryCauseErr: false,
    financialLossErr: false,
    compAmtErr: false,
    injuryErr: false,
    harmErr: false,
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const [fairAmt, setFairAmt] = React.useState<string>("");
  const [financialLosses, setFinancialLosses] = React.useState<string>("");
  const [establishmentLoss, setEstablishmentLoss] = React.useState<string>("");
  const [compAmount, setCompAmount] = React.useState<string>("");

  const timeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInjuryImpact((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.injuryErr = false;
      return newErr;
    });
  };

  const [sexualHarm, setHarm] = useState("");
  const handleharm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHarm((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.harmErr = false;
      return newErr;
    });
  };
  const careerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCareer((event.target as HTMLInputElement).value);
  };

  const checkError = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!sexualHarm) {
      isError = true;
      errorObj.harmErr = true;
    }

    if (sexualHarm == "yes" && injuryCause.length === 0) {
      isError = true;
      errorObj.injuryCauseErr = true;
    }
    if (!isInjuryImpact) {
      isError = true;
      errorObj.injuryErr = true;
    }
    // if (injuryCause.length > 0 && !fairAmt) {
    //   isError = true;
    //   errorObj.fairAmtErr = true;
    // }

    // if (injuryEffectCarrier === "yes" && !financialLosses) {
    //   isError = true;
    //   errorObj.financialLossErr = true;
    // }

    // if (injuryEffectCarrier === "yes" && !compAmount) {
    //   isError = true;
    //   errorObj.compAmtErr = true;
    // }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleCheckChange = (label: string) => {
    setInjuryCause((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      return updatedCategories;
    });
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.injuryCauseErr = false;
      return newErr;
    });
  };

  const handleSubmit = async (values: ProfValues) => {
    try {
      setLoading(true);
      if (checkError()) {
        return;
      }
      let payload: any = {
        caseId: caseId,
        ...values,
        // injuryEffectCarrier,
        isInjuryImpact,
        injuryCause: sexualHarm == "yes" ? injuryCause : [],
        // fairAmt,
        //financialLosses,
        // establishmentLoss,
        // compAmount,
        sexualHarm,
        // progress: 70,
        // nextProgress: 70,
      };
      console.log(payload, "122");
      if (!hide) {
        payload = { ...payload, progress: 70, nextProgress: 70 };
      }
      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        payload
      );
      console.log(data, "response of accident api");

      let id = data?.data?.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "70");

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
      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        {
          caseId: caseId,
          progress: 50,
        }
      );

      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");
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
      participation: data?.participation,
      evidence: data?.evidence,
      activity: data?.activity?.toString(),
      protectionMeasure: data?.protectionMeasure,
    });
    setHarm(data?.sexualHarm ?? "");
    setInjuryCause(data?.injuryCause ?? []);
    setIsInjuryImpact(data?.isInjuryImpact ?? "");
  }, [data]);

  return (
    <div className="lease-form">
      <Form<ProfValues> onSubmit={handleSubmit} methods={methods}>
        <div>
          <hr />
          {/* <h3 className="f-22 bold my-4 gray">Professional Impact</h3> */}
          {/* <div className="row">
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Has your injury affected your ability to work or your career
                  prospects?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={injuryEffectCarrier}
                    onChange={careerChange}
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
                </FormControl>
              </div>
              {injuryEffectCarrier === "yes" && (
                <>
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      What financial losses have you experienced due to this
                      impact?
                      <Image className="bubble" src={bubble} alt="" />
                      <span className="hover-tip">
                        Enter the amount of income, bonuses, promotions, or
                        other financial opportunities you have lost due to your
                        injury.
                      </span>
                    </label>
                    <TextField
                      type="number"
                      sx={{ width: "100%" }}
                      className="bglight-ip"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFinancialLosses(event.target.value);
                        setErrors((prev) => {
                          let newErr = { ...prev };
                          newErr.financialLossErr = false;
                          return newErr;
                        });
                      }}
                    />
                    {errors.financialLossErr && (
                      <span className="text-danger">Please specify amount</span>
                    )}
                  </div>
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      What amount of compensation do you believe is fair for
                      this professional impact?
                    </label>
                    <TextField
                      placeholder="$"
                      type="number"
                      sx={{ width: "100%" }}
                      className="bglight-ip"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setCompAmount(event.target.value);
                        setErrors((prev) => {
                          let newErr = { ...prev };
                          newErr.compAmtErr = false;
                          return newErr;
                        });
                      }}
                    />
                    {errors.compAmtErr && (
                      <span className="text-danger">Please specify amount</span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div> */}
          {/* <h3 className="f-22 bold my-4 gray">Permanent Functional Deficit</h3> */}
          {/* <div className="row align-items-end">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What is your permanent functional deficit rate (DFP)?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    This is a percentage determined by a medical professional
                    that reflects the permanent impact of your injuries on your
                    ability to function.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["prof_dfp"]}
                  label="In percentage %"
                  name="prof_dfp"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What amount of compensation do you believe is fair for each
                  point of your permanent functional deficit?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    This amount will be multiplied by your DFP percentage to
                    calculate the total compensation for this aspect of your
                    claim.
                  </span>
                </label>
                <InputField
                  type="number"
                  error={formState.errors["totalAmt"]}
                  label="In percentage %"
                  name="totalAmt"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
          </div> */}
          <h3 className="f-22 bold my-4 gray">
            Impact on Life and Relationships
          </h3>
          <div className="row align-items-end">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  How many sports or cultural activities did you regularly
                  participate in before the accident?
                </label>
                <InputField
                  type="text"
                  error={formState.errors["activity"]}
                  name="activity"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                  emitChange={(val: any) => setActivity(val)}
                />
              </div>
            </div>

            {activity && Number(activity) > 0 && (
              <>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      What was the highest level of participation you achieved
                      in any of these activities?
                      <Image className="bubble" src={bubble} alt="" />
                      <span className="hover-tip">
                        Choose the option that best reflects your level of
                        involvement in any of the activities you listed.
                      </span>
                    </label>

                    <SelectField
                      options={options}
                      label=""
                      name="participation"
                      className="bglight-select"
                      error={formState.errors["participation"]}
                      control={control}
                    />
                  </div>
                </div>
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      Do you have any proof of your participation in these
                      activities?
                      <Image className="bubble" src={bubble} alt="" />
                      <span className="hover-tip">
                        Select the type of evidence you have to support your
                        claim of participation in these activities.
                      </span>
                    </label>
                    <SelectField
                      options={evidence}
                      label=""
                      name="evidence"
                      className="bglight-select"
                      error={formState.errors["evidence"]}
                      control={control}
                    />
                  </div>
                </div>
              </>
            )}

            {/* <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What amount of compensation do you believe is fair for the
                  loss of enjoyment of life caused by your injury?
                </label>
                <NumberField
                  error={formState.errors["compensation"]}
                  label="$"
                  name="compensation"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div> */}
          </div>
          {/* <h3 className="f-22 bold my-4 gray">Permanent Aesthetic Damage</h3> */}
          {/* <div className="row align-items-end">
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What is the severity of your permanent aesthetic damage?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Enter the number of points (out of 7) assigned by a medical
                    professional to rate the severity of your permanent scarring
                    or disfigurement.
                  </span>
                </label>
                <NumberField
                  error={formState.errors["severity_points"]}
                  label=""
                  name="severity_points"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What amount of compensation do you believe is fair for this
                  permanent aesthetic damage?
                </label>
                <NumberField
                  error={formState.errors["wanted_compensation"]}
                  label="$"
                  name="wanted_compensation"
                  variant="filled"
                  className="bglight-ip"
                  control={control}
                />
              </div>
            </div>
          </div> */}
          {/* <h3 className="f-22 bold my-4 gray">Sexual Harm (If Applicable)</h3> */}

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Has your injury caused a sexual harm?
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={sexualHarm}
                  onChange={handleharm}
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
                {errors.harmErr && (
                  <span className="text-danger">
                    Please select injury caused
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          {sexualHarm == "yes" && (
            <div className="row align-items-end">
              <div className="col-12 col-md-12 mb-4">
                <div className="radio-end-input two-cols mb-3">
                  <label className="d-block">
                    Has your injury caused any of the following?{" "}
                  </label>
                  <FormGroup>
                    {injuryCauseOptions.map((i, index) => {
                      return (
                        <Tooltip
                          key={index}
                          title={i.tooltip}
                          placement="bottom"
                          arrow
                        >
                          <FormControlLabel
                            key={index}
                            className="radio-light-ip"
                            value={i.value}
                            control={<Checkbox />}
                            label={i.label}
                            onChange={() => {
                              handleCheckChange(i.value);
                              if (!i.value) {
                                console.log("value of check box");
                              }
                            }}
                            checked={injuryCause.includes(i.value) ?? false}
                          />
                        </Tooltip>
                      );
                    })}
                  </FormGroup>
                  {errors.injuryCauseErr && (
                    <span className="text-danger">
                      Please select injury cause
                    </span>
                  )}
                </div>
                {/* {injuryCause.length > 0 && (
                  <div className="lease-input mb-4">
                    <label className="tooltip-title relative">
                      What amount of compensation do you believe is fair for the
                      sexual harm caused by your injury?
                    </label>
                    <TextField
                      placeholder="$"
                      type="number"
                      sx={{ width: "100%" }}
                      className="bglight-ip"
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        setFairAmt(event.target.value);
                        setErrors((prev) => {
                          let newErr = { ...prev };
                          newErr.fairAmtErr = false;
                          return newErr;
                        });
                      }}
                    />
                    {errors.fairAmtErr && (
                      <span className="text-danger">Please specify amount</span>
                    )}
                  </div>
                )} */}
              </div>
            </div>
          )}
          {/* <h3 className="f-22 bold my-4 gray">Loss of Establishment</h3> */}
          <div className="row align-items-end">
            <div className="col-12 col-md-6 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Has your injury impacted your ability to start a family or
                  have children?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={isInjuryImpact}
                    onChange={timeChange}
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
                  {errors.injuryErr && (
                    <span className="text-danger">
                      Please select injury impacted
                    </span>
                  )}
                </FormControl>
              </div>
            </div>

            <div className="col-12 col-md-6 mb-4">
              <div className="lease-input mb-4">
                <label className="tooltip-title relative">
                  What type of protection measure is in place for the victim?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    If applicable, please specify any legal protection measures
                    such as guardianship, curatorship, or judicial protection.
                    Select &quot;No protection measure&quot; if none are in
                    place.
                  </span>
                </label>
                <SelectField
                  options={protect}
                  label=""
                  name="protectionMeasure"
                  className="bglight-select"
                  error={formState.errors["protectionMeasure"]}
                  control={control}
                />
              </div>
            </div>

            {/* {isInjuryImpact === "yes" && (
              <div className="col-12 col-md-12 mb-4">
                <div className="lease-input mb-4">
                  <label className="tooltip-title relative">
                    What amount of compensation do you believe is fair for this
                    loss of establishment?
                  </label>
                  <TextField
                    type="number"
                    sx={{ width: "100%" }}
                    className="bglight-ip"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setEstablishmentLoss(event.target.value);
                      setErrors((prev) => {
                        let newErr = { ...prev };
                        newErr.injuryErr = false;
                        return newErr;
                      });
                    }}
                  />
                </div>
                {errors.injuryErr && (
                  <span className="text-danger">Please specify amount</span>
                )}
              </div>
            )} */}
          </div>
        </div>

        {/* <div className="col-12 col-md-12 text-end">
          <Button
            type="submit"
            variant="primary"
            className="green-btn"
            size="lg"
            isLoading={loading}
            onClick={() => checkError()}
          >
            <span className="f-16"> Next</span>
          </Button>
        </div> */}

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
              onClick={() => checkError()}
            >
              <span className="f-16"> Next</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default ProfessionalImpact;
