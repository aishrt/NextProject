"use client";

import React from "react";

import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import Image from "next/image";
import bubble from "@/assets/info.png";
import { Checkbox, FormControlLabel, FormGroup, Tooltip } from "@mui/material";
import { Sudden } from "@/types/Sudden";
import TerminationForm from "./TerminationForm";
import SideStory from "./SideStory";
import AboutBusiness from "./AboutBusiness";
import WhatTheyDid from "./WhatTheyDid";

type FormValues = {};

const schema = z.object({});

const Review = ({ data }: { data: Sudden | undefined | null }) => {
  const alldata = data;
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const router = useRouter();
  const { formState, control } = methods;

  const [formData, setData] = useState<Sudden | null>();

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);

  const [checked, setChecked] = React.useState(false);
  const [err, setErr] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setErr(false);
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      document
        .querySelectorAll<HTMLElement>(".sudden-submit-btn")
        .forEach((div: HTMLElement | null) => {
          if (div) {
            div.click();
          }
        });

      if (!checked) {
        return setErr(true);
      }
      console.log(checked, "checked");

      const { data } = await axios.post(
        "/api/client/category/sudden/createSudden",
        {
          caseId: caseId,
          checked,
          progress: 70,
          nextProgress: 70,
        }
      );

      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");

      router.push(
        `/client/sudden-contract-termination?${searchParam.toString()}`
      );

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
        "/api/client/category/sudden/createSudden",
        {
          caseId: caseId,
          progress: 50,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");
      router.push(
        `/client/sudden-contract-termination?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setData(data);
    setChecked(data?.checked ?? false);
    setValues({
      // initialRent: data?.initialRent?.toString(),
    });
  }, [data]);

  const clearForm = () => {
    setChecked(false);
    setData(null);
    // data?.financial ? [] : [];
  };

  return (
    <div className="lease-form mt-4 indivi-form rounded side-story">
      <h3 className="f-26 fw-400">Review & Submit </h3>
      {loading ? (
        <p className="text-center mt-5">
          <CircularProgress />
        </p>
      ) : (
        <>
          <div className="row align-items-end mt-3">
            <p className="f-16">
              {" "}
              Please review your information below carefully before submitting.
              Make sure all the information is correct.
            </p>
          </div>
          <TerminationForm data={formData} hide={true} />
          <SideStory data={formData} hide={true} />
          <AboutBusiness data={formData} hide={true} />
          <WhatTheyDid data={formData} hide={true} />

          <div className="row mt-4">
            <p className="f-15">
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
                  <span className="f-16">Clear Form</span>
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
