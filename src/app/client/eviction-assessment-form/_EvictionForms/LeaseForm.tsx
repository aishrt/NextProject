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

type LeaseFormValues = {
  leaseInitialDate: string;
  leaseInitialYear: string;
  annualRent: string;
};

const leaseSchema = z.object({
  leaseInitialDate: z
    .string({ required_error: "Please select the start date of initial lease" })
    .min(1, "Please select the start date of initial lease"),
  leaseInitialYear: z
    .string({
      required_error: "Please provide the initial lease year",
      invalid_type_error: "Please provide the initial lease year",
    })
    .min(1, "Please provide the initial lease year"),
  annualRent: z
    .string({
      required_error: "Please enter the rent",
      invalid_type_error: "Please enter the rent",
    })
    .min(1, "Please enter the rent"),
  //.regex(/^(?:[0-9]\d*|0)$/, "Only digits are allowed"),
});

const LeaseForm = ({
  data,
  hide,
}: {
  data: Eviction | undefined | null;
  hide: boolean;
}) => {
  const { methods: leaseMethods, setValues: setLeaseValues } = useHookForm<
    LeaseFormValues,
    typeof leaseSchema
  >(leaseSchema);

  const { formState: leaseFormState, control: leaseControl } = leaseMethods;

  const searchParmas = useSearchParams();
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const [errors, setErrors] = useState({
    err: false,
  });

  const [premises, setPremises] = React.useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPremises((event.target as HTMLInputElement).value);
    setErrors((prev) => {
      let newErrorObj = { ...prev };
      newErrorObj.err = false;
      return newErrorObj;
    });
  };
  const errHandle = () => {
    let isError = false;
    let errorObj = { ...errors };

    if (!premises) {
      isError = true;
      errorObj = { ...errorObj, err: true };
    }

    if (isError) {
      setErrors(errorObj);
    }
    return isError;
  };

  const handleLease = async (values: LeaseFormValues) => {
    try {
      setLoading(true);
      if (errHandle()) {
        return;
      }
      let payload: any = {
        caseId: caseId,
        ...values,
        premises,
      };

      if (!hide) {
        payload = { ...payload, progress: 30, nextProgress: 30 };
      }
      const { data } = await axios.post(
        "/api/client/category/eviction/createEviction",
        payload
      );

      let id = data.data.caseId;
      if (!hide) {
        const searchParam = new URLSearchParams();
        searchParam.set("caseId", id);
        searchParam.set("progress", "30");
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
          progress: 10,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "10");
      router.push(`/client/eviction-assessment-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    setLeaseValues({
      leaseInitialDate: data?.leaseInitialDate,
      leaseInitialYear: data?.leaseInitialYear,
      annualRent: data?.annualRent,
    });
    setPremises(data?.premises ?? "");
  }, [data]);

  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h3 className="f-26  fw-400 pb-3">Lease Information </h3>
      <div>
        <h2 className="f-18 fw-500">
          Let&apos;s start with the basic information about your lease. This
          will help us understand the general context of your situation.
        </h2>
      </div>

      {loading ? (
        <p className="text-center">
          <CircularProgress />
        </p>
      ) : (
        <>
          <Form<LeaseFormValues> onSubmit={handleLease} methods={leaseMethods}>
            <div className="row mt-5">
              <div className="col-12 col-md-12 mb-3">
                {/* <h6 className="f-22 bold pb-3">
                    Initial Lease Agreement Details
                  </h6> */}
                <div className="row">
                  <div className="col-12 col-md-6 mb-4 date-input">
                    <div className="lease-input">
                      <label>Start date of your initial lease</label>

                      <DateField
                        error={leaseFormState.errors["leaseInitialDate"]}
                        label=""
                        disabled={hide}
                        name="leaseInitialDate"
                        variant="filled"
                        className="bglight-ip p-1 w-100 rounded"
                        control={leaseControl}
                        // defaultValue={evictionData?.leaseInitialDate}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="tooltip-title relative">
                        Duration of your initial lease (in years)
                        {/* <div className="tooltip-icn relative"> */}
                        <Image className="bubble" src={bubble} alt="" />
                        <span className="hover-tip">
                          Generally, the initial term of the contract is 9 years
                        </span>
                        {/* </div> */}
                      </label>
                      <InputField
                        type="number"
                        error={leaseFormState.errors["leaseInitialYear"]}
                        label=""
                        disabled={hide}
                        name="leaseInitialYear"
                        variant="filled"
                        className="bglight-ip"
                        control={leaseControl}
                      />
                    </div>
                  </div>
                  <div className="col-12 col-md-6 mb-4">
                    <div className="lease-input">
                      <label className="f-18 fw-500">Current annual rent (excluding taxes)</label>
                      <InputField
                        type="number"
                        error={leaseFormState.errors["annualRent"]}
                        label="Annual rent"
                        name="annualRent"
                        variant="filled"
                        disabled={hide}
                        className="bglight-ip"
                        control={leaseControl}
                        // defaultValue={evictionData?.annualRent}
                      />
                    </div>
                  </div>

                  <div className="col-12 col-md-6 mb-4">
                    <div className="business-radio">
                      <FormControl className="w-100">
                        <label>
                          Are the premises reserved for your exclusive use?
                        </label>
                        <RadioGroup
                          className="w-100"
                          row
                          aria-labelledby="demo-controlled-radio-buttons-group"
                          name="controlled-radio-buttons-group"
                          value={premises}
                          onChange={handleChange}
                        >
                          <FormControlLabel
                            className=""
                            disabled={hide}
                            value="yes"
                            control={<Radio />}
                            label="Yes"
                          />
                          <FormControlLabel
                            className=""
                            disabled={hide}
                            value="no"
                            control={<Radio />}
                            label="No"
                          />
                        </RadioGroup>

                        {errors.err && (
                          <span
                            className="text-danger"
                            style={{ fontSize: "0.75rem" }}
                          >
                            Please select premises reserved
                          </span>
                        )}
                      </FormControl>
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
                  onClick={() => errHandle()}
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

export default LeaseForm;
