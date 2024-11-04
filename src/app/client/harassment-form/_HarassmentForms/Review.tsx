"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import { InputField } from "@/components/Form/InputField";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import DateField from "@/components/Form/DateField";

import { Harassment } from "@/types/Harassment";
import AboutYourself from "./AboutYourself";
import Health from "./Health";
import Employer from "./Employer";
import GeneralInfo from "./GeneralInfo";
import MoralElements from "./MoralElements";
import Evidence from "./Evidence";
import Damages from "./Damages";
import EmployerAction from "./EmployerAction";

type FormValues = {
  contractDate: string;
  contractDuration: string;
  initialRent: string;
  lastRent: string;
};

const schema = z.object({});

const Review = ({ data }: { data: Harassment | undefined }) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");
  const [formData, setData] = useState<Harassment | null>();

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { formState, control } = methods;

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setErr(false);
  };

  const [err, setErr] = useState(false);

  useEffect(() => {
    setData(data);
    setChecked(data?.checked ?? false);
    // setValues({
    //   contractDate: data?.contractDate,
    //   contractDuration: data?.contractDuration?.toString(),
    //   initialRent: data?.initialRent?.toString(),
    // });
  }, [data]);

  const clearForm = () => {
    setChecked(false);
    setData(null);
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      document
        .querySelectorAll<HTMLElement>(".harassment-submit-btn")
        .forEach((div: HTMLElement | null) => {
          if (div) {
            div.click();
          }
        });

      if (!checked) {
        return setErr(true);
      }

      const { data } = await axios.post(
        "/api/client/category/harassment/createHarassment",
        {
          caseId: caseId,
          checked,
          progress: 120,
          nextProgress: 120,
        }
      );

      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "120");
      router.push(`/client/harassment-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form">
      <h3 className="f-26 fw-500 mt-5"> Review & Submit</h3>

      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <>
          <p  className="f-16">Please review your information carefully before submitting.</p>

          <AboutYourself data={formData} hide={true} />
          <Health data={formData} hide={true} />
          <Employer data={formData} hide={true} />
          <GeneralInfo data={formData} hide={true} />
          <MoralElements data={formData} hide={true} />
          <Evidence data={formData} hide={true} />
          <Damages data={formData} hide={true} />
          <EmployerAction data={formData} hide={true} />

          <div className="row mt-4">
            <p className="f-15 pb-3">
              {`By clicking "Submit," you confirm that the information provided
                is accurate to the best of your knowledge.`}
            </p>
            <div className="checkbox-review consent  mb-4">
              <label className="f-18 fw-500">Consent :</label>
              <div className="mb-3 radio-end-input f-13">
                <FormGroup>
                  <FormControlLabel
                    className="radio-light-ip"
                    control={
                      <Checkbox checked={checked} onChange={handleChange} />
                    }
                    label="I confirm that the information I have provided is accurate to the best of my knowledge, and I consent to the terms of the [Privacy Policy]."
                  />
                </FormGroup>
              </div>

              {err && (
                <span className="text-danger mt-0">
                  Please confirm your consent before submitting
                </span>
              )}
            </div>
            <div className="col-12 text-center mt-4">
              <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
                <Button
                  variant="contained"
                  size="lg"
                  className="client-btn"
                  onClick={handleClick}
                >
                  <span className="f-16">Submit</span>
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="next-btn f-16"
                  onClick={() => clearForm()}
                >
                  <span className="f-16" >
                    Clear Form
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Review;
