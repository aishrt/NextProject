"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import { useRouter, useSearchParams } from "next/navigation";

import ContentWrapper from "@/components/Layout/Client/ContentWrapper";

export default function ProceedSecond() {
  const router = useRouter();
  const params = useSearchParams();
  let caseId = params?.get("caseId")!;

  return (
    <ContentWrapper>
      <div className="lease-proceed lease-privacy  white-card">
        <h3 className="f-18 bold gray mb-2 text-center">
          Thanks for submitting your data. Would you like to proceed further or
          not ? Please choose &quot;Proceed to Next Step&quot; to proceed now or
          &quot;Not now&quot; to proceed later.
        </h3>
        <div className="proceed-further mt-4 text-center d-flex gap-3 justify-content-center align-items-center">
          <Button
            type="submit"
            variant="contained"
            className="green-btn"
            size="lg"
            onClick={() => {
              const searchParmas = new URLSearchParams();
              searchParmas.set("caseId", caseId);
              searchParmas.set("progress", "1");
              router.push(
                `/client/eviction-assessment-form?${searchParmas.toString()}`
              );
            }}
          >
            Proceed to Next Step
          </Button>
          <Button
            type="submit"
            variant="outline"
            className="green-border"
            size="lg"
            onClick={() => {
              router.push("/client/eviction-assessment-form/thanku-page");
            }}
          >
            Not Now
          </Button>
        </div>
      </div>
    </ContentWrapper>
  );
}
