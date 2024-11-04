"use client";

import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import CircularProgress from "@mui/material/CircularProgress";

import "../../client/client.css";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSearchParams, useRouter } from "next/navigation";
import PrivacyPolicy from "./privacy-policy/Privacy";
import TheBasics from "./_UnfairClaimForms/TheBasics";
import AboutDefamation from "./_UnfairClaimForms/AboutDefamation";
import EmployeePoaching from "./_UnfairClaimForms/EmployeePoaching";
import ConfusionParasitism from "./_UnfairClaimForms/ConfusionParasitism";
import RelationContractual from "./_UnfairClaimForms/RelationContractual";
import ClaimEvidence from "./_UnfairClaimForms/ClaimEvidence";
import AccusedCompany from "./_UnfairClaimForms/AccusedCompany";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";

import axios from "axios";
import ThankYou from "./thank-you/page";

const steps = ["", "", "", "", ""];

export default function Main() {
  const router = useRouter();

  const [progress, setProgress] = useState(10);

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [show, setShow] = React.useState<boolean>(true);
  const [loading, setLoading] = useState(false);

  const [unfairData, setUnfairData] = useState<any>({});

  const searchParmas = useSearchParams();
  const progressFromQuery = searchParmas?.get("progress");
  const caseFromQuery = searchParmas?.get("caseId")!;

  function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
      </Box>
    );
  }

  useEffect(() => {
    if (progressFromQuery) {
      setProgress(+progressFromQuery);
    }
  }, [progressFromQuery]);

  useEffect(() => {
    const getCaseById = async () => {
      try {
        setLoading(true);
        if (caseFromQuery) {
          const { data } = await axios.get(
            `/api/client/category/unfair/getUnfair?caseId=${caseFromQuery}`
          );
          setUnfairData(data.data);
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
  }, [caseFromQuery, progress]);

  const handleNext = async () => {
    try {
      if (progress === 10) {
        setLoading(true);
        let id;
        if (unfairData) {
          if (unfairData?.caseId === caseFromQuery) {
            const { data } = await axios.post(
              "/api/client/category/unfair/createUnfair",
              {
                caseId: caseFromQuery,
                progress: 20,
              }
            );
            id = data.data.caseId;
          }
        } else {
          const { data } = await axios.post(
            "/api/client/category/unfair/createUnfair",
            {
              caseId: caseFromQuery,
              progress: 20,
            }
          );
          id = data.data.caseId;
        }
        const searchParmas = new URLSearchParams();
        searchParmas.set("caseId", id);
        searchParmas.set("progress", "20");
        router.push(
          `/client/unfair-claim-assessment-form?${searchParmas.toString()}`
        );
        setLoading(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const normalise = (value: number, MAX: number) => {
    let MIN = 0;
    let finalVal = ((value - MIN) * 100) / (MAX - MIN);
    if (finalVal > 100) {
      finalVal = 100;
    }
    return finalVal;
  };

  return (
    <div className="main-content">
      <h2 className="f-26  semi-bold mb-4 fw-400 mt-5">
        Unfair Competition Claim Assessment Form
      </h2>

      {/* <h2 className="bold f-22">Finance request</h2> */}
      <div className="create-cases mt-4">
        {/* <Box sx={{ width: "100%" }}>
          <LinearProgressWithLabel value={normalise(progress, 90)} />
        </Box> */}
        <div className="w-100 mr-1 linear-progress-p p-1 bg-white shadow ">
          <LinearProgress
            className="green-progress-bar"
            variant="determinate"
            value={normalise(progress, 90)}
          />
        </div>
        {loading ? (
          <div className="text-center mt-5">
            <CircularProgress />
          </div>
        ) : (
          <div>
            {
              <React.Fragment>
                <div className="cases-active">
                  {progress === 10 && (
                    <div className="">
                      <PrivacyPolicy handleNext={handleNext} />
                    </div>
                  )}
                  {progress === 20 && (
                    <>
                      <div className=" eviction-forms unfair-assessment">
                        <TheBasics />
                      </div>
                    </>
                  )}
                  {progress == 30 && (
                    <div className=" eviction-forms unfair-assessment">
                      <AboutDefamation />
                    </div>
                  )}
                  {progress == 40 && (
                    <div className=" eviction-forms unfair-assessment">
                      <EmployeePoaching />
                    </div>
                  )}
                  {progress == 50 && (
                    <div className=" eviction-forms unfair-assessment">
                      <ConfusionParasitism />
                    </div>
                  )}
                  {progress == 60 && (
                    <div className=" eviction-forms unfair-assessment">
                      <RelationContractual />
                    </div>
                  )}

                  {progress === 70 && (
                    <>
                      <div className=" eviction-forms unfair-assessment">
                        <ClaimEvidence />
                      </div>
                    </>
                  )}
                  {progress === 80 && (
                    <>
                      <div className=" eviction-forms unfair-assessment">
                        <AccusedCompany />
                      </div>
                    </>
                  )}

                  {progress === 90 && (
                    <>
                      <div className=" eviction-forms unfair-assessment">
                        <ThankYou />
                      </div>
                    </>
                  )}
                </div>
              </React.Fragment>
            }
          </div>
        )}
      </div>
    </div>
  );
}
