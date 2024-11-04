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
import { NumberField } from "@/components/Form/NumberField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import bubble from "@/assets/info.png";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Button } from "@/components/Form/Button";
import { Checkbox, FormGroup } from "@mui/material";
import TextAreaField from "@/components/Form/TextArea";
import axios from "axios";
import { Injury } from "@/types/Injury";

type FormValues = {
  victimsInfo: string;
  damageDescription: string;
  duration: string;
};

const schema = (victim: string): z.ZodSchema => {
  return z.object({
    victimsInfo:
      victim === "yes"
        ? z
            .string({
              required_error: "Please specify no.of victims and its relation",
            })
            .min(1, "Please specify no.of victims and its relation")
        : z.string().optional(),
    damageDescription:
      victim === "yes"
        ? z
            .string({ required_error: "Please specify about damages" })
            .min(1, "Please specify about damages")
        : z.string().optional(),
    duration:
      victim === "yes"
        ? z
            .string({ required_error: "Please specify the duration" })
            .min(1, "Please specify the duration")
        : z.string().optional(),
  });
};

const IndirectVictims = ({ data }: { data: Injury | undefined | null }) => {
  const router = useRouter();
  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");
  const [loading, setLoading] = useState(false);
  const [isInderictVictim, setIsInderictVictim] = React.useState("yes");
  const [isVictimLive, setIsVictimLive] = React.useState("yes");

  const { methods, setValues } = useHookForm<FormValues>(
    schema(isInderictVictim)
  );
  const { formState, control } = methods;

  const victimChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsVictimLive((event.target as HTMLInputElement).value);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsInderictVictim((event.target as HTMLInputElement).value);
    if (event.target.value === "no") {
      setValues({
        victimsInfo: "",
        damageDescription: "",
        duration: "",
      });
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      const payload = {
        caseId: caseId,
        ...values,
        isInderictVictim,
        isVictimLive,
      };

      const { data } = await axios.post(
        "/api/client/category/injury/createInjury",
        payload
      );
      console.log(data, "response of accident api");

      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");

      router.push(`/client/personal-injury-assessment-form/thanku-page`);
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
          //  progress: "90",
        }
      );
      // let id = data?.data?.caseId;

      // const searchParam = new URLSearchParams();
      // searchParam.set("caseId", id);
      // searchParam.set("progress", "90");

      // router.push(
      //   `/client/personal-injury-assessment-form?${searchParam.toString()}`
      // );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="lease-form">
      <h3 className="f-22 bold my-4 gray">
        Step 6: Details of Indirect Victims (If Applicable)
      </h3>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input mt-3">
              <label className="tooltip-title relative">
                Are there any indirect victims of this accident?
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={isInderictVictim}
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
              </FormControl>
            </div>
            {isInderictVictim === "yes" && (
              <>
                <div className="lease-input mb-3">
                  <label className="tooltip-title relative">
                    How many indirect victims are there, and what is their
                    relation to you?
                  </label>
                  <InputField
                    error={formState.errors["victimsInfo"]}
                    label="Indirect victims details"
                    name="victimsInfo"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
                <div className="lease-input mb-3">
                  <label className="tooltip-title relative">
                    What kind of damages have the indirect victims suffered?
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Describe the types of damages the indirect victims have
                      experienced (e.g., emotional distress, financial loss).
                    </span>
                  </label>
                  <TextAreaField
                    name="damageDescription"
                    label=""
                    placeholder="Types of damages"
                    error={formState.errors["damageDescription"]}
                    control={control}
                    variant="filled"
                    className="bglight-area"
                  />
                </div>
                <div className="mb-3 radio-end-input mt-3">
                  <label className="tooltip-title relative">
                    Do any of the indirect victims live with the victim?
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Indicate which indirect victim lived with the victim
                      before the accident.
                    </span>
                  </label>
                  <FormControl className="w-100">
                    <RadioGroup
                      className="w-100"
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={isVictimLive}
                      onChange={victimChange}
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
                <div className="lease-input mb-3">
                  <label className="tooltip-title relative">
                    Duration of caregiving
                    <Image className="bubble" src={bubble} alt="" />
                    <span className="hover-tip">
                      Enter the number of months the indirect victim spent
                      caring for the victim after the accident.
                    </span>
                  </label>
                  <InputField
                    type="number"
                    error={formState.errors["duration"]}
                    label="Duration of caregiving"
                    name="duration"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* <div className="col-12 col-md-12 text-end">
          <Button
            type="submit"
            variant="primary"
            className="green-btn"
            size="lg"
            // onClick={() => handleAddInput()}
          >
            <span className="f-16"> Next</span>
          </Button>
        </div> */}

        <div className="col-12 text-center mt-4">
          <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
            <Button
              variant="outline"
              size="lg"
              className="green-border f-16"
              onClick={() => handlePrevious()}
            >
              <span className="f-16">Previous</span>
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="green-btn"
              size="lg"
              // onClick={() => checkError()}
            >
              <span className="f-16"> Next</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default IndirectVictims;
