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
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import bubble from "@/assets/info.png";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import { Checkbox, FormGroup, TextField, Tooltip } from "@mui/material";
import axios from "axios";
import { Injury } from "@/types/Injury";

type FormValues = {
  injury: string;
  date: string;
  gender: string;
  others: string;
};

const options = [
  { label: "Deceased", value: "Deceased" },
  { label: "Amputation", value: "Amputation" },
  { label: "Head Trauma", value: "Head Trauma" },
  {
    label: "Spinal Cord (tetraplegic or paraplegic)",
    value: "Spinal Cord (tetraplegic or paraplegic)",
  },
  { label: "Brachial Plexus", value: "Brachial Plexus" },
  { label: "Depressive Syndrome", value: "Depressive Syndrome" },
  {
    label: "Orthopedic (fractures, reduced mobility)",
    value: "Orthopedic (fractures, reduced mobility)",
  },
  { label: "Cervical", value: "Cervical" },
  { label: "Other", value: "Other" },
];
const situation = [
  { label: "Home", value: "Home" },
  { label: "Residence (please specify type)", value: "Residence" },
  { label: "Office/Desk Worker", value: "officeWorker" },
  { label: "Unemployed/On Welfare", value: "welfare" },
  { label: "Retired", value: "retired" },
];

const schema = z.object({
  injury: z.string().optional(),
});

const injuryOptions = [
  {
    label: "Deceased",
    value: "deceased",
    tooltip:
      "If the victim has passed away due to the accident, please select this option",
  },
  {
    label: "Amputation",
    value: "amputation",
    tooltip:
      "Select this option if the accident resulted in the loss of a limb or other body part.",
  },
  {
    label: "Head Trauma",
    value: "head trauma",
    tooltip:
      "Choose this option if the accident caused a significant injury to the head, such as a concussion or traumatic brain injury.",
  },
  {
    label: "Spinal Cord (tetraplegic or paraplegic)",
    value: "spinal cord",
    tooltip:
      "Select this if the accident led to paralysis affecting either all four limbs (tetraplegia) or the lower half of the body (paraplegia).",
  },
  {
    label: "Brachial Plexus",
    value: "brachial plexus",
    tooltip:
      "Choose this option if the injury involves the brachial plexus, causing nerve damage and affecting arm movement or sensation.",
  },
  {
    label: "Depressive Syndrome",
    value: "depressive syndrome",
    tooltip:
      "Select this if the accident has resulted in a diagnosed depressive disorder, impacting your mental health and daily functioning.",
  },
  {
    label: "Orthopedic (fractures, reduced mobility)",
    value: "orthopedic",
    tooltip:
      "Choose this option for injuries involving broken bones or other orthopedic issues that limit your movement.",
  },
  {
    label: "Cervical",
    value: "cervical",
    tooltip:
      "Select this if the accident caused injuries to the cervical spine (neck area), affecting mobility and causing pain or discomfort.",
  },
  {
    label: "Other (please specify) ",
    value: "other",
    tooltip: "",
  },
];

