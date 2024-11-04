"use client";
import React, { useEffect, useState } from "react";
import "../../client/client.css";
import Box from "@mui/material/Box";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Introduction from "./case-steps/introduction";
import Privacy from "./case-steps/privacy";
import YourRole from "./case-steps/yourRole";
import YourInformation from "./case-steps/yourInformation";
import Representation from "./case-steps/representation";
import GroupDetails from "./case-steps/groupDetails";
import Procedural from "./case-steps/procedural";
import OpposingParty from "./case-steps/opposingParty";
import Submit from "./case-steps/submit";
import { Typography } from "@mui/material";

export default function CreateCases() {
  // query & search parms
  const searchParams = useSearchParams();
  const caseId = searchParams ? searchParams.get("caseId") : null;
  const progress = searchParams ? searchParams.get("progress") : null;

  const router = useRouter();

  // States
  const [caseData, setCaseData] = useState({});
  const [progerssValue, setProgressValue] = useState<number>(Number(progress));
  const [loading, setLoading] = useState(false);

  //useEffects

  useEffect(() => {
    if (progress) {
      setProgressValue(Number(progress));
    } else {
      setProgressValue(10);
    }
  }, [progress]);

  useEffect(() => {
    if (caseId) {
      getCaseAllDetail();
    }
  }, [caseId, progress]);

  // functions list
  // get case details
  async function getCaseAllDetail() {
    // setLoading(true);

    const caseData = await axios.get(
      `/api/client/case/get-case?caseId=${caseId}`
    );
    setProgressValue(caseData?.data?.data?.progress);
    setCaseData(caseData?.data?.data);

    let value = caseData?.data?.data?.progress;
    if (value !== 90) {
      router.push(
        `/client/create-case?progress=${caseData?.data?.data?.progress}&caseId=${caseData?.data?.data?._id}`
      );
    }
    setLoading(false);
  }

  //update case data
  const updateCaseData: Function = async (caseDataJson: any) => {
    setLoading(true);
    try {
      console.log(caseDataJson);

      const caseData = await axios.post("/api/client/case/add-case", {
        ...caseDataJson,
        caseId: caseId,
      });
      if (caseDataJson.resumeLater == "resumeLater") {
        router.push(`/client/cases-list?type=preLitigation`);
      } else {
        router.push(
          `/client/create-case?progress=${caseData?.data?.data?.progress}&caseId=${caseData?.data?.data._id}`
        );
      }
      setCaseData(caseData.data.data);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  function getStepsValue(): any {
    switch (progerssValue) {
      case 10:
        return (
          <Introduction
            handleChange={updateCaseData}
            setProgressValue={setProgressValue}
          />
        );

      case 20:
        return (
          <Privacy
            handleChange={updateCaseData}
            setProgressValue={setProgressValue}
          />
        );

      case 30:
        return (
          <YourRole
            handleChange={updateCaseData}
            setProgressValue={setProgressValue}
            caseData={caseData}
          />
        );

      case 40:
        return (
          <YourInformation
            handleChange={updateCaseData}
            setProgressValue={setProgressValue}
            caseData={caseData}
          />
        );

      case 50:
        return (
          <Representation
            handleChange={updateCaseData}
            setProgressValue={setProgressValue}
            caseData={caseData}
          />
        );

      case 60:
        return (
          <GroupDetails
            handleChange={updateCaseData}
            setProgressValue={setProgressValue}
            caseData={caseData}
          />
        );

      case 70:
        return (
          <OpposingParty
            handleChange={updateCaseData}
            setProgressValue={setProgressValue}
            caseData={caseData}
          />
        );

      case 80:
        return (
          <Procedural
            handleChange={updateCaseData}
            setProgressValue={setProgressValue}
            caseData={caseData}
          />
        );

      case 90:
        return <Submit caseData={caseData} />;

      default:
        return null;
    }
  }

  function getTitle() {
    switch (progerssValue) {
      case 10:
        return "Welcome";

      case 20:
        return "Data Privacy";

      case 30:
        return "Tell us your role";

      case 40:
        return "Your Information";

      case 50:
        return "Legal Support";

      case 60:
        return "Details Of Your Group";

      case 70:
        return "Opposing Party Details";

      case 80:
        return "";

      default:
        return null;
    }
  }

  const normalise = (value: number, MAX: number) => {
    let MIN = 0;
    let finalVal = ((value - MIN) * 100) / (MAX - MIN);
    if (finalVal > 100) {
      finalVal = 100;
    }
    return finalVal;
  };

  return (
    <div className="main-content">
      <h2 className="bold f-22">{getTitle()}</h2>
      <div className="create-cases mt-4">
        {/* <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <div className="w-100 mr-1 linear-progress-p p-1 bg-white shadow ">
              <LinearProgress
                className="green-progress-bar"
                variant="determinate"
                value={normalise(progerssValue, 90)}
              />
            </div>
          </Box>
        </Box> */}

        <Box sx={{ width: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <div className="w-100 mr-1 linear-progress-p p-1 bg-white shadow">
              <Box sx={{ position: "relative", width: "100%" }}>
                <LinearProgress
                  className="green-progress-bar"
                  variant="determinate"
                  value={normalise(progerssValue, 90)}
                />
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                    color: "text.secondary",
                    fontWeight: "800",
                  }}
                >
                  {`${progerssValue}%`}
                </Typography>
              </Box>
            </div>
          </Box>
        </Box>

        {loading ? (
          <p className="text-center mt-5">
            <CircularProgress />
          </p>
        ) : (
          <>
            <div className="cases-active mt-4">{getStepsValue()}</div>
          </>
        )}
      </div>
    </div>
  );
}
