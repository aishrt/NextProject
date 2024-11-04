"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import DateField from "@/components/Form/DateField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import bubble from "@/assets/info.png";
import { InputAdornment } from "@mui/material";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import TextAreaField from "@/components/Form/TextArea";
import euro from "@/assets/euro.png";
import axios from "axios";
import thank from "@/assets/thank.png";
import { Button } from "@/components/Form/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Eviction } from "@/types/Eviction";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";

type FormValues = {
  collectiveProcedures: string;
};

const options = [
  {
    label: "None",
    value: "None",
  },
  {
    label: "Safeguard",
    value: "Safeguard",
  },
  {
    label: "Recovery",
    value: "Recovery",
  },

  {
    label: "Liquidation",
    value: "Liquidation",
  },
  {
    label: "Do not know",
    value: "Do not know",
  },
];

const LegalAspects = ({
  data,
  hide,
}: {
  data: Eviction | undefined | null;
  hide: boolean;
}) => {
  const schema = z.object({
    collectiveProcedures: ((msg) =>
      z.string({ required_error: msg }).min(1, msg))(
      "Please select the collective procedures for your business"
    ),
  });

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);

  const { formState, control } = methods;

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      let payload: any = {
        caseId: caseId,
        ...values,
      };

      if (!hide) {
        payload = { ...payload, progress: 120, nextProgress: 120 };
      }
      const { data } = await axios.post(
        "/api/client/category/eviction/createEviction",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "120");
        router.push(
          `/client/eviction-assessment-form?${searchParam.toString()}`
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
        "/api/client/category/eviction/createEviction",
        {
          caseId: caseId,
          progress: 100,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "100");
      router.push(`/client/eviction-assessment-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      collectiveProcedures: data?.collectiveProcedures,
    });
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h6 className="f-26  fw-400 pb-3"> Legal Aspects</h6>
      <div>
        <h2 className="f-15 fw-500">
          Finally, we need to check if there are any specific legal aspects that
          could affect your situation.
        </h2>
      </div>

      {loading ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : (
        <>
          <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
            <div className="row mt-5">
              <div className="col-12 col-md-12 mb-3">
                <div className="row">
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="tooltip-title relative">
                        Are there any ongoing collective procedures for your
                        business?
                        <Image className="bubble" src={bubble} alt="" />
                        <span className="hover-tip">
                          If applicable, indicate if your business is currently
                          involved in any collective insolvency proceedings.
                        </span>
                      </label>

                      <SelectField
                      disabled={hide} 
                        options={options}
                        label=""
                        name="collectiveProcedures"
                        className="bglight-select"
                        error={formState.errors["collectiveProcedures"]}
                        control={control}
                      />
                    </div>
                  </div>
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
                  className={`client-btn eviction-submit-btn ${
                    hide ? "d-none" : "block"
                  }`}
                  size="lg"
                >
                  <span className="f-16">Next</span>
                </Button>
              </div>
            </div>
          </Form>
        </>
      )}
    </div>
  );
};

export default LegalAspects;
