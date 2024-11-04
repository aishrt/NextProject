"use client";

import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import "../../client/client.css";
import Box from "@mui/material/Box";
import PrivacyPolicy from "./privacy-policy/Privacy";
import ThankuStep from "./thanku-page/page";
import axios from "axios";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useSearchParams, useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { Harassment } from "@/types/Harassment";
import AboutYourself from "./_HarassmentForms/AboutYourself";
import Health from "./_HarassmentForms/Health";
import Employer from "./_HarassmentForms/Employer";
import GeneralInfo from "./_HarassmentForms/GeneralInfo";
import MoralElements from "./_HarassmentForms/MoralElements";
import Evidence from "./_HarassmentForms/Evidence";
import Damages from "./_HarassmentForms/Damages";
import EmployerAction from "./_HarassmentForms/EmployerAction";
import Support from "./_HarassmentForms/Support";
import Review from "./_HarassmentForms/Review";

export default function HarassmentForm() {
  const router = useRouter();

  const [progress, setProgress] = useState(10);

  const [loading, setLoading] = useState(false);

  const [harassmentData, setHarassmentData] = useState<Harassment>();

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
            `/api/client/category/harassment/getHarassment?caseId=${caseFromQuery}`
          );
          if (data?.data) {
            setProgress(data?.data?.progress);
            setHarassmentData(data.data);
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", data?.data?.caseId);
            searchParmas.set("progress", data?.data?.progress);
            router.push(`/client/harassment-form?${searchParmas.toString()}`);
          } else {
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", caseFromQuery);
            searchParmas.set("progress", "10");
            router.push(`/client/harassment-form?${searchParmas.toString()}`);
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
        if (harassmentData) {
          if (harassmentData.caseId === caseFromQuery) {
            const { data } = await axios.post(
              "/api/client/category/harassment/createHarassment",
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
            "/api/client/category/harassment/createHarassment",
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
        router.push(`/client/harassment-form?${searchParmas.toString()}`);
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
          <h2 className="f-26  semi-bold  fw-400 mb-4 mt-5">
            Harassment Compensation Request Form
          </h2>
        </div>

        <div className="create-cases mt-4">
          <div className="w-100 mr-1 linear-progress-p p-1 bg-white shadow ">
            <LinearProgress
              className="green-progress-bar"
              variant="determinate"
              value={normalise(progress, 120)}
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
                      <div className="">
                        <AboutYourself data={harassmentData} hide={false} />
                      </div>
                    )}
                    {progress === 30 && (
                      <div className="">
                        <Health data={harassmentData} hide={false} />
                      </div>
                    )}
                    {progress === 40 && (
                      <div className="">
                        <Employer data={harassmentData} hide={false} />
                      </div>
                    )}

                    {progress === 50 && (
                      <div className="">
                        <GeneralInfo data={harassmentData} hide={false} />
                      </div>
                    )}
                    {progress === 60 && (
                      <div className="">
                        <MoralElements data={harassmentData} hide={false} />
                      </div>
                    )}

                    {progress === 70 && (
                      <div className="">
                        <Evidence data={harassmentData} hide={false} />
                      </div>
                    )}

                    {progress === 80 && (
                      <div className="">
                        <Damages data={harassmentData} hide={false} />
                      </div>
                    )}

                    {progress === 90 && (
                      <div className="">
                        <EmployerAction data={harassmentData} hide={false} />
                      </div>
                    )}

                    {progress === 100 && (
                      <div className="">
                        <Support data={harassmentData} hide={false} />
                      </div>
                    )}
                    {progress === 110 && (
                      <div className="">
                        <Review data={harassmentData} />
                      </div>
                    )}
                    {progress === 120 && (
                      <div className="">
                        <ThankuStep />
                      </div>
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
