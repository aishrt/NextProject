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
  circumstances: string;
};

const evidenceArr = [
  {
    label: "Constructive dismissal letter",
    value: "Constructive dismissal letter",
    tooltip:
      "The official letter from the employee informing the employer of the constructive dismissal, dated and signed by the employee.",
  },
  {
    label: "Relevant emails",
    value: "Relevant emails",
    tooltip:
      "Any email exchanges between the employee and employer regarding the reasons for the constructive dismissal.",
  },
  {
    label: "Meeting notes",
    value: "Meeting notes",
    tooltip:
      "Minutes or notes taken during disciplinary meetings or follow-up interviews between the employee and the employer.",
  },
  {
    label: "Other documents",
    value: "Other documents",
    tooltip:
      "Any other relevant documents for the constructive dismissal, such as written testimonies from colleagues,performance reports, or meeting recordings.",
  },
];

const SideStory = ({
  data,
  hide,
}: {
  data: Dismissal | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({
    circumstances: z
      .string({
        required_error:
          "Please explain the circumstances of your constructive dismissal",
      })
      .min(
        1,
        "Please explain the circumstances of your constructive dismissal"
      ),
  });

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    evidenceErr: false,
    reasonErr: false,
  });

  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!evidence) {
      isError = true;
      errorObj = { ...errorObj, evidenceErr: true };
    }
    if (evidence == "yes" && documents.length == 0) {
      isError = true;
      errorObj = { ...errorObj, reasonErr: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };
  const [evidence, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.evidenceErr = false;
      return newErrorObj;
    });
  };

  const [documents, setReason] = React.useState<string[]>([]);

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
          progress: 50,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");
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
        ...values,
        evidence,
        documents: evidence == "yes" ? documents : [],
      };

      if (!hide) {
        payload = { ...payload, progress: 70, nextProgress: 70 };
      }
      const { data } = await axios.post(
        "/api/client/category/dismissal/createDismissal",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "70");
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
    setValue(data?.evidence ?? "");
    setValues({ ...data });
    setReason(data?.documents ?? []);
  }, [data]);

  return (
    <div className="lease-form white-card p-4 mt-4 indivi-form rounded">
      <h3 className="f-26 mt-4">Your Side of the Story and Evidence</h3>
      <p className="f-18 fw-500">
        Tell us more about what happened and provide any evidence you have
      </p>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-4">
            <div className="lease-input">
              <label className="tooltip-title relative">
                Can you explain the circumstances of your constructive
                dismissal?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Provide details on the constructive dismissal, including dates
                  and relevant documents. The more details you provide, the more
                  precise your request will be.{" "}
                </span>
              </label>

              <TextAreaField
                name="circumstances"
                label=""
                disabled={hide}
                placeholder=""
                error={formState.errors["circumstances"]}
                control={control}
                variant="filled"
                className="bglight-area"
              />
            </div>
          </div>

          <div className="col-12 col-md-6 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Do you have documentary evidence of the constructive dismissal?
                <Image className="bubble" src={bubble} alt="" />
                <span className="hover-tip">
                  Select &quot;Yes&quot; if you have documents such as letters,
                  emails, or meeting notes related to the constructive
                  dismissal.
                </span>
              </label>

              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={evidence}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="yes"
                    control={<Radio />}
                    disabled={hide}

                    label="Yes"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    disabled={hide}

                    value="no"
                    control={<Radio />}
                    label="No"
                  />
                </RadioGroup>

                {errors.evidenceErr && (
                  <span className="text-danger">
                    Please select, if you have documentary evidence
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          {evidence == "yes" && (
            <div className="col-12 col-md-12 mb-4">
              <div className="lease-input">
                <label className="tooltip-title relative">
                  What documents are available?{" "}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Select all types of documents you can provide to prove the
                    constructive dismissal.
                  </span>
                </label>

                <FormGroup>
                  {evidenceArr.map((i: any, index: number) => {
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
                          control={<Checkbox />}
                          label={i.label}
                          onChange={() => handleEvidence(i.value)}
                          checked={documents.includes(i.value) ?? false}
                          disabled={hide}

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

export default SideStory;
