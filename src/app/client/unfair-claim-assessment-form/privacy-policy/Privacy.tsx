import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import { useRouter, useSearchParams } from "next/navigation";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";

export default function Privacy({ handleNext }: any) {
  const router = useRouter();
  const search = useSearchParams();
  const id = search?.get("caseId");
  return (

      <div className="lease-privacy white-card mb-4 mt-4 p-4 rounded">
        <h3 className="f-26  pb-2 fw-400 ">Introduction</h3>
        <p className="f-14 mb-2">
          {`Welcome! We're here to help you address your concerns about unfair
        competition. This form will guide you through the process of sharing
        the necessary information with us. It should take about 15 minutes to
        complete, and you can save your progress and return later if needed.`}
        </p>

        <p className="f-14  mb-2">
          <span className="bold">Your Privacy Matters </span>
          🔒 The information you provide will be used solely to assess your
          claim and will be kept confidential. For more details, please refer to
          our [Privacy Policy](link to your privacy policy).
        </p>

        <div className="text-center mt-4">
          <Button
            onClick={handleNext}
            variant="contained"
            className="client-btn f-14"
            size="lg"
            // onClick={async () => {
            //   // await axios.post("/api/client/case/add-case", {
            //   //   caseId: id,
            //   // });

            //   await axios.post("/api/client/category/unfair/createUnfair", {
            //     caseId: id,
            //     progress: 20,
            //   });
            //   router.push(
            //     `/client/unfair-claim-assessment-form?caseId=${id}?progress=20`
            //   );
            // }}
          >
            Ok
          </Button>
        </div>
      </div>
    
  );
}
