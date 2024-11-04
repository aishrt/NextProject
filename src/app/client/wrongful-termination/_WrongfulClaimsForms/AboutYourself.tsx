"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { Wrongful } from "@/types/Wrongful";
import bubble from "@/assets/info.png";
import Image from "next/image";

const AboutYourself = ({
  data,
  hide,
}: {
  data: Wrongful | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "20");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [err, setErr] = useState(false);

  const [peopleWorked, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErr(false);
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      if (!peopleWorked) {
        return setErr(true);
      }
      let payload: any = {
        caseId: caseId,
        peopleWorked,
      };
      if (!hide) {
        payload = { ...payload, progress: 40, nextProgress: 40 };
      }
      const { data } = await axios.post(
        "/api/client/category/wrongful/createWrongful",
        payload
      );

      let id = data.data.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "40");
        router.push(`/client/wrongful-termination?${searchParam.toString()}`);
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
        "/api/client/category/wrongful/createWrongful",
        {
          caseId: caseId,
          progress: 20,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "20");
      router.push(`/client/wrongful-termination?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue(data?.peopleWorked ?? "");
  }, [data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray">Tell us About Yourself</h3>
      <p className="f-14 gray">
        {data?.role == "Employee"
          ? "We know that losing a job can be a challenging experience. Your answers will help us understand the circumstances of your termination."
          : "We understand that terminating an employee can be a difficult and stressful decision. Your cooperation will help us evaluate the situation fairly."}
      </p>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div className="row mt-3">
            <div className="col-12 col-md-12 mb-4">
              <div className="mb-3 radio-end-input">
                <label className="tooltip-title relative">
                  {data?.role == "Employee"
                    ? "How many people worked in the company where you were employed at the time of your termination?"
                    : "How many people worked in your company at the time of the employee's termination?"}
                  <Image src={bubble} className="bubble" alt="" />
                  <span className="hover-tip">
                    Choose the range corresponding to the total number of
                    employees in the company at the time of your termination.
                  </span>
                </label>

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={peopleWorked}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="1-10"
                      control={<Radio />}
                      label="1-10"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="11-50"
                      control={<Radio />}
                      label="11-50"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="51-200"
                      control={<Radio />}
                      label="51-200"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="200+"
                      control={<Radio />}
                      label="200+"
                    />
                  </RadioGroup>
                  {err && (
                    <span className="text-danger f-14">
                      Please select the approximate number of employees
                    </span>
                  )}
                </FormControl>
              </div>
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
              <Button
                variant="outline"
                size="lg"
                className={`green-border f-16 ${hide ? "d-none" : "block"}`}
                onClick={() => handlePrevious()}
              >
                <span className="f-16">Previous</span>
              </Button>

              <Button
                variant="contained"
                className={`green-btn wrongful-submit-btn ${
                  hide ? "d-none" : "block"
                }`}
                size="lg"
                onClick={handleClick}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AboutYourself;
