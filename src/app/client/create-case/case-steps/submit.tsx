"use client";
import React, { useState } from "react";
import Image from "next/image";
import team from "@/assets/discussion.png";
import Link from "next/link";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";

export default function Submit({ caseData }: { caseData: any }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const caseId = searchParams?.get("caseId");

  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setLoading(true);
    router.push(`/client/case-categories?caseId=${caseId}`);
  };
  const handlePrevious = async () => {
    try {
      //setLoading(true);
      const caseData = await axios.post("/api/client/case/add-case", {
        progress: 80,
        caseId: caseId,
      });
      router.push(`/client/create-case?progress=80&caseId=${caseId}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="first-step white-card rounded-lg p-5">
        <div className="row align-items-center">
          <div className="col-12 col-md-7">
            <h3 className="f-26 fw-400 pb-2">
              Successfully submitted the case
            </h3>
            <p className="f-18 gray">
              Lorem ipsum is a placeholder text commonly used to demonstrate the
              visual form of a document or a typeface without relying on
              meaningful content.Lorem ipsum may be used as a placeholder before
              the final copy is available.
            </p>

            <div className="step-btns d-flex gap-3">
              <LoadingButton
                variant="contained"
                className="client-btn"
                loading={loading}
                onClick={() => {
                  handleNext();
                }}
              >
                Next
              </LoadingButton>
              <Button
                variant="outlined"
                className="border-0 text-black text-decoration-underline"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  handlePrevious();
                }}
              >
                Previous
              </Button>
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="text-center team-img">
              <Image src={team} className="teams-icon" alt="" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
