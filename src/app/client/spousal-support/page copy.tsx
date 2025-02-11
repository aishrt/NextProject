"use client";

import React from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import { Metadata } from "next";
import "../../client/client.css";
import { Stack } from "@mui/material";

import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import PrivacyPolicy from "./privacy-policy/page";
import ThankuStep from "./thanku-page/page";
import StartBasics from "./_SpousalForms/StartBasics";
import AboutYourself from "./_SpousalForms/AboutYourself";
import SpouseFinancialSituation from "./_SpousalForms/SpouseFinancialSituation";
import EstimateAssetDivision from "./_SpousalForms/EstimateAssetDivision";
import SubmitInfo from "./_SpousalForms/SubmitInfo";
import ChildSupport from "./_SpousalForms/ChildSupport";

const steps = ["Lorem ipsum", "Lorem ipsum", "Lorem ipsum"];

// export const metadata: Metadata = {
//   title: "Eviction Assessment Form",
//   description: "Generated by create next app",
// };

export default function SpousalSupport() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set<number>());

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
        <div className="top-title">
          <h2 className="f-22 bold mb-4 mt-5">
            Evaluation Request Form for Spousal Support
          </h2>
        </div>
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
                <StepLabel {...labelProps}>{label}</StepLabel>
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
                  <div className="white-card  eviction-form injury-form">
                    <PrivacyPolicy />
                    {/* <StartBasics />
                    <AboutYourself />
                    <SpouseFinancialSituation />
                    <EstimateAssetDivision />
                    <SubmitInfo />
                    <ChildSupport /> */}
                    <ThankuStep />
                  </div>
                </>
              ) : (
                <></>
              )}

              {/* Step {activeStep + 1} */}
            </Typography>
            <Typography sx={{ mt: 2, mb: 1 }}>
              {activeStep == 1 ? (
                <>
                  <div className="white-card  eviction-form injury-form"></div>
                </>
              ) : (
                <></>
              )}

              {/* Step {activeStep + 1} */}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Box sx={{ flex: "1 1 auto" }} />
              {/* {isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Skip
                </Button>
              )} */}
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </Box>
          </React.Fragment>
        )}
      </Box>
    </ContentWrapper>
  );
}
