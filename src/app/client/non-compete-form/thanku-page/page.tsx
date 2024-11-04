"use client";

import React from "react";
import "../../../client/client.css";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Form/Button";
import { Link } from "@mui/material";
import axios from "axios";

export default function ThankuStep() {
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId");
  const [loading, setLoading] = useState(false);

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/non-competition/createCompetition",
        {
          caseId: caseId,
          progress: 70,
        }
      );
      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "70");
      router.push(`/client/non-compete-form?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="lease-form white-card p-5">
      <h3 className="f-22 bold mb-4">THANK YOU!</h3>
      <p className="f-14 gray">
        Your claim has been successfully submitted. A legal professional will
        review your information and contact you within two business days to
        discuss your options and next steps.
      </p>
      <p className="f-14 gray">
        <strong>Please note: </strong>
        This form is not a substitute for legal advice. We strongly recommend
        consulting an attorney to confirm your eligibility and guide you through
        the formal legal process. As part of our claim assessment, we will
        connect you with qualified attorneys who can support you in your legal
        journey. If you wish, Indemnisez Moi can cover legal fees through a
        litigation funding agreement.
      </p>

      {/* <div className="col-12 text-center mt-4">
        <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
          <Button
            variant="primary"
            className="green-btn"
            size="lg"
            onClick={() => handlePrevious()}
          >
            <span className="f-16">Previous</span>
          </Button>

          <Button
            variant="outline"
            size="lg"
            className="green-border f-16"
            onClick={() => router.push("/client/cases-list?type=preLitigation")}
          >
            <span className="f-16">Next</span>
          </Button>
        </div>
      </div> */}
    </div>
  );
}
