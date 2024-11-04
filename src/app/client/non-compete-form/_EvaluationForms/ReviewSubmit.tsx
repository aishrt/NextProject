"use client";

import React from "react";
import "../../../client/client.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Form/Button";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { Compete } from "@/types/Compete";

import BasicInformation from "./BasicInformation";
import NonCompetitionClause from "./NonCompetitionClause";
import AllegedViolation from "./AllegedViolation";
import EvidenceViolation from "./EvidenceViolation";
import AdditionalDetails from "./AdditionalDetails";
import axios from "axios";

export default function ReviewSubmit({
  data,
}: {
  data: Compete | undefined | null;
}) {
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");
  const [formData, setData] = useState<Compete | null>();

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();
  const [checked, setChecked] = React.useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setErr(false);
  };

  const [err, setErr] = useState(false);
  useEffect(() => {
    setData(data);
  }, [data]);

  const clearForm = () => {
    setChecked(false);
    setData(null);
  };

  const handleClick = async () => {
    try {
      setLoading(true);
      document
        .querySelectorAll<HTMLElement>(".compete-submit-btn")
        .forEach((div: HTMLElement | null) => {
          if (div) {
            div.click();
          }
        });

      if (!checked) {
        return setErr(true);
      }

      const { data } = await axios.post(
        "/api/client/category/non-competition/createCompetition",
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

      router.push(`/client/non-compete-form?${searchParam.toString()}`);

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lease-form">
      <h3 className="f-25 bold  pb-3 gray"> Review & Submit</h3>
      <p className="f-14 gray">Please review your information carefully:</p>
      {loading ? (
        <div className="text-center mt-5">
          <CircularProgress />
        </div>
      ) : (
        <>
          <BasicInformation data={formData} hide={true} />
          <NonCompetitionClause data={formData} hide={true} />
          <AllegedViolation data={formData} hide={true} />
          <EvidenceViolation data={formData} hide={true} />
          <AdditionalDetails data={formData} hide={true} />

          {/* <h4 className="f-18 bold mb-2"> Information</h4>
          <p className="f-14 gray emp-flex mb-1">
            <span className="f-14  left">Reasons For Clause: </span>{" "}
            <span className="right text-capitalize">
              {data?.reasonsForClause
                ? data?.reasonsForClause.join(", ")
                : "NA"}
            </span>
          </p>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Prohibited Activities:</span>{" "}
            <span className="right text-capitalize">
              {data?.prohibitedActivities
                ? data?.prohibitedActivities.join(", ")
                : "NA"}
            </span>
          </p>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Industry Sector: </span>{" "}
            <span className="right text-capitalize">
              {data?.industrySector ?? "NA"}{" "}
            </span>
          </p>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Employment Type:</span>{" "}
            <span className="right text-capitalize">
              {data?.employmentType ?? "NA"}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14 left">Job Title:</span>{" "}
            <span className="right text-capitalize">
              {" "}
              {data?.jobTitle ?? "NA"}{" "}
            </span>
          </p>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Compensation Source:</span>{" "}
            <span className="right">{data?.compensationSource ?? "NA"}</span>
          </p>
          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Industry Sector Company:</span>{" "}
            <span className="right text-capitalize">
              {data?.industrySectorCompany ?? "NA"}{" "}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Salary Percentage:</span>{" "}
            <span className="right text-capitalize">
              {data?.salaryPercentage ?? "NA"}{" "}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Service:</span>{" "}
            <span className="right text-capitalize">
              {data?.service ?? "NA"}{" "}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Negotiate:</span>{" "}
            <span className="right text-capitalize">
              {data?.negotiate ?? "NA"}{" "}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Agreement:</span>{" "}
            <span className="right text-capitalize">
              {data?.agreement ?? "NA"}{" "}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Last Salary:</span>{" "}
            <span className="right text-capitalize">
              {data?.lastSalary ?? "NA"}{" "}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Last Salary:</span>{" "}
            <span className="right text-capitalize">
              {data?.lastSalary ?? "NA"}{" "}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Non-Compete Period:</span>{" "}
            <span className="right text-capitalize">
              {data?.nonCompetePeriod ?? "NA"}{" "}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Non-Competition Clause:</span>{" "}
            <span className="right text-capitalize">
              {data?.nonCompetitionClause ?? "NA"}{" "}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Other Clause:</span>{" "}
            <span className="right text-capitalize">
              {data?.otherClause ?? "NA"}{" "}
            </span>
          </p>

          <p className="f-14 gray mb-1 emp-flex">
            <span className="f-14  left">Other Details:</span>{" "}
            <span className="right text-capitalize">
              {data?.otherDetails ?? "NA"}{" "}
            </span>
          </p> */}

          <p className="f-14 mt-4">
            By clicking &quot;Submit,&quot; you confirm that the information
            provided is accurate to the best of your knowledge.
          </p>

          <div className="checkbox-review consent  mb-4">
            <label className="f-15">Consent :</label>
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
        </>
      )}

      <div className="col-12 text-center mt-4">
        <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
          <Button
            variant="primary"
            className="green-btn"
            size="lg"
            onClick={handleClick}
          >
            <span className="f-16">Submit</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="green-border f-16"
            onClick={() => clearForm()}
          >
            <span className="f-16">Clear Form</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
