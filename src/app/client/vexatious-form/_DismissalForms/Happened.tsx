"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import bubble from "@/assets/info.png";
import {
  Autocomplete,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Tooltip } from "@mui/material";
import DateField from "@/components/Form/DateField";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";
import { Vexatious } from "@/types/Vexatious";

type FormValues = { otherEvent: string };

const happenedArr = [
  {
    label: "Unfounded accusations (e.g., falsely accused)",
    value: "Unfounded accusations",
    tooltip:
      "Check this box if you were accused of something you didn't do. Ex: Accused of theft that you did not commit.",
  },

  {
    label:
      "Real reason different from the stated reason (e.g., dismissed for 'performance' but the reason was different)",
    value: "Real reason",
    tooltip:
      "Check this box if the real reason for your dismissal differed from the stated reason. Ex: Officially dismissed for performance issues, but the actual reason was personal.",
  },

  {
    label:
      "Public dismissal announcement (e.g., in front of colleagues or clients)",
    value: "Public dismissal announcement",
    tooltip:
      "Check this box if your dismissal was announced in front of others. Ex: Announced during a meeting with the entire team.",
  },

  {
    label: "Denigration (e.g., belittled or insulted)",
    value: "Denigration",
    tooltip:
      "Check this box if your employer belittled or insulted you. Ex: Your superior called you 'lazy' in front of colleagues.",
  },

  {
    label: "Excessive procedure (e.g., unnecessarily long dismissal process)",
    value: "Excessive procedure",
    tooltip:
      "Check this box if the dismissal process was unnecessarily long. Ex: Dismissal process lasted several months without valid reason.",
  },
  {
    label: "Threats (e.g., threats of violence or legal action)",
    value: "Threats",
    tooltip:
      "Check this box if your employer threatened you. Ex: Your employer threatened legal action if you did not resign.",
  },
  {
    label: "Insulting behavior (e.g., offensive language)",
    value: "Insulting behavior",
    tooltip:
      "Check this box if your employer used offensive language. Ex: Your superior repeatedly insulted you.",
  },
  {
    label: "Isolation (e.g., excluded from meetings)",
    value: "Isolation",
    tooltip:
      "Check this box if you were excluded from work activities. Ex: You were no longer invited to important meetings.",
  },

  {
    label: "Other",
    value: "Other",
    tooltip:
      "Use this box to describe any other unfair aspect of your dismissal. Ex: Your employer falsified evidence against you.",
  },
];

const Happened = ({
  data,
  hide,
}: {
  data: Vexatious | undefined | null;
  hide: boolean;
}) => {
  const [eventsExperience, setEvents] = React.useState<string[]>([]);

  const schema = z.object({
    otherEvent: eventsExperience.includes("Other")
      ? z
          .string({
            required_error: "Please describe the other events",
          })
          .min(1, "Please describe the other events")
      : z.string().optional(),
  });

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    checkErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (eventsExperience.length == 0) {
      isError = true;
      errorObj = { ...errorObj, checkErr: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleDamages = (label: number) => {
    setEvents((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.checkErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/vexatious/createVexatious",
        {
          caseId: caseId,
          progress: 40,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "40");
      router.push(`/client/vexatious-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }
      let payload: any = {
        caseId: caseId,
        eventsExperience,
        otherEvent: eventsExperience.includes("Other") ? values.otherEvent : "",
      };

      if (!hide) {
        payload = { ...payload, progress: 60, nextProgress: 60 };
      }
      const { data } = await axios.post(
        "/api/client/category/vexatious/createVexatious",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "60");
        router.push(`/client/vexatious-form?${searchParam.toString()}`);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({ otherEvent: data?.otherEvent });
    setEvents(data?.eventsExperience ?? []);
  }, [data]);

  return (
    <div className="lease-form white-card rounded mt-4 indivi-form p-4">
      <h3 className="f-26 mt-4">Tell Us What Happened </h3>
      <p className="f-15">
        To better understand the circumstances surrounding your dismissal,
        please describe the events and situations you experienced. Your
        responses will help us evaluate the facts accurately.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-12 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative my-3">
                What events did you experience during your dismissal?
              </label>
              <FormGroup>
                {happenedArr.map((i: any, index: number) => {
                  return (
                    <Tooltip
                      key={index}
                      title={i.tooltip}
                      placement="bottom"
                      arrow
                    >
                      <FormControlLabel
                        disabled={hide}
                        key={index}
                        className="radio-light-ip"
                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleDamages(i.value)}
                        checked={eventsExperience.includes(i.value) ?? false}
                      />
                    </Tooltip>
                  );
                })}
              </FormGroup>
              {errors.checkErr && (
                <span className="text-danger">
                  Please select the events did you experience during dismissal
                </span>
              )}

              {eventsExperience.includes("Other") && (
                <div className="col-12 col-md-6 mb-4">
                  <div className="lease-input">
                    <label className="tooltip-title relative my-3">
                      Please, specify any other unfair aspect :
                    </label>
                    <InputField
                      error={formState.errors["otherEvent"]}
                      disabled={hide}
                      label=""
                      name="otherEvent"
                      variant="filled"
                      className="bglight-ip"
                      control={control}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
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
              className={`client-btn vexatious-submit-btn ${
                hide ? "d-none" : "block"
              }`}
              size="lg"
              onClick={() => errHandle()}
            >
              <span className="f-16">Next</span>
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default Happened;
