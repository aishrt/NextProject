"use client";

import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import "../../client/client.css";

import Box from "@mui/material/Box";
import PrivacyPolicy from "./privacy-policy/Privacy";
import ThankuStep from "./thanku-page/page";
import YourRole from "./_ChildSupportForm/YourRole";
import YourFinances from "./_ChildSupportForm/YourFinances";
import ParentFinances from "./_ChildSupportForm/ParentFinances";
import FinancialSupport from "./_ChildSupportForm/FinancialSupport";
import EducationalExpenses from "./_ChildSupportForm/EducationalExpenses";
import ReviewSubmit from "./_ChildSupportForm/ReviewSubmit";
import SpousalSupport from "./_ChildSupportForm/SpousalSupport";
import SupportAssessment from "./_ChildSupportForm/SupportAssessment";
import axios from "axios";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useRouter, useSearchParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import { Child } from "@/types/Child";

// export const metadata: Metadata = {
//   title: "Eviction Assessment Form",
//   description: "Generated by create next app",
// };

export default function ChildSupportCalculation() {
  const router = useRouter();

  const [progress, setProgress] = useState(10);

  const [loading, setLoading] = useState(false);

  const [childData, setChildData] = useState<Child>();

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
            `/api/client/category/child-support/getSupport?caseId=${caseFromQuery}`
          );
          if (data?.data) {
            setProgress(data?.data?.progress);
            setChildData(data.data);
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", data?.data?.caseId);
            searchParmas.set("progress", data?.data?.progress);
            console.log(data?.data?.progress);
            if (data?.data?.progress == 90) {
              // console.log(data?.data?.progress);
              // router.push(
              //   `/client/spousal-support?caseId=${data?.data?.caseId}`
              // );
            } else {
              router.push(
                `/client/child-support-calculation-form?${searchParmas.toString()}`
              );
            }
          } else {
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", caseFromQuery);
            searchParmas.set("progress", "10");
            router.push(
              `/client/child-support-calculation-form?${searchParmas.toString()}`
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
        if (childData) {
          if (childData.caseId === caseFromQuery) {
            const { data } = await axios.post(
              "/api/client/category/child-support/createSupport",
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
            "/api/client/category/child-support/createSupport",
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
          `/client/child-support-calculation-form?${searchParmas.toString()}`
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
    <ContentWrapper>
      <Box sx={{ width: "100%" }}>
        <div className="top-title">
          <h2 className="f-26 fw-400 mb-4 mt-5">
            Child Support Calculation Form
          </h2>
        </div>

        <div className="create-cases mt-4">
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel value={normalise(progress, 90)} />
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
                        <YourRole data={childData} />
                      </div>
                    )}

                    {progress === 30 && (
                      <>
                        <div className=" eviction-form ">
                          <YourFinances data={childData} />
                        </div>
                      </>
                    )}

                    {progress === 40 && (
                      <>
                        <div className=" eviction-form ">
                          <ParentFinances data={childData} />
                        </div>
                      </>
                    )}
                    {progress === 50 && (
                      <>
                        <div className=" eviction-form ">
                          <FinancialSupport data={childData} />
                        </div>
                      </>
                    )}

                    {progress === 60 && (
                      <>
                        <div className=" eviction-form ">
                          <EducationalExpenses data={childData} />
                        </div>
                      </>
                    )}

                    {progress === 70 && (
                      <>
                        <div className=" eviction-form ">
                          <ReviewSubmit data={childData} />
                        </div>
                      </>
                    )}

                    {progress === 80 && (
                      <>
                        <div className=" eviction-form ">
                          <SpousalSupport data={childData} />
                        </div>
                      </>
                    )}

                    {progress === 90 && (
                      <>
                        <div className=" eviction-form ">
                          <SupportAssessment data={childData} />
                        </div>
                      </>
                    )}

                    {progress === 100 && (
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
