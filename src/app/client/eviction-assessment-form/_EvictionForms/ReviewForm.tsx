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
import bubble from "@/assets/bubble.png";
import { Button } from "@/components/Form/Button";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";
import { Eviction } from "@/types/Eviction";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
} from "@mui/material";
import axios from "axios";
import LeaseForm from "./LeaseForm";
import Activity from "./Activity";
import Premises from "./Premises";
import Building from "./Building";
import LegalAspects from "./LegalAspects";
import BusinessCharacteristics from "./BusinessCharacteristics";
import LocalFactors from "./LocalFactors";
import Renewal from "./Renewal";
import BusinessValuation from "./BusinessValuation";
import Lease from "./Lease";

type FormValues = {};

const schema = z.object({});

const ReviewForm = ({ data }: { data: Eviction | null | undefined }) => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");
  const [formData, setData] = useState<Eviction | null>();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

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
        .querySelectorAll<HTMLElement>(".eviction-submit-btn")
        .forEach((div: HTMLElement | null) => {
          if (div) {
            div.click();
          }
        });

      if (!checked) {
        return setErr(true);
      }

      const { data } = await axios.post(
        "/api/client/category/eviction/createEviction",
        {
          caseId: caseId,
          checked,
          progress: 130,
          nextProgress: 130,
        }
      );

      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "130");
      router.push(`/client/eviction-assessment-form?${searchParam.toString()}`);
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
      <h6 className="f-26  fw-400 pb-3 mt-5"> Review & Submit</h6>

      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <>
          <p className="f-15 fw-500">Please review your information carefully before submitting.</p>

          <LeaseForm data={formData} hide={true} />
          <Activity data={formData} hide={true} />
          <Renewal data={formData} hide={true} />
          <Premises data={formData} hide={true} />
          <Building data={formData} hide={true} />
          <LocalFactors data={formData} hide={true} />
          <Lease data={formData} hide={true} />
          <BusinessCharacteristics data={formData} hide={true} />
          <BusinessValuation data={formData} hide={true} />
          <LegalAspects data={formData} hide={true} />

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
export default ReviewForm;
