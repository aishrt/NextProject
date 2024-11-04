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
import AboutYourself from "./_DismissalForms/AboutYourself";
import Review from "./_DismissalForms/Review";
import { Vexatious } from "@/types/Vexatious";
import Health from "./_DismissalForms/Health";
import AboutEmployer from "./_DismissalForms/AboutEmployer";
import Happened from "./_DismissalForms/Happened";
import DismissalAffected from "./_DismissalForms/DismissalAffected";
import SupportingCase from "./_DismissalForms/SupportingCase";

export default function VexatiousAssessmentForm() {
  const router = useRouter();

  const [progress, setProgress] = useState(10);

  const [loading, setLoading] = useState(false);

  const [vexatiousData, setVexatiousData] = useState<Vexatious>();

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
            `/api/client/category/vexatious/getVexatious?caseId=${caseFromQuery}`
          );
          if (data?.data) {
            setProgress(data?.data?.progress);
            setVexatiousData(data.data);
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", data?.data?.caseId);
            searchParmas.set("progress", data?.data?.progress);
            router.push(`/client/vexatious-form?${searchParmas.toString()}`);
          } else {
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", caseFromQuery);
            searchParmas.set("progress", "10");
            router.push(`/client/vexatious-form?${searchParmas.toString()}`);
          }
        }
      } catch (error) {
        console.log("err", error);
        setLoading(false);
      } finally {
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
        if (vexatiousData) {
          if (vexatiousData.caseId === caseFromQuery) {
            const { data } = await axios.post(
              "/api/client/category/vexatious/createVexatious",
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
            "/api/client/category/vexatious/createVexatious",
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
        router.push(`/client/vexatious-form?${searchParmas.toString()}`);
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
          <h2 className="f-26 fw-500 mb-4 mt-5">
            Dismissal Under Vexatious Circumstances Assessment Form
          </h2>
        </div>

        <div className="create-cases mt-4">
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
                      <div className="">
                        <AboutYourself data={vexatiousData} hide={false} />
                      </div>
                    )}

                    {progress === 30 && (
                      <div className="">
                        <Health data={vexatiousData} hide={false} />
                      </div>
                    )}

                    {progress === 40 && (
                      <div className="">
                        <AboutEmployer data={vexatiousData} hide={false} />
                      </div>
                    )}

                    {progress === 50 && (
                      <div className="">
                        <Happened data={vexatiousData} hide={false} />
                      </div>
                    )}
                    {progress === 60 && (
                      <div className="">
                        <DismissalAffected data={vexatiousData} hide={false} />
                      </div>
                    )}

                    {progress === 70 && (
                      <div className="">
                        <SupportingCase data={vexatiousData} hide={false} />
                      </div>
                    )}

                    {progress === 80 && (
                      <div className="">
                        <Review data={vexatiousData} />
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
