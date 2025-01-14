"use client";

import React, { useEffect } from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import { Metadata } from "next";
import "../../client/client.css";
import {
  CircularProgress,
  LinearProgress,
  LinearProgressProps,
} from "@mui/material";

import Box from "@mui/material/Box";
import VictimDetails from "./_PersonalInjuryForm/VictimDetails";
import AccidentDetails from "./_PersonalInjuryForm/AccidentDetails";
import YourInjury from "./_PersonalInjuryForm/YourInjury";
import VictimDamage from "./_PersonalInjuryForm/VictimDamage";
import EconomicSupportDamages from "./_PersonalInjuryForm/EconomicSupportDamages";
import IndirectVictims from "./_PersonalInjuryForm/IndirectVictims";
import ThankuStep from "./thanku-page/page";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import PrivacyPolicy from "./privacy-policy/Privacy";
import ProfessionalImpact from "./_PersonalInjuryForm/ProfessionalImpact";
import { Injury } from "@/types/Injury";
import Compensation from "./_PersonalInjuryForm/Compensation";
import Review from "./_PersonalInjuryForm/Review";

// export const metadata: Metadata = {
//   title: "Eviction Assessment Form",
//   description: "Generated by create next app",
// };

export default function PersonalInjuryAssessmentForm() {
  const router = useRouter();
  const searchParmas = useSearchParams();
  const progressFromQuery = searchParmas?.get("progress");
  const caseFromQuery = searchParmas?.get("caseId");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [progress, setProgress] = React.useState(10);
  const [injuredData, setInjuredData] = React.useState<Injury>();

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

  const normalise = (value: number, MAX: number) => {
    let MIN = 0;
    let finalVal = ((value - MIN) * 100) / (MAX - MIN);
    if (finalVal > 110) {
      finalVal = 110;
    }
    return finalVal;
  };

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
            `/api/client/category/injury/getInjury?caseId=${caseFromQuery}`
          );
          if (data?.data) {
            setInjuredData(data?.data);
            setProgress(data?.data?.progress);
            console.log(data?.data);
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", data?.data?.caseId);
            searchParmas.set("progress", data?.data?.progress);
            router.push(
              `/client/personal-injury-assessment-form?${searchParmas.toString()}`
            );
          } else {
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", caseFromQuery);
            searchParmas.set("progress", "10");
            router.push(
              `/client/personal-injury-assessment-form?${searchParmas.toString()}`
            );
          }
        }
        setLoading(false);
      } catch (error) {
        console.log("err", error);
        setLoading(false);
      }
    };
    getCaseById();
  }, [caseFromQuery, progressFromQuery]);

  const handleNext = async () => {
    try {
      if (progress === 10) {
        setLoading(true);
        let id;
        if (injuredData) {
          if (injuredData.caseId === caseFromQuery) {
            const { data } = await axios.post(
              "/api/client/category/injury/createInjury",
              {
                caseId: caseFromQuery,
                progress: 20,
                nextProgress: 20,
              }
            );
            id = data.data.caseId;
          }
        } else {
          const { data } = await axios.post(
            "/api/client/category/injury/createInjury",
            {
              caseId: caseFromQuery,
              progress: 20,
              nextProgress: 20,
            }
          );
          id = data.data.caseId;
        }
        const searchParmas = new URLSearchParams();
        searchParmas.set("caseId", id);
        searchParmas.set("progress", "20");
        router.push(
          `/client/personal-injury-assessment-form?${searchParmas.toString()}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContentWrapper>
      <Box sx={{ width: "100%" }}>
        <div className="top-title">
          <h2 className="f-22 bold mb-4 mt-5">
            Personal Injury Assessment Form
          </h2>
        </div>

        <div className="create-cases mt-4">
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={normalise(progress, 110)} />
          </Box>
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
                    <div className="eviction-form">
                      <VictimDetails data={injuredData} hide={false} />
                    </div>
                  )}

                  {progress === 30 && (
                    <>
                      <div className="eviction-form">
                        <AccidentDetails data={injuredData} hide={false} />
                      </div>
                    </>
                  )}

                  {progress === 40 && (
                    <>
                      <div className="eviction-form">
                        <YourInjury data={injuredData} hide={false} />
                      </div>
                    </>
                  )}
                  {injuredData?.isMedicalExamined === "yes" &&
                    progress === 50 && (
                      <>
                        <div className="eviction-form">
                          <VictimDamage data={injuredData} hide={false} />
                        </div>
                      </>
                    )}

                  {injuredData?.isMedicalExamined === "yes" &&
                    progress === 60 && (
                      <>
                        <div className="eviction-form">
                          <ProfessionalImpact data={injuredData} hide={false} />
                        </div>
                      </>
                    )}

                  {progress === 70 && (
                    <>
                      <div className="eviction-form">
                        <EconomicSupportDamages
                          data={injuredData}
                          hide={false}
                        />
                      </div>
                    </>
                  )}

                  {progress === 80 && (
                    <>
                      <div className="eviction-form">
                        <IndirectVictims data={injuredData} />
                      </div>
                    </>
                  )}

                  {progress === 90 && (
                    <>
                      <div className="eviction-form">
                        <Compensation data={injuredData} hide={false} />
                      </div>
                    </>
                  )}

                  {progress === 100 && (
                    <>
                      <div className="eviction-form">
                        <Review data={injuredData} />
                      </div>
                    </>
                  )}

                  {progress === 110 && (
                    <>
                      <div className="eviction-form">
                        <ThankuStep />
                      </div>
                    </>
                  )}
                </div>
              </React.Fragment>
            }
          </div>
        )}
      </Box>
    </ContentWrapper>
  );
}
