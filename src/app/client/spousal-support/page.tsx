"use client";

import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import { Metadata } from "next";
import "../../client/client.css";
import Box from "@mui/material/Box";
import PrivacyPolicy from "./privacy-policy/Privacy";
import ThankuStep from "./thanku-page/page";
import StartBasics from "./_SpousalForms/StartBasics";
import AboutYourself from "./_SpousalForms/AboutYourself";
import SpouseFinancialSituation from "./_SpousalForms/SpouseFinancialSituation";
import EstimateAssetDivision from "./_SpousalForms/EstimateAssetDivision";
import SubmitInfo from "./_SpousalForms/SubmitInfo";
import ChildSupport from "./_SpousalForms/ChildSupport";
import axios from "axios";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useRouter, useSearchParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { Spousal } from "@/types/Spousal";

// export const metadata: Metadata = {
//   title: "Eviction Assessment Form",
//   description: "Generated by create next app",
// };

export default function SpousalSupport() {
  const router = useRouter();

  const [progress, setProgress] = useState(10);

  const [loading, setLoading] = useState(false);

  const [spousalData, setSpousalData] = useState<Spousal>();

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
            `/api/client/category/spousal/getSpousal?caseId=${caseFromQuery}`
          );
          const child = await axios.get(
            `/api/client/category/child-support/getSupport?caseId=${caseFromQuery}`
          );
          const findChild = child?.data?.data;
          if (data?.data) {
            setProgress(data?.data?.progress);
            setSpousalData(data.data);
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", data?.data?.caseId);
            searchParmas.set("progress", data?.data?.progress);
            if (
              data?.data?.childSupport == "yes" &&
              data?.data?.caseId == findChild?.caseId &&
              findChild?.progress != 100
            ) {
              router.push(
                `/client/child-support-calculation-form?caseId=${data?.data?.caseId}`
              );
            } else {
              router.push(`/client/spousal-support?${searchParmas.toString()}`);
            }
          } else {
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", caseFromQuery);
            searchParmas.set("progress", "10");
            router.push(`/client/spousal-support?${searchParmas.toString()}`);
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
        if (spousalData) {
          if (spousalData.caseId === caseFromQuery) {
            const { data } = await axios.post(
              "/api/client/category/spousal/createSpousal",
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
            "/api/client/category/spousal/createSpousal",
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
        router.push(`/client/spousal-support?${searchParmas.toString()}`);
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
            Evaluation Request Form for Spousal Support
          </h2>
        </div>

        <div className="white-card create-cases mt-4">
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={normalise(progress, 70)} />
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
                        <PrivacyPolicy handleNext={handleNext} />
                      </div>
                    )}

                    {progress === 20 && (
                      <div className="">
                        <StartBasics data={spousalData} />
                      </div>
                    )}

                    {progress === 30 && (
                      <>
                        <div className=" eviction-form ">
                          <AboutYourself data={spousalData} />
                        </div>
                      </>
                    )}

                    {progress === 40 && (
                      <>
                        <div className=" eviction-form ">
                          <SpouseFinancialSituation data={spousalData} />
                        </div>
                      </>
                    )}
                    {progress === 50 && (
                      <>
                        <div className=" eviction-form ">
                          <EstimateAssetDivision data={spousalData} />
                        </div>
                      </>
                    )}

                    {progress === 60 && (
                      <>
                        <div className=" eviction-form ">
                          {/* <SubmitInfo /> */}
                          <ChildSupport data={spousalData} />
                        </div>
                      </>
                    )}

                    {progress === 70 && (
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
