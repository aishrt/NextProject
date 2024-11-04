"use client";

import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import "../../client/client.css";

import Box from "@mui/material/Box";
import PrivacyPolicy from "./privacy-policy/Privacy";
import ThankuStep from "./thanku-page/page";
import BasicInformation from "./_EvaluationForms/BasicInformation";
import NonCompetitionClause from "./_EvaluationForms/NonCompetitionClause";
import AllegedViolation from "./_EvaluationForms/AllegedViolation";
import EvidenceViolation from "./_EvaluationForms/EvidenceViolation";
import AdditionalDetails from "./_EvaluationForms/AdditionalDetails";
import ReviewSubmit from "./_EvaluationForms/ReviewSubmit";
import axios from "axios";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useSearchParams, useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { Compete } from "@/types/Compete";

export default function NonCompetitionClauseEvaluationForm() {
  const router = useRouter();

  const [progress, setProgress] = useState(10);

  const [loading, setLoading] = useState(false);

  const [competitionData, setCompetitionData] = useState<Compete>();

  const searchParmas = useSearchParams();
  const progressFromQuery = searchParmas?.get("progress");
  const caseFromQuery = searchParmas?.get("caseId");

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

  const [subject, setValue] = React.useState("");
  const [err, setErr] = React.useState(false);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
    setErr(false);
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
            `/api/client/category/non-competition/getCompetition?caseId=${caseFromQuery}`
          );
          if (data?.data) {
            setProgress(data?.data?.progress);
            setCompetitionData(data.data);
            setValue(data?.data?.subject);
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", data?.data?.caseId);
            searchParmas.set("progress", data?.data?.progress);
            router.push(`/client/non-compete-form?${searchParmas.toString()}`);
          } else {
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", caseFromQuery);
            searchParmas.set("progress", "10");
            router.push(`/client/non-compete-form?${searchParmas.toString()}`);
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
      if (!subject) {
        return setErr(true);
      }
      if (progress === 10) {
        setLoading(true);
        let id;
        if (competitionData) {
          if (competitionData.caseId === caseFromQuery) {
            const { data } = await axios.post(
              "/api/client/category/non-competition/createCompetition",
              {
                caseId: caseFromQuery,
                progress: 20,
                nextProgress: 20,
                subject: subject,
              }
            );
            id = data.data.caseId;
          }
        } else {
          const { data } = await axios.post(
            "/api/client/category/non-competition/createCompetition",
            {
              caseId: caseFromQuery,
              progress: 20,
              nextProgress: 20,
              subject: subject,
            }
          );
          id = data.data.caseId;
        }
        const searchParmas = new URLSearchParams();
        searchParmas.set("caseId", id);
        searchParmas.set("progress", "20");
        router.push(`/client/non-compete-form?${searchParmas.toString()}`);
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
    <ContentWrapper>
      <Box sx={{ width: "100%" }}>
        <div className="top-title">
          <h2 className="f-22 bold mb-4 mt-5">Non-Compete Assessment Form </h2>
        </div>

        <div className="create-cases mt-4">
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={normalise(progress, 80)} />
          </Box>

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
                        <PrivacyPolicy
                          handleNext={handleNext}
                          err={err}
                          handleChange={handleChange}
                          subject={subject}
                        />
                      </div>
                    )}

                    {progress === 20 && (
                      <div className="">
                        <BasicInformation data={competitionData} hide={false} />
                      </div>
                    )}

                    {progress === 30 && (
                      <>
                        <div className=" eviction-form ">
                          <NonCompetitionClause
                            data={competitionData}
                            hide={false}
                          />
                        </div>
                      </>
                    )}

                    {progress === 40 && (
                      <>
                        <div className=" eviction-form ">
                          <AllegedViolation
                            data={competitionData}
                            hide={false}
                          />
                        </div>
                      </>
                    )}
                    {progress === 50 && (
                      <>
                        <div className=" eviction-form ">
                          <EvidenceViolation
                            data={competitionData}
                            hide={false}
                          />
                        </div>
                      </>
                    )}

                    {progress === 60 && (
                      <>
                        <div className=" eviction-form ">
                          <AdditionalDetails
                            data={competitionData}
                            hide={false}
                          />
                        </div>
                      </>
                    )}

                    {progress === 70 && (
                      <>
                        <div className=" eviction-form ">
                          <ReviewSubmit data={competitionData} />
                        </div>
                      </>
                    )}

                    {progress === 80 && (
                      <>
                        <div className=" eviction-form ">
                          <ThankuStep />
                        </div>
                      </>
                    )}
                  </div>
                </React.Fragment>
              }
            </div>
          )}
        </div>
      </Box>
    </ContentWrapper>
  );
}
