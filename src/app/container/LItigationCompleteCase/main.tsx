import {
  Alert,
  Box,
  CircularProgress,
  LinearProgress,
  LinearProgressProps,
  Snackbar,
} from "@mui/material";
import "../../admin/admin.css";
import React, { useEffect, useState } from "react";
import QuitenseReport from "./QuitenseReport";
import { useSession } from "next-auth/react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepButton from "@mui/material/StepButton";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { axios } from "@/utils/axios";
import ClientSignature from "./ClientSignature";
import FundForm from "./fundForm";
import KarpaInstruction from "./KarpaInstr";
import { useSearchParams } from "next/navigation";
import JudgementDoc from "./JudgementDoc";
function LitigationCaseCompleteMain({ case_id, role }: any) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(20);
  const { data: session } = useSession();
  const search = useSearchParams();
  const isFund = search?.get("isFund");
  const [activeStep, setActiveStep] = React.useState(0);
  const [reportDetails, setReportDetails]: any = useState({});
  let [steps, setSteps] = useState([
    "Judgement Document",
    "Request Status",
    "Payment Method",
    "Fund Details",
    "Carpa Instruction",
  ]);
  const [fundList, setFundList]: any = useState([]);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});
  const getReportDetails = () => {
    setLoading(true);
    axios
      .get(`/api/litigation-complete?case_id=${case_id}`)
      .then((res: any) => {
        if (res.success) {
          setReportDetails(res?.data);
          setLoading(false);
        }
      });
  };

  const getFundList = () => {
    axios.get(`/api/fund?case_id=${case_id}`).then((res: any) => {
      console.log(res);
      if (res?.success) {
        setFundList(res?.data);
      }
    });
  };
  // let steps = [
  //   "Select Payment method",
  //   "Quitense Details",
  //   "Signature",
  //   "Fund Details",
  //   "Karpa Instruction",
  // ];

  useEffect(() => {
    if (isFund == "true") {
      setActiveStep(3);
    }
  }, [isFund]);
  useEffect(() => {
    if (session?.user?.role == "lawyer" && !reportDetails?.step) {
      setSteps(["Judgement Document"]);

      // setActiveStep(0);
    }
    if (reportDetails?.step == 4 && session?.user?.role == "client") {
      setActiveStep(4);
      setSteps([
        "Judgement Document",
        "Request Status",
        "Payment Method",
        // "Fund Details",
        "Carpa Instruction",
      ]);
    }
    if (reportDetails?.step == 5 && session?.user?.role == "client") {
      setActiveStep(4);
      setSteps([
        "Judgement Document",
        "Request Status",
        "Payment Method",
        // "Fund Details",
        "Carpa Instruction",
      ]);
    }
  }, [session]);

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

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };
  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    if (
      activeStep == 4 &&
      reportDetails?.step == 5 &&
      session?.user?.role == "client"
    ) {
      setActiveStep(3);
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  const handleComplete = () => {
    setCompleted({
      ...completed,
      [activeStep]: true,
    });
    handleNext();
  };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  const normalise = (value: number, MAX: number) => {
    let MIN = 0;
    let finalVal = ((value - MIN) * 100) / (MAX - MIN);
    if (finalVal > 100) {
      finalVal = 100;
    }
    return finalVal;
  };

  useEffect(() => {
    if (case_id) {
      getReportDetails();
      getFundList();
    }
  }, [case_id]);

  useEffect(() => {
    if (reportDetails?.step == 1) {
      setActiveStep(1);
    }
    if (reportDetails?.step == 2) {
      setActiveStep(2);
    }
    if (reportDetails?.step == 3) {
      setActiveStep(3);
    }
    if (
      reportDetails?.step == 4 &&
      !reportDetails?.carpaDocument &&
      role != "expert"
    ) {
      setActiveStep(3);
    }
    if (reportDetails?.step == 4 && role == "expert") {
      setActiveStep(4);
    }
    if (reportDetails?.step == 4 && reportDetails?.carpaDocument) {
      setActiveStep(4);
    }
    if (reportDetails?.step == 5 && session?.user?.role == "expert") {
      setActiveStep(4);
    }
  }, [reportDetails, session]);
  return (
    <>
      <div className="create-cases mt-4">
        <Box sx={{ width: "100%" }}>
          <Stepper nonLinear activeStep={activeStep}>
            {steps.map((label, index) => (
              <Step key={label} completed={completed[index]}>
                <StepButton
                  color="inherit"
                  //  onClick={handleStep(index)}
                >
                  {label}
                </StepButton>
              </Step>
            ))}
          </Stepper>
          <div>
            {allStepsCompleted() ? (
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
                <Typography sx={{ mt: 2, mb: 1, py: 1 }}>
                  <div>
                    {
                      <React.Fragment>
                        <div className="cases-active">
                          {activeStep == 0 && (
                            <JudgementDoc
                              data={reportDetails}
                              progress={progress}
                              loading={loading}
                              setActiveStep={setActiveStep}
                              activeStep={activeStep}
                              role={role}
                              case_id={case_id}
                              setProgress={setProgress}
                              hide={
                                session?.user?.role != "lawyer" ? true : false
                              }
                            />
                          )}
                          {activeStep == 1 && (
                            <QuitenseReport
                              data={reportDetails}
                              hide={
                                session?.user?.role != "expert" ? true : false
                              }
                              case_id={case_id}
                              role={role}
                              loading={loading}
                              setActiveStep={setActiveStep}
                              activeStep={activeStep}
                              progress={progress}
                              setProgress={setProgress}
                            />
                          )}
                          {activeStep == 2 && (
                            <ClientSignature
                              data={reportDetails}
                              hide={
                                session?.user?.role != "client" ? true : false
                              }
                              session={session}
                              case_id={case_id}
                              setActiveStep={setActiveStep}
                              loading={loading}
                              activeStep={activeStep}
                              progress={progress}
                              role={role}
                              setProgress={setProgress}
                            />
                          )}
                          {activeStep == 3 &&
                            session?.user?.role !== "client" && (
                              <FundForm
                                data={reportDetails}
                                hide={
                                  session?.user?.role != "lawyer" ? true : false
                                }
                                fund={fundList}
                                case_id={case_id}
                                loading={loading}
                                setActiveStep={setActiveStep}
                                activeStep={activeStep}
                                progress={progress}
                                role={role}
                                setProgress={setProgress}
                              />
                            )}
                          {activeStep == 4 && (
                            <KarpaInstruction
                              data={reportDetails}
                              hide={
                                session?.user?.role != "expert" ? true : false
                              }
                              session={session}
                              fund={fundList}
                              case_id={case_id}
                              setActiveStep={setActiveStep}
                              activeStep={activeStep}
                              progress={progress}
                              role={role}
                              setProgress={setProgress}
                            />
                          )}
                        </div>
                      </React.Fragment>
                    }
                  </div>
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
                  {/* <Button onClick={handleNext} sx={{ mr: 1 }}>
                    Next
                  </Button> */}
                  {activeStep !== steps.length &&
                    (completed[activeStep] ? (
                      <Typography
                        variant="caption"
                        sx={{ display: "inline-block" }}
                      >
                        Step {activeStep + 1} already completed
                      </Typography>
                    ) : (
                      <></>
                      // <Button onClick={handleComplete}>
                      //   {completedSteps() === totalSteps() - 1
                      //     ? "Finish"
                      //     : "Complete Step"}
                      // </Button>
                    ))}
                </Box>
              </React.Fragment>
            )}
          </div>
        </Box>
      </div>

      {/* <div className="create-cases mt-4">
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
                  {progress == 20 && (
                    <PaymentMethod
                      progress={progress}
                      setProgress={setProgress}
                      hide={session?.user?.role != "client" ? true : false}
                    />
                  )}
                  {progress == 40  && (
                    <QuitenseReport
                      hide={session?.user?.role != "expert" ? true : false}
                      progress={progress}
                      setProgress={setProgress}
                    />
                  )}
                </div>
              </React.Fragment>
            }
          </div>
        )}
      </div> */}
    </>
  );
}

export default LitigationCaseCompleteMain;
