"use client";

import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import AnimateAuth from "@/components/Animate/AnimateAuth";
import Image from "next/image";
import logo from "@/assets/logo.png";
import loginbg from "@/assets/loginbg.png";
import female from "@/assets/female.png";
import DocUploadComponent from "@/app/container/documentUpload/_docUpload";
import { axios } from "@/utils/axios";
import { useSession } from "next-auth/react";
import Button from "@mui/material/Button"; // Import Button from MUI
import { useRouter } from "next/navigation";
import "../../login/login.css";
import useSnackbar from "@/hooks/useSnackbar";
const steps = ["Upload Documents", "Pending", "Accepted/Rejected"];

export default function DocumentUpload() {
  const { data: session, status } = useSession();
  const [activeStep, setActiveStep] = useState(0);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated" && session?.user?.docStatus) {
      switch (session.user.docStatus) {
        case "submitted":
          setActiveStep(1);
          break;
        case "rejected":
          setActiveStep(2);
          break;
        case "accepted":
          router.push('/lawyer/dashboard');
          break;
        default:
          setActiveStep(0);
      }
    }
  }, [session, status]);

  const handleFormSubmit = async (data: { aboutMe: string | Blob; experiences: any; educations: any; achievements: any; }) => {
    const formData = new FormData();

    formData.append('aboutMe', data.aboutMe);

    const appendSection = (section: any[], sectionName: string) => {
      section.forEach((item: { description: string | Blob; upload: string | Blob; }, index: any) => {
        formData.append(`${sectionName}[${index}][description]`, item.description);
        if (item.upload) {
          formData.append(`${sectionName}[${index}][upload]`, item.upload);
        }
      });
    };

    appendSection(data.experiences, 'experiences');
    appendSection(data.educations, 'educations');
    appendSection(data.achievements, 'achievements');

    try {
      const res = await axios.post('/api/auth/upload-docs', formData);
      openSnackbar({
        message: "Documents uploaded successfully",
        type: "success",
      });
      // Update the step after successful submission
      setActiveStep(1);
    } catch (error: any) {
      console.error(error);
      openSnackbar({
        message: error.message,
        type: "error",
      });
    }
  };

  const handleReupload = () => {
    setActiveStep(0);
  };


  return (
    <AnimateAuth>
      <section className="login-section register-expert doc-expert">
        <div className="row login-main-r">
          <div className="col-12 col-md-12 col-lg-6 relative">
            <div
              className="login-img  login-background  text-white relative"
              style={{ backgroundImage: `url(${loginbg.src})` }}
            >
              <Image src={logo} className="login-logo" alt="logo" />
              <h2 className="f-52 semi-bold pt-4">
                Empowering <br /> Legal Solutions
              </h2>
              <p className="f-15">Join Our Tech-Driven Platform Today </p>
            </div>
            <div className="login-abs-icon">
              <Image src={female} className="female" alt="logo" />
            </div>
          </div>
          <div className="col-12 col-md-12 col-lg-6">
            <div className="login-form p-5 pe-0">
              <div className="login-title pb-4">
                <h2 className="f-52">Document Upload</h2>
              </div>
              <Card elevation={5} style={{ boxShadow: "none" }}>
                <CardContent className="p-0">
                  <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                  {activeStep === 0 && <DocUploadComponent onFormSubmit={handleFormSubmit} />}
                  {activeStep === 1 && <div className="submission-step">Your Submission is being reviewed by the admin.</div>}
                  {activeStep === 2 && (
                    <div className="submission-step">
                      <div>Your Document has been rejected by the admin.</div>
                      <p><b>Rejection Reason:</b> {session?.user?.rejectReason}</p>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleReupload} 
                        style={{ marginTop: "16px" }}
                      >
                        Reupload Documents
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </AnimateAuth>
  );
}
