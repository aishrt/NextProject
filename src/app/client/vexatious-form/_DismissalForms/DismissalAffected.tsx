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

type FormValues = {};

const dismissalArr = [
  {
    label: "Physical health issues (e.g., stress, illnesses)",
    value: "Physical health issues",
    tooltip:
      "Check this box if you experienced physical health problems due to the dismissal. Ex: You developed back pain due to stress.",
  },

  {
    label: "Mental health issues (e.g., anxiety, depression)",
    value: "Mental health issues",
    tooltip:
      "Check this box if you experienced mental health problems due to the dismissal. Ex: You developed anxiety following the dismissal.",
  },

  {
    label: "Professional difficulties (e.g., difficulty finding a new job)",
    value: "Professional difficulties",
    tooltip:
      "Check this box if your dismissal affected your professional career. Ex: You have trouble finding a new job due to the dismissal.",
  },

  {
    label: "Personal difficulties (e.g., financial problems, family tensions)",
    value: "Personal difficulties",
    tooltip:
      "Check this box if your dismissal affected your personal life. Ex: Your dismissal caused tensions with your family.",
  },

  {
    label: "Impact on dignity (e.g., feeling humiliated)",
    value: "Impact on dignity",
    tooltip:
      "Check this box if you felt humiliated or your dignity was affected. Ex: You felt deeply humiliated by the public dismissal.",
  },
];

const DismissalAffected = ({
  data,
  hide,
}: {
  data: Vexatious | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({});

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
    if (dismissalAffected.length == 0) {
      isError = true;
      errorObj = { ...errorObj, checkErr: true };
    }
    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [dismissalAffected, setAffected] = React.useState<string[]>([]);

  const handleDismissal = (label: number) => {
    setAffected((prevState: any) => {
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
          progress: 50,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");
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
        dismissalAffected,
      };

      if (!hide) {
        payload = { ...payload, progress: 70, nextProgress: 70 };
      }
      const { data } = await axios.post(
        "/api/client/category/vexatious/createVexatious",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "70");
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
    setAffected(data?.dismissalAffected ?? []);
  }, [data]);

  return (
    <div className="lease-form white-card rounded mt-4 indivi-form p-4">
      <h3 className="f-26 mt-4">
        How Has Your Dismissal Affected You?
      </h3>
      <p className="f-15">
        Finally, we would like to know how your dismissal has affected you
        personally and professionally. This information is essential to assess
        the impact of your dismissal on your life.
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-12 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative my-3">
                How has your dismissal affected you?{" "}
              </label>
              <FormGroup>
                {dismissalArr.map((i: any, index: number) => {
                  return (
                    <Tooltip
                      key={index}
                      title={i.tooltip}
                      placement="bottom"
                      arrow
                    >
                      <FormControlLabel
                        key={index}
                        disabled={hide}
                        className="radio-light-ip"
                        control={<Checkbox />}
                        label={i.label}
                        onChange={() => handleDismissal(i.value)}
                        checked={dismissalAffected.includes(i.value) ?? false}
                      />
                    </Tooltip>
                  );
                })}
              </FormGroup>
              {errors.checkErr && (
                <span className="text-danger">
                  Please select the dismissal affected you
                </span>
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

export default DismissalAffected;
