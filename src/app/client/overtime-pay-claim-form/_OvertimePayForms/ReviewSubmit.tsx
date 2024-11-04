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

type FormValues = {
  others: string;
  agreement: string;
  overtime: number;
  description: string;
};

const schema = z.object({
  role: z.string().min(1, "Please select Role"),
  department: z.string().min(1, "Please enter department number"),
  age: z.string().min(1, "Please enter a valid age between 15 and 90."),
  salary: z.string().min(1, "Please enter a valid monthly gross salary."),
});

const ReviewSubmit = () => {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { formState, control } = methods;

  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setErr(false);
  };

  const handleSubmit = (values: FormValues) => {
    setLoading(true);
  };
  const [err, setErr] = useState(false);
  const [data, setOvertimeData] = useState<any>({});

  useEffect(() => {
    const getCaseById = async () => {
      try {
        setLoading(true);
        if (caseId) {
          const { data } = await axios.get(
            `/api/client/category/overtime/getOvertime?caseId=${caseId}`
          );
          setOvertimeData(data.data);
          console.log(data.data);

          if (data.data) {
            // setIndividual(data.data.isIndividual);
          }
        }
        setLoading(false);
      } catch (error) {
        console.log("err", error);
        setLoading(false);
      }
    };
    getCaseById();
  }, [caseId]);

  const handleClick = async () => {
    try {
      setLoading(true);
      if (!checked) {
        return setErr(true);
      }
      const { data } = await axios.post(
        "/api/client/category/overtime/createOvertime",
        {
          caseId: caseId,
          checked,
          progress: 70,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");

      router.push(`/client/overtime-pay-claim-form?${searchParam.toString()}`);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="review-form white-card mt-4 rounded p-4">
      <h3 className="f-22 bold mt-4 pb-3 gray">Step 5/6: Review & Submit</h3>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <>
          <h4 className="f-18 bold mb-2">
            Review your information below before submitting:
          </h4>
          <p className="f-14 gray emp-flex">
            <span className="f-14  left">Role: </span>{" "}
            <span className="right">{data.role}</span>
          </p>
          <h3 className="f-18 pb-2 bold pt-4">Employer Information</h3>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14 left">
              Department Number (French company headquarters):{" "}
            </span>{" "}
            <span className="right">{data.department ?? "NA"} </span>
          </p>
          <p className="f-14 gray emp-flex">
            <span className="f-14  left">
              Total Number of Employees in the Company:{" "}
            </span>{" "}
            <span className="right">{data.totalEmployee ?? "NA"} </span>
          </p>

          <h3 className="f-18 pb-2 bold pt-4">Employee Information</h3>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Age: </span>{" "}
            <span className="right"> {data.age + " " + "Years"} </span>
          </p>
          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14  left">Monthly Gross Salary: </span>{" "}
            <span className="right">{data.salary + " " + "€"} </span>
          </p>
          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14  left">Employment Status: </span>{" "}
            <span className="right">{data?.employmentStatus ?? "NA"}</span>
          </p>
          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14  left">Work Department: </span>{" "}
            <span className="right">{data?.workDepartment ?? "NA"}</span>
          </p>
          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14  left">Years with the Company: </span>{" "}
            <span className="right">{data?.years ?? "NA"}</span>
          </p>

          <h3 className="f-18 pb-2 bold pt-4">
            Health Information (If applicable)
          </h3>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Health Status Before the Claim: </span>{" "}
            <span className="right"> {data?.healthStatus ?? "NA"} </span>
          </p>
          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14 left">Work Accident/Declared Unfit: </span>{" "}
            <span className="right text-capitalize">
              {data?.workAccident ?? "NA"}
            </span>
          </p>
          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14  left">
              Details of Work Accident/Unfitness:{" "}
            </span>{" "}
            <span className="right">
              {data.describe ? data.describe : "NA"}
            </span>
          </p>

          <h3 className="f-18 pb-2 bold pt-4">Details of the Claim</h3>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Reason for Claim: </span>{" "}
            <span className="right">
              {data.claimReason == "unpaid"
                ? `Unpaid overtime due to ${data.otherUnpaid}`
                : data.claimReason == "other"
                ? data.otherReason
                : data.claimReason ?? "NA"}
            </span>
          </p>
          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14 left">Existing Collective Procedure: </span>{" "}
            <span className="right text-capitalize">
              {data.agreement ?? "NA"}
            </span>
          </p>
          {data.role == "Employee" && (
            <p className="f-14 gray  mb-1 emp-flex">
              <span className="f-14 left">
                Total Overtime Pay Amount Requested (net amount):
              </span>
              <span className="right">{data.overtimePay ?? "NA"}</span>
            </p>
          )}
          <h3 className="f-18 pb-2 bold pt-4">Desired Outcome</h3>

          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14 left">Desired Outcome: </span>{" "}
            <span className="right text-capitalize">
              {data.outcome ?? "NA"}
            </span>
          </p>

          {data.outcome == "other" && (
            <p className="f-14 gray  mb-1 emp-flex">
              <span className="f-14 left">Other Desired Outcome: </span>{" "}
              <span className="right text-capitalize">
                {data.otherOutcome ? data.otherOutcome : "NA"}
              </span>
            </p>
          )}
          <div className="row mt-3">
            {/* <div className="col-12 col-md-12 mb-4">
          <div className="mb-3 radio-end-input">
            <label className="tooltip-title relative">Desired Outcome</label>
            <FormControl className="w-100">
              <RadioGroup
                className="w-100"
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel
                  className="radio-light-ip"
                  value="Financial compensation for unpaid overtime"
                  control={<Radio />}
                  label="Financial compensation for unpaid overtime"
                />
                <FormControlLabel
                  className="radio-light-ip"
                  value="Other"
                  control={<Radio />}
                  label="Other (please specify below)"
                />
              </RadioGroup>
            </FormControl>
          </div>
          <div className="lease-input mb-4">
            <label className="tooltip-title relative">Others</label>
            <InputField
              error={formState.errors["others"]}
              label="Others"
              name="others"
              variant="filled"
              className="bglight-ip"
              control={control}
            />
          </div>
        </div> */}
            {/* <div className="col-12 text-center mt-4">
          <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
            <Button
              type="submit"
              variant="contained"
              size="lg"
              className="green-btn"
            >
              <span className="f-16">Edit Section</span>
            </Button>
            <Button
              type="submit"
              variant="outline"
              size="lg"
              className="green-border f-16"
            >
              <span className="f-16">Next</span>
            </Button>
            <Button
              type="submit"
              variant="contained"
              className="green-btn"
              size="lg"
            >
              Reset Form
            </Button>
          </div>
        </div> */}

            <div className="checkbox-review consent pt-3 mb-4">
              <label className="f-15">Consent</label>
              <div className="mb-3 radio-end-input f-13">
                <FormGroup>
                  <FormControlLabel
                    className="radio-light-ip"
                    control={
                      <Checkbox checked={checked} onChange={handleChange} />
                    }
                    label=" I confirm that the information I have provided is accurate to the best of my knowledge, and I consent to the terms of the [Privacy Policy]."
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
                  onClick={() => handleClick()}
                >
                  <span className="f-16">Submit</span>
                </Button>
                {/* <Button
                  variant="outline"
                  size="lg"
                  className="next-btn f-16"
                  onClick={() => setChecked(false)}
                >
                  <span className="f-16">
                    Clear Form
                  </span>
                </Button> */}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReviewSubmit;
