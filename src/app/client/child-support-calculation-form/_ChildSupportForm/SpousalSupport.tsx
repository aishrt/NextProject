"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Form/Button";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";

import CircularProgress from "@mui/material/CircularProgress";
import { Child } from "@/types/Child";

type FormValues = {};
const schema = z.object({});

const SpousalSupport = ({ data }: { data: Child | undefined }) => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const [err, setErr] = useState(false);

  const [spousalSupport, setValue] = React.useState("");

  const [spousaldata, setSpousaldata] = useState();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErr(false);
  };
  const { formState, control } = methods;

  useEffect(() => {
    setValue(data?.spousalSupport ?? "");
  }, [data]);

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);

      if (!spousalSupport) {
        return setErr(true);
      }

      let progress;
      let nextProgress;
      if (spousalSupport == "yes" && !spousaldata) {
        progress = 90;
        nextProgress = 90;
      } else {
        progress = 100;
        nextProgress = 100;
      }
      const { data } = await axios.post(
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          spousalSupport,
          progress: progress,
          nextProgress: nextProgress,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);

      if (spousalSupport == "no") {
        searchParam.set("progress", "100");
        router.push(
          `/client/child-support-calculation-form?${searchParam.toString()}`
        );
      }
      if (spousalSupport == "yes") {
        searchParam.set("progress", "90");
        // router.push(
        //   `/client/child-support-calculation-form?${searchParam.toString()}`
        // );
        router.push(`/client/spousal-support?${searchParam.toString()}`);
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
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          progress: 70,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");
      router.push(
        `/client/child-support-calculation-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getcaseData = async () => {
      if (caseId) {
        const { data } = await axios.get(
          `/api/client/category/spousal/getSpousal?caseId=${caseId}`
        );
        setSpousaldata(data?.data);
      }
    };
    getcaseData();
  }, [data]);

  console.log(spousaldata);

  return (
    <div className="lease-form white-card p-4 rounded mt-4  indivi-form">
      <h3 className="f-22 bold mt-4  gray">Spousal Support</h3>

      <h4 className="f-16 my-4 gray">
        Would you also like to request spousal support? If you have additional
        financial needs related to spousal support, this step will guide you
        through that process. Combining child and spousal support requests can
        streamline the assessment and provide a comprehensive support plan.
      </h4>

      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
          <div className="row mt-4">
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  Would you like to request spousal support (alimony) as well?
                </label>
                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={spousalSupport}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="yes"
                      control={<Radio />}
                      label="Yes, I'd like to start the spousal support request process."
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="no"
                      control={<Radio />}
                      label="No, I only need assistance with child support."
                    />
                  </RadioGroup>

                  {err && (
                    <span className="text-danger">
                      Please select, if you like to request spousal support
                    </span>
                  )}
                </FormControl>
              </div>
            </div>

            <div className="col-12 text-center mt-4">
              <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
                <Button
                  variant="contained"
                  className="client-btn"
                  size="lg"
                  onClick={() => handlePrevious()}
                >
                  Previous
                </Button>

                <Button
                  type="submit"
                  variant="outline"
                  size="lg"
                  className="next-btn"
                >
                  <span className="f-16">Next</span>
                </Button>
              </div>
            </div>
          </div>
        </Form>
      )}
    </div>
  );
};

export default SpousalSupport;
