"use client";

import React, { useEffect, useState } from "react";
import ContentWrapper from "@/components/Layout/Admin/ContentWrapper";
import "../../client/client.css";
import Box from "@mui/material/Box";
import ThankuStep from "./thanku-page/page";
import axios from "axios";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useSearchParams, useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import PrivacyPolicy from "./privacy-policy/Privacy";
import LeaseForm from "./_EvictionForms/LeaseForm";
import { Eviction } from "@/types/Eviction";
import Activity from "./_EvictionForms/Activity";
import Renewal from "./_EvictionForms/Renewal";
import Premises from "./_EvictionForms/Premises";
import Building from "./_EvictionForms/Building";
import LocalFactors from "./_EvictionForms/LocalFactors";
import Lease from "./_EvictionForms/Lease";
import LegalAspects from "./_EvictionForms/LegalAspects";
import BusinessCharacteristics from "./_EvictionForms/BusinessCharacteristics";
import BusinessValuation from "./_EvictionForms/BusinessValuation";
import ReviewForm  from "./_EvictionForms/ReviewForm";

export default function EvictionForm() {
  const router = useRouter();

  const [progress, setProgress] = useState(10);

  const [loading, setLoading] = useState(false);

  const [evictionData, setEvictionData] = useState<Eviction>();

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
            `/api/client/category/eviction/getEviction?caseId=${caseFromQuery}`
          );
          if (data?.data) {
            setProgress(data?.data?.progress);
            setEvictionData(data.data);
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", data?.data?.caseId);
            searchParmas.set("progress", data?.data?.progress);
            router.push(
              `/client/eviction-assessment-form?${searchParmas.toString()}`
            );
          } else {
            const searchParmas = new URLSearchParams();
            searchParmas.set("caseId", caseFromQuery);
            searchParmas.set("progress", "10");
            router.push(
              `/client/eviction-assessment-form?${searchParmas.toString()}`
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
        if (evictionData) {
          if (evictionData.caseId === caseFromQuery) {
            const { data } = await axios.post(
              "/api/client/category/eviction/createEviction",

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
            "/api/client/category/eviction/createEviction",
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
          `/client/eviction-assessment-form?${searchParmas.toString()}`
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
          <h2 className="f-26  semi-bold  fw-400 mb-4 mt-5">
            Eviction Compensation Assessment Form
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
                        <LeaseForm data={evictionData} hide={false} />
                      </div>
                    )}
                    {progress === 30 && (
                      <div className="">
                        <Activity data={evictionData} hide={false} />
                      </div>
                    )}
                    {progress === 40 && (
                      <div className="">
                        <Renewal data={evictionData} hide={false} />
                      </div>
                    )}
                    {progress === 50 && (
                      <div className="">
                        <Premises data={evictionData} hide={false} />
                      </div>
                    )}
                    {progress === 60 && (
                      <div className="">
                        <Building data={evictionData} hide={false} />
                      </div>
                    )}
                    {progress === 70 && (
                      <div className="">
                        <LocalFactors data={evictionData} hide={false} />
                      </div>
                    )}
                    {progress === 80 && (
                      <div className="">
                        <Lease data={evictionData} hide={false} />
                      </div>
                    )}
                    {progress === 90 && (
                      <div className="">
                        <BusinessCharacteristics
                          data={evictionData}
                          hide={false}
                        />
                      </div>
                    )}
                    {progress === 100 && (
                      <div className="">
                        <BusinessValuation data={evictionData} hide={false} />
                      </div>
                    )}
                    {progress === 110 && (
                      <div className="">
                        <LegalAspects data={evictionData} hide={false} />
                      </div>
                    )}
                    {progress === 120 && (
                      <div className="">
                        <ReviewForm data={evictionData} />
                      </div>
                    )}
                    {progress === 130 && (
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
