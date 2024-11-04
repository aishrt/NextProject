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
import { Dismissal } from "@/types/Dismissal";
import Understanding from "./_DismissalForms/Understanding";
import AboutYourself from "./_DismissalForms/AboutYourself";
import WorkPlace from "./_DismissalForms/WorkPlace";
import Reasons from "./_DismissalForms/Reasons";
import SideStory from "./_DismissalForms/SideStory";
import Witness from "./_DismissalForms/Witness";
import Review from "./_DismissalForms/Review";

export default function DismissalClauseForm() {
  const router = useRouter();

  const [progress, setProgress] = useState(10);

  const [loading, setLoading] = useState(false);

  const [dismissalData, setDismissalData] = useState<Dismissal>();

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
            `/api/client/category/dismissal/getDismissal?caseId=${caseFromQuery}`
          );
          if (data?.data) {
            setProgress(data?.data?.progress);
            setDismissalData(data.data);
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", data?.data?.caseId);
            searchParmas.set("progress", data?.data?.progress);
            router.push(`/client/dismissal-form?${searchParmas.toString()}`);
          } else {
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", caseFromQuery);
            searchParmas.set("progress", "10");
            router.push(`/client/dismissal-form?${searchParmas.toString()}`);
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
        if (dismissalData) {
          if (dismissalData.caseId === caseFromQuery) {
            const { data } = await axios.post(
              "/api/client/category/dismissal/createDismissal",
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
            "/api/client/category/dismissal/createDismissal",
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
        router.push(`/client/dismissal-form?${searchParmas.toString()}`);
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
          <h2 className="f-22 bold mb-4 mt-5">
            Dismissal or Constructive Dismissal Assessment Form
          </h2>
        </div>

        <div className="create-cases mt-4">
      
          <div className="w-100 mr-1 linear-progress-p p-1 bg-white shadow ">
            <LinearProgress
              className="green-progress-bar"
              variant="determinate"
              value={normalise(progress, 80)}
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
                        <Understanding data={dismissalData} hide={false} />
                      </div>
                    )}

                    {progress === 30 && (
                      <div className="">
                        <AboutYourself data={dismissalData} hide={false} />
                      </div>
                    )}

                    {progress === 40 && (
                      <div className="">
                        <WorkPlace data={dismissalData} hide={false} />
                      </div>
                    )}

                    {progress === 50 && (
                      <div className="">
                        <Reasons data={dismissalData} hide={false} />
                      </div>
                    )}
                    {progress === 60 && (
                      <div className="">
                        <SideStory data={dismissalData} hide={false} />
                      </div>
                    )}
                    {progress === 70 && (
                      <div className="">
                        <Witness data={dismissalData} hide={false} />
                      </div>
                    )}
                    {progress === 80 && (
                      <div className="">
                        <Review data={dismissalData} />
                      </div>
                    )}

                    {progress === 90 && (
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
