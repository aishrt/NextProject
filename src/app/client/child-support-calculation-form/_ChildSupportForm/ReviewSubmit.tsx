"use client";

import React, { useEffect } from "react";
import * as z from "zod";
import "../../../client/client.css";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/Form/Button";
import { Checkbox, FormControlLabel, FormGroup, Link } from "@mui/material";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";
import { Child } from "@/types/Child";

type FormValues = {
  value: number;
  age: number;
  others: string;
  years: number;
  payments: number;
  asset: number;
  worth: number;
  income: number;
  amount: number;
  share: number;
};

const schema = z.object({
  value: z.string().min(1, "Please enter value"),
  salary: z.string().min(1, "Please enter a valid monthly gross salary."),
  years: z.string().min(1, "Please enter the number of years."),
  payments: z.string().min(1, "Please enter the payment in euros."),
});

const ReviewSubmit = ({ data }: { data: Child | undefined }) => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const params = new URLSearchParams();
  params.set("caseId", caseId);
  params.set("progress", "60");

  const searchParam = new URLSearchParams();
  searchParam.set("caseId", caseId);
  searchParam.set("progress", "80");

  useEffect(() => {
    setChecked(data?.checked ?? false);
  }, [data]);



  const [err, setErr] = useState(false);
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setErr(false);
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      if (!checked) {
        return setErr(true);
      }

      const { data } = await axios.post(
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          checked,
          progress: 80,
          nextProgress: 80,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "80");

      router.push(
        `/client/child-support-calculation-form?${searchParam.toString()}`
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
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          progress: 60,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");
      router.push(
        `/client/child-support-calculation-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="review-form spouse lease-form white-card p-4 rounded mt-4  indivi-form">
      <h3 className="f-22 bold mt-4  gray">Review and Submit</h3>
      <p className="f-14 mb-2 pb-3">
        Please review your information below carefully before submitting. Make
        sure all the information is correct.
      </p>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <>
          <h4 className="f-18 bold mb-2">Your Information</h4>
          <p className="f-14 gray emp-flex mb-1">
            <span className="f-14  left">Your Role: </span>{" "}
            <span className="right">{data?.role ?? "NA"}</span>
          </p>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Your Monthly Income:</span>{" "}
            <span className="right">{data?.monthlyIncome ?? "NA"} €</span>
          </p>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Your Monthly Expenses: </span>{" "}
            <span className="right">{data?.monthlyExpenses ?? "NA"} €</span>
          </p>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">
              Number of Other Children You Support:{" "}
            </span>{" "}
            <span className="right">{data?.children ?? "NA"}</span>
          </p>

          <h3 className="f-18 pb-2 bold pt-4">
            Other Parent&apos;s Information:
          </h3>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14 left">
              Other Parent&apos;s Monthly Income:
            </span>{" "}
            <span className="right">
              {" "}
              {data?.otherMonthlyIncome ?? "NA"} €{" "}
            </span>
          </p>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">
              Other Parent&apos;s Monthly Expenses:
            </span>{" "}
            <span className="right">
              {data?.otherMonthlyExpenses ?? "NA"} €{" "}
            </span>
          </p>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">
              Number of Other Children They Support:
            </span>{" "}
            <span className="right">{data?.otherChildren ?? "NA"} </span>
          </p>

          <h3 className="f-18 pb-2 bold pt-4">
            Child(ren)&apos;s Information:
          </h3>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Number of Children:</span>{" "}
            <span className="right"> 24 </span>
          </p>
          <h3 className="f-15 gray bold pt-2">Child 1:</h3>
          <ul className="child-status">
            <li className="list-style-none">
              <p className="f-14 gray mb-1 emp-flex">
                <span className="f-14  left">Name: </span>{" "}
                <span className="right"> John</span>
              </p>
            </li>
            <li className="list-style-none">
              <p className="f-14 gray mb-1 emp-flex">
                <span className="f-14  left">Age: </span>{" "}
                <span className="right"> 22</span>
              </p>
            </li>
          </ul>
          <h3 className="f-15 gray bold pt-2">Child 2 (if applicable):</h3>
          <ul className="child-status">
            <li className="list-style-none">
              <p className="f-14 gray mb-1 emp-flex">
                <span className="f-14  left">Name: </span>{" "}
                <span className="right"> John</span>
              </p>
            </li>
            <li className="list-style-none">
              <p className="f-14 gray mb-1 emp-flex">
                <span className="f-14  left">Age: </span>{" "}
                <span className="right"> 22</span>
              </p>
            </li>
          </ul>
          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14  left">Custody Arrangement: </span>{" "}
            <span className="right">Nil</span>
          </p>

          <h3 className="f-18 pb-2 bold pt-4">Proposed Child Support:</h3>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Your Proposed Amount: </span>{" "}
            <span className="right"> {data?.proposedAmount ?? "NA"} € </span>
          </p>
          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14 left">
              Other Parent&apos;s Proposed Amount (if provided):
            </span>{" "}
            <span className="right">
              {" "}
              {data?.parentProposedAmount ?? "NA"} €
            </span>
          </p>

          <h3 className="f-18 pb-2 bold pt-4">
            Educational Expenses (if applicable):
          </h3>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Estimated Expenses Per Child: </span>{" "}
            <span className="right"> {data?.educational ?? "NA"} € </span>
          </p>
          <p className="f-14 gray  mb-1 emp-flex">
            <span className="f-14 left">Additional Information: </span>{" "}
            <span className="right">{data?.describe ?? "NA"}</span>
          </p>
          <p className="f-14 mt-4">
            By clicking &quot;Submit,&quot; you confirm that the information
            provided is accurate to the best of your knowledge.
          </p>
          <div className="checkbox-review consent pt-3 mb-4">
            <label className="f-15">Consent</label>
            <div className="  radio-end-input consent-box f-13">
              <FormGroup>
                {/* <FormControlLabel
              className="radio-light-ip"
              control={<Checkbox  />}
              label=" "
            /> */}
                <Checkbox
                  checked={checked}
                  onChange={handleChange}
                  inputProps={{ "aria-label": "controlled" }}
                />
              </FormGroup>

              <p className="mb-0 f-14">
                I confirm that the information I have provided is accurate to
                the best of my knowledge, and I consent to the terms of the{" "}
                <Link href="#"> [Privacy Policy]</Link>.
              </p>
            </div>

            {err && (
              <span className="text-danger ms-5 mt-0"> Please confirm !!</span>
            )}
          </div>
        </>
      )}

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
            variant="outline"
            size="lg"
            className="next-btn"
            onClick={() => handleClick()}
          >
            <span className="f-16">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewSubmit;
