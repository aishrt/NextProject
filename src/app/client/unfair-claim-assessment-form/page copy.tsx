"use client";

import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";

import "../../client/client.css";
import { Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import PrivacyPolicy from "./privacy-policy/page";
import TheBasics from "./_UnfairClaimForms/TheBasics";
import AboutDefamation from "./_UnfairClaimForms/AboutDefamation";
import EmployeePoaching from "./_UnfairClaimForms/EmployeePoaching";
import ConfusionParasitism from "./_UnfairClaimForms/ConfusionParasitism";
import RelationContractual from "./_UnfairClaimForms/RelationContractual";
import ClaimEvidence from "./_UnfairClaimForms/ClaimEvidence";
import AccusedCompany from "./_UnfairClaimForms/AccusedCompany";

const steps = ["", "", "", "", ""];

export default function UnfairCompetitionClaimAssessmentForm() {
  const [progress, setProgress] = useState(10);

  
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  const [show, setShow] = React.useState<boolean>(true);

  const searchParmas = useSearchParams();
  const progressFromQuery = searchParmas?.get("progress");
  const caseFromQuery = searchParmas?.get("caseId");

  useEffect(() => {
    if (progressFromQuery) {
      setActiveStep(+progressFromQuery);
    }
  }, [progressFromQuery]);

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <ContentWrapper>
      <Box sx={{ width: "100%" }}>
        {/* <PrivacyPolicy /> */}
        <Stepper activeStep={activeStep}>
          {steps.map((label, index) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            // if (isStepOptional(index)) {
            //   labelProps.optional = (
            //     <Typography variant="caption">Optional</Typography>
            //   );
            // }
            if (isStepSkipped(index)) {
              stepProps.completed = false;
            }
            return (
              <Step key={label} {...stepProps}>
                {/* <StepLabel {...labelProps}>{label}</StepLabel> */}
              </Step>
            );
          })}
        </Stepper>
        {activeStep === steps.length ? (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              All steps completed - you&apos;re finished
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Box sx={{ flex: "1 1 auto" }} />
              <Button onClick={handleReset}>Reset</Button>
            </Box>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Typography sx={{ mt: 2, mb: 1 }}>
              {activeStep == 0 ? (
                <>
                  {/* <PrivacyPolicy handleNext={undefined} /> */}

                  {/* <div className="top-title">
                    <h2 className="f-26 bold mb-4 mt-5">
                      Unfair Competition Claim Assessment Form
                    </h2>
                  </div> */}
                  {/* <div className="white-card  eviction-form unfair-assessment">
                    <TheBasics />
                    <AboutDefamation />
                    <EmployeePoaching />
                    <ConfusionParasitism />
                    <RelationContractual />
                    <ClaimEvidence />
                    <AccusedCompany />
                  </div> */}
                </>
              ) : (
                <></>
              )}

              {/* Step {activeStep + 1} */}
            </Typography>
            <Typography sx={{ mt: 2, mb: 1 }}>
              {activeStep == 1 ? (
                <>
                  <div className="top-title">
                    <h2 className="f-26 bold mb-4 mt-5">
                      Unfair Competition Claim Assessment Form
                    </h2>
                  </div>
                  <div className="eviction-forms unfair-assessment">
                    <TheBasics />
                    {/* <AboutDefamation />
                    <EmployeePoaching />
                    <ConfusionParasitism />
                    <RelationContractual />
                    <ClaimEvidence />
                    <AccusedCompany /> */}
                  </div>
                </>
              ) : (
                // <>
                //   <div className="top-title">
                //     <h2 className="f-26 bold mb-4 mt-5">
                //       Unfair Competition Claim Assessment Form
                //     </h2>
                //   </div>
                //   <div className="white-card  eviction-form  unfair-assessment">
                //    <AboutDefamation />
                //   </div>
                // </>
                <></>
              )}

              {/* Step {activeStep + 1} */}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              {/* <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button> */}
              {/* <Box sx={{ flex: "1 1 auto" }} /> */}
              {/* {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )} */}
              {/* <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button> */}
            </Box>
          </React.Fragment>
        )}
      </Box>
    </ContentWrapper>
  );
}
