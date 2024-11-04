"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Wrongful } from "@/types/Wrongful";
import bubble from "@/assets/info.png";
import Image from "next/image";

const RoleBasicInformation = ({
  data,
  hide,
}: {
  data: Wrongful | undefined | null;
  hide: boolean;
}) => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [err, setErr] = useState(false);
  const [role, setValue] = React.useState("");
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErr(false);
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      if (!role) {
        return setErr(true);
      }
      let payload: any = {
        caseId: caseId,
        role,
      };

      if (!hide) {
        payload = { ...payload, progress: 30, nextProgress: 30 };
      }
      const { data } = await axios.post(
        "/api/client/category/wrongful/createWrongful",
        payload
      );

      let id = data.data.caseId;

      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "30");
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
          progress: 10,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "10");
      router.push(`/client/wrongful-termination?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setValue(data?.role ?? "");
  }, [data]);
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4 gray">Understanding your situation </h3>
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
                  Are you the employer or the employee involved?{" "}
                  <Image className="bubble" src={bubble} alt="" />
                  <span className="hover-tip">
                    Select your role to customize the following questions
                    according to your situation.
                  </span>
                </label>

                <FormControl className="w-100">
                  <RadioGroup
                    className="w-100"
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={role}
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Employer"
                      control={<Radio />}
                      label="Employer"
                    />
                    <FormControlLabel
                      className="radio-light-ip"
                      value="Employee"
                      control={<Radio />}
                      label="Employee"
                    />
                  </RadioGroup>
                  {err && (
                    <span className="text-danger f-14">
                      Please select your role
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

export default RoleBasicInformation;
