"use client";

import React from "react";
import "../../../client/client.css";
import { useEffect, useState } from "react";
import { Button } from "@/components/Form/Button";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";

export default function ThankuStep() {
  const router = useRouter();
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/spousal/createSpousal",
        {
          caseId: caseId,
          progress: 60,
        }
      );

      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");
      router.push(`/client/spousal-support?${searchParam.toString()}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mb-4"> Thank You!</h3>
      <p className="f-14 gray">
        Your claim has been successfully submitted. You are not alone in this.
        We are here to help you navigate through this challenging situation.
        Let&apos;s work together to find the best solution for you. A legal
        professional will review your information and contact you within two
        business days to discuss your options and next steps.
      </p>

      <p className="f-14 gray">
        <span className="bold f-14">Please note: </span>This form is not a
        substitute for legal advice. We strongly recommend consulting an
        attorney to confirm your eligibility and guide you through the formal
        legal process.
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
            onClick={() => router.push("/client/cases")}
          >
            <span className="f-16">Save</span>
          </Button>
        </div>
      </div> */}
    </div>
  );
}