const YourInjury = ({
  data,
  hide,
}: {
  data: Injury | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const router = useRouter();
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);
  const [isMedicalExamined, setIsMedicalExamined] = React.useState("");
  const [time, setTime] = React.useState("yes");
  const [allInjury, setAllInjury] = useState<string[]>([]);
  const [otherInjury, setOtherInjury] = useState<string>("");
  const [errors, setErrors] = React.useState({
    allInjuryErr: "",
    otherInjuryErr: "",
    medicalErr: "",
  });

  const checkInjuryErr = () => {
    let isErr = false;
    let errorObj = { ...errors };
    if (allInjury.length === 0) {
      isErr = true;
      errorObj.allInjuryErr = "Please select injury";
    }
    if (allInjury.includes("other") && !otherInjury) {
      isErr = true;
      errorObj.otherInjuryErr = "Please specify other injury";
    }

    if (!isMedicalExamined) {
      isErr = true;
      errorObj.medicalErr = "Please select the medical examination";
    }

    if (isErr) {
      setErrors(errorObj);
    }
    return isErr;
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      if (checkInjuryErr()) {
        return;
      }
      setLoading(true);
      let payload: any = {
        caseId: caseId,
        allInjury,
        otherInjury,
        isMedicalExamined,
        // progress: isMedicalExamined === "yes" ? "50" : "70",
        // nextProgress: isMedicalExamined === "yes" ? "50" : "70",
      };
      if (!hide) {
        payload = {
          ...payload,
          progress: isMedicalExamined === "yes" ? "50" : "70",
          nextProgress: isMedicalExamined === "yes" ? "50" : "70",
        };
      }
      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        payload
      );
      let id = data?.data?.caseId;
      const isExamined = data?.data?.isMedicalExamined;
      console.log(id);

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", isMedicalExamined === "yes" ? "50" : "70");

        router.push(
          `/client/personal-injury-assessment-form?${searchParam.toString()}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsMedicalExamined((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.medicalErr = "";
      return newErr;
    });
  };

  const handleInjuryCheck = (val: string) => {
    if (val !== "others") {
      setOtherInjury("");
    }
    setAllInjury((prev) => {
      const prevInjuries = Array.isArray(prev) ? prev : [];
      const newArr = prevInjuries.includes(val)
        ? prevInjuries.filter((i) => i !== val)
        : [...prevInjuries, val];
      return newArr;
    });
    setErrors((prev) => {
      let newErr = { ...prev };
      newErr.allInjuryErr = "";
      return newErr;
    });
  };
  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        {
          caseId: caseId,
          progress: 30,
        }
      );

      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "30");
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
    setAllInjury(data?.allInjury ?? []),
      setOtherInjury(data?.otherInjury ?? ""),
      setIsMedicalExamined(data?.isMedicalExamined ?? "");
  }, [data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold my-4 gray">Your Injuries (Sequelae) </h3>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input md-3">
              <label className="d-block">
                Please check all injuries that apply
              </label>
              <FormGroup>
                {injuryOptions.map((i, index) => {
                  return (
                    <Tooltip key={index} title={i.tooltip} placement="top">
                      <FormControlLabel
                        key={index}
                        label={i.label}
                        className="radio-light-ip"
                        control={<Checkbox />}
                        onChange={() => handleInjuryCheck(i.value)}
                        checked={allInjury.includes(i.value) ?? false}
                      />
                    </Tooltip>
                  );
                })}
                {errors.allInjuryErr && (
                  <span className="text-danger">{errors.allInjuryErr}</span>
                )}
              </FormGroup>
            </div>
            {allInjury.includes("other") && (
              <div className="lease-input mt-4">
                <label className="tooltip-title relative">
                  Other (Please Specify)
                </label>
                <TextField
                  type="text"
                  className="bglight-ip"
                  sx={{ width: "100%" }}
                  placeholder="Specify other injury"
                  value={otherInjury}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    setOtherInjury(event.target.value);
                    setErrors((prev) => {
                      let newErr = { ...prev };
                      newErr.otherInjuryErr = "";
                      return newErr;
                    });
                  }}
                />
                {errors.otherInjuryErr && (
                  <span className="text-danger">{errors.otherInjuryErr}</span>
                )}
              </div>
            )}
          </div>
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Have you undergone a medical examination to assess the
                consequences of the injury?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Indicate whether a medical assessment of your injuries has
                  been conducted
                </span>
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={isMedicalExamined}
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

                {errors.medicalErr && (
                  <span className="text-danger">{errors.medicalErr}</span>
                )}
              </FormControl>
            </div>
          </div>
        </div>

        {/* <div className="col-12 col-md-12 text-end">
          <Button
            type="submit"
            variant="primary"
            className="green-btn"
            size="lg"
            onClick={() => checkInjuryErr()}
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
              onClick={() => checkInjuryErr()}
            >
              <span className="f-16"> Next</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default YourInjury;
