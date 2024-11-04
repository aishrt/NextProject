"use client";

import React from "react";
import "../../../client/client.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import { Button } from "@/components/Form/Button";

const SubmitInfo = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId")!;

  const searchParam = new URLSearchParams();
  searchParam.set("caseId", caseId);
  searchParam.set("progress", "70");

  return (
    <div className="review-form mt-5 spouse">
      <h3 className="f-22 bold mt-4  gray">Step 6: Submit Your Information</h3>
      <p className="f-14 mb-2 pb-3">
        By clicking &quot;Submit,&quot; you confirm that the information provided is
        accurate to the best of your knowledge.
      </p>
      <h4 className="f-18 bold mb-2">Consent: (Required) </h4>
      <p className="f-14 mb-2 pb-3">
        By clicking &quot;Submit,&quot; you confirm that the information provided is
        accurate to the best of your knowledge.
      </p>
      <div className="checkbox-review consent pt-3 mb-4">
        <label className="f-15">Consent</label>
        <div className="mb-3  radio-end-input f-13">
          <FormGroup>
            <FormControlLabel
              className="radio-light-ip"
              control={<Checkbox />}
              label=" I confirm that the information I have provided is accurate to the best of my knowledge, and I consent to the terms of the [Privacy Policy]."
            />
          </FormGroup>
        </div>
      </div>

      <div className="col-12 text-center mt-4">
        <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
          <Button
            variant="contained"
            size="lg"
            className="green-btn"
            onClick={() =>
              router.push(
                `/client/evaluation-request-form-for-spousal-support?${searchParam.toString()}`
              )
            }
          >
            <span className="f-16">Submit</span>
          </Button>
          {/* <Button
              type="submit"
              variant="outline"
              size="lg"
              className="green-border f-16"
            >
              <span className="f-16">Clear</span>
            </Button> */}
        </div>
      </div>
    </div>
  );
};

export default SubmitInfo;
