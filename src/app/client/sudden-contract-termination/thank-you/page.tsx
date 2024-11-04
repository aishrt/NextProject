"use client";
import React, { useState } from "react";
import "../../../client/client.css";

import { useRouter, useSearchParams } from "next/navigation";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import { Button } from "@/components/Form/Button";
import axios from "axios";

export default function ThankYou() {
  const router = useRouter();
  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress");
  const caseId = searchParmas?.get("caseId");

  const [loading, setLoading] = useState(false);

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/sudden/createSudden",
        {
          caseId: caseId,
          progress: 60,
        }
      );

      let id = data?.data?.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "60");
      router.push(
        `/client/sudden-contract-termination?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <ContentWrapper>
      <div className="lease-privacy white-card p-5 rounded">
        <h2 className="f-26 mb-2">THANK YOU!</h2>
        <p className="f-14 ">
          {`Your claim has been successfully submitted. You are not alone in this. We are here to help you navigate through this challenging situation. Let's work together to find the best solution for you. A legal professional will review your information and contact you within two business days to discuss your options and next steps.`}
        </p>

        <p className="f-14 pb-4">
          <strong>Please note: </strong>This form is not a substitute for legal
          advice. We strongly recommend consulting an attorney to confirm your
          eligibility and guide you through the formal legal process. As part of
          our claim assessment, we will connect you with qualified attorneys who
          can support you in your legal journey. If you wish, Indemnisez Moi can
          cover legal fees through a litigation funding agreement.
        </p>

        {/* <h2 className="f-18 mb-2">Next Steps: </h2> */}
        {/* <p className="f-14 gray mt-3 bold">
          {`Once you submit this form, a legal professional will review your
          information and get in touch to discuss your options.`}
        </p>
        <h2 className="f-18 mb-2">Warning: </h2>
        <p className="f-14 gray mt-3 bold">
          {`This is not a substitute for legal advice; it's strongly recommended
          to consult an attorney to confirm eligibility and guide you through
          the formal process.`}
        </p> */}

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
    </ContentWrapper>
  );
}
