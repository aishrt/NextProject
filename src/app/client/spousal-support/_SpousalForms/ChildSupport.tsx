"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
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
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Spousal } from "@/types/Spousal";

const ChildSupport = ({ data }: { data: Spousal | undefined }) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "30");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [err, setErr] = useState(false);

  const [childSupport, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErr(false);
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/spousal/createSpousal",
        {
          caseId: caseId,
          progress: 50,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "50");
      router.push(`/client/spousal-support?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleClick = async () => {
    try {
      if (!childSupport) {
        return setErr(true);
      }
      setLoading(true);

      const { data } = await axios.post(
        "/api/client/category/spousal/createSpousal",
        {
          caseId: caseId,
          childSupport,
          progress: 70,
          nextProgress: 70,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");
      if (childSupport == "no") {
        router.push(`/client/spousal-support?${searchParam.toString()}`);
      }
      if (childSupport == "yes") {
        router.push(`/client/child-support-calculation-form?caseId=${caseId}`);
      }

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue(data?.childSupport ?? "");
  }, [data]);

  return (
    <div className="review-form mt-5 spouse">
      <h3 className="f-22 bold mt-4  gray">Child Support</h3>

      <h3 className="f-17 mt-2 pb-3">
        Are you also considering requesting child support? If you have children,
        it&apos;s important to consider their needs along with your own. This
        step guides you through the specific information required for child
        support, ensuring all your family concerns are addressed
        comprehensively.
      </h3>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <div className="row">
          <div className="col-12 col-md-12 mb-4">
            <div className="mb-3 radio-end-input">
              <label className="tooltip-title relative">
                Would you like to request child support as well?
              </label>
              <FormControl className="w-100">
                <RadioGroup
                  className="w-100"
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={childSupport}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    className="radio-light-ip"
                    value="yes"
                    control={<Radio />}
                    label="Yes, I'd like to start the child support request process"
                  />
                  <FormControlLabel
                    className="radio-light-ip"
                    value="no"
                    control={<Radio />}
                    label="No, I only need assistance with spousal support."
                  />
                </RadioGroup>
                {err && (
                  <span className="text-danger">
                    Please select, if you would like to request for child
                    support
                  </span>
                )}
              </FormControl>
            </div>
          </div>

          <div className="col-12 text-center mt-4">
            <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
              <Button
                onClick={() => handlePrevious()}
                variant="contained"
                className="green-btn"
                size="lg"
              >
                Previous
              </Button>

              <Button
                variant="contained"
                size="lg"
                className="green-btn"
                onClick={handleClick}
              >
                <span className="f-16">Next</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildSupport;
