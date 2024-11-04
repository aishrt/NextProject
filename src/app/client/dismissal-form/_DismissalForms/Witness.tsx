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
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import Image from "next/image";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Dismissal } from "@/types/Dismissal";
import { Tooltip } from "@mui/material";
import DateField from "@/components/Form/DateField";
import { InputField } from "@/components/Form/InputField";
import SelectField from "@/components/Form/SelectField";
import TextAreaField from "@/components/Form/TextArea";

type FormValues = {
  otherConduct: string;
};

const conductArr = [
  {
    label: "Non-payment of part of the salary",
    value: "Non-payment",
    tooltip:
      "My employer did not pay my year-end bonuses despite several reminders. I worked for three months without receiving my full salary.",
  },
  {
    label: "Change in salary structure",
    value: "Change in salary structure",
    tooltip:
      "My employer changed my salary structure by removing sales commissions without my agreement, which significantly reduced my salary.",
  },
  {
    label: "Refusal to recognize overtime worked",
    value: "Refusal",
    tooltip:
      "I regularly worked overtime that was never recognized or paid despite my repeated requests.",
  },

  {
    label: "Violation of the principle of equal treatment",
    value: "Violation",
    tooltip:
      "I noticed that my male colleagues, occupying similar positions, were receiving higher pay than me.",
  },

  {
    label: "Reduction in responsibilities",
    value: "Reduction",
    tooltip:
      "My responsibilities were reduced without explanation, from project manager to simple assistant.",
  },

  {
    label: "Isolation",
    value: "Isolation",
    tooltip:
      "I was isolated from the team, had all my important files taken away, and was no longer invited to meetings.",
  },

  {
    label: "Other",
    value: "other",
    tooltip: "",
  },
];

const Witness = ({
  data,
  hide,
}: {
  data: Dismissal | undefined | null;
  hide: boolean;
}) => {
  const [misconducts, setReason] = React.useState<string[]>([]);

  const [misconduct, setConduct] = React.useState("");

  const schema = z.object({
    otherConduct:
      misconduct == "yes" && misconducts.includes("other")
        ? z
            .string({
              required_error: "Please specify the other reason",
            })
            .min(1, "Please specify the other reason")
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
    witnessErr: false,
    conductErr: false,
    reasonErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };
    if (!witness) {
      isError = true;
      errorObj = { ...errorObj, witnessErr: true };
    }
    if (!misconduct) {
      isError = true;
      errorObj = { ...errorObj, conductErr: true };
    }

    if (misconduct == "yes" && misconducts.length == 0) {
      isError = true;
      errorObj = { ...errorObj, reasonErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [witness, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.witnessErr = false;
      return newErrorObj;
    });
  };

  const handleConduct = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConduct((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.conductErr = false;
      return newErrorObj;
    });
  };

  const handleEvidence = (label: number) => {
    setReason((prevState: any) => {
      const prevCategories = Array.isArray(prevState) ? prevState : [];
      const updatedCategories = prevCategories.includes(label)
        ? prevCategories.filter((item) => item !== label)
        : [...prevCategories, label];
      setErrors((prev) => {
        let newErrorObj = { ...prev };
        newErrorObj.reasonErr = false;
        return newErrorObj;
      });
      return updatedCategories;
    });
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/dismissal/createDismissal",
        {
          caseId: caseId,
          progress: 60,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");
      router.push(`/client/dismissal-form?${searchParam.toString()}`);
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
        witness,
        misconduct,
        misconducts: misconduct == "yes" ? misconducts : [],
        otherConduct:
          misconduct == "yes" && misconducts.includes("other")
            ? values.otherConduct
            : "",
      };

      if (!hide) {
        payload = { ...payload, progress: 80, nextProgress: 80 };
      }
      const { data } = await axios.post(
        "/api/client/category/dismissal/createDismissal",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "80");
        router.push(`/client/dismissal-form?${searchParam.toString()}`);
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
    setValue(data?.witness ?? "");
    setReason(data?.misconducts ?? []);
    setConduct(data?.misconduct ?? "");
    setValues({ ...data });
  }, [data]);

  return (
    <div className="lease-form white-card p-4 mt-4 indivi-form rounded">
      <h3 className="f-26 mt-4">Witnesses and Employer Misconduct </h3>
      <h2 className="f-18 fw-500 mt-4 ">
        Provide additional information on witnesses and employer misconduct.
      </h2>
      <p className="f-15">
        Having information about witnesses and any serious misconduct by the
        employer helps strengthen your claim and provides a clearer picture of
        your situation.{" "}
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Are there any witnesses to the dismissal or constructive
                dismissal? <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select &quot;Yes&quot; if colleagues or others can testify to
                  the circumstances of the dismissal or constructive dismissal.
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={witness}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    disabled={hide}
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="no"
                    disabled={hide}
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>

                {errors.witnessErr && (
                  <span className="text-danger">
                    Please select, if there any witness to the dismissal
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Have any serious employer misconducts been identified?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select &quot;Yes&quot; if you have identified serious
                  misconduct by the employer, otherwise choose &quot;No.&quot;
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={misconduct}
                  onChange={handleConduct}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    disabled={hide}
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="no"
                    control={<Radio />}
                    disabled={hide}
                    label="No"
                  />
                </RadioGroup>

                {errors.conductErr && (
                  <span className="text-danger">
                    Please select, if any serious employer misconducts been
                    identified
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          {misconduct == "yes" && (
            <div className="col-12 col-md-12 mb-4">
              <div className="lease-input">
                <label className="tooltip-title relative">
                  What misconducts have been identified?
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Select the misconducts identified. You can choose multiple.
                    The more details you provide, the more precise your request
                    will be.
                  </span>
                </label>

                <FormGroup>
                  {conductArr.map((i: any, index: number) => {
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
                          onChange={() => handleEvidence(i.value)}
                          checked={misconducts.includes(i.value) ?? false}
                        />
                      </Tooltip>
                    );
                  })}
                </FormGroup>
                {errors.reasonErr && (
                  <span className="text-danger">
                    Please select the reasons for the constructive dismissal
                  </span>
                )}
              </div>

              {misconducts.includes("other") && (
                <div className="col-md-6 lease-input mb-4">
                  <label className="tooltip-title relative">Others</label>

                  <InputField
                    error={formState.errors["otherConduct"]}
                    label=""
                    name="otherConduct"
                    variant="filled"
                    disabled={hide}
                    className="bglight-ip"
                    control={control}
                  />
                </div>
              )}
            </div>
          )}
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
              className={`client-btn dismissal-submit-btn ${
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

export default Witness;
