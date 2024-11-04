  "use client";

  import React, { useState } from "react";
  import "../../../client/client.css";
  import { Link } from "@mui/material";
  import { useRouter, useSearchParams } from "next/navigation";
  import { Child } from "@/types/Child";
  import { Button } from "@/components/Form/Button";
  import axios from "axios";

const SupportAssessment = ({ data }: { data: Child | undefined }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const searchParmas = useSearchParams();
  const progress = searchParmas?.get("progress")!;
  const caseId = searchParmas?.get("caseId")!;

  const handleNext = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          progress: 100,
          nextProgress: 100,
        }
      );

      let id = data.data.caseId;

      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "100");
      router.push(
        `/client/child-support-calculation-form?${searchParam.toString()}`
      );

      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = async () => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/client/category/child-support/createSupport",
        {
          caseId: caseId,
          progress: 80,
        }
      );
      let id = data.data.caseId;
      const searchParam = new URLSearchParams();
      searchParam.set("caseId", id);
      searchParam.set("progress", "80");
      router.push(
        `/client/child-support-calculation-form?${searchParam.toString()}`
      );
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="lease-form">
      <h3 className="f-22 bold mt-4  gray">Spousal Support Assessment</h3>
      <p className="f-14">
        (This step would mirror the previous structure, guiding the user through
        questions specific to spousal support. It would include sections on
        their financial situation, their spouse&apos;s financial situation,
        asset division, etc.)
      </p>
      <div className="assess-link">
        <Link>
          <p
            onClick={() =>
              router.push(`/client/spousal-support?caseId=${caseId}`)
            }
          >
            See _Evaluation Request Form for Spousal Support
          </p>
        </Link>
      </div>

      <div className="col-12 text-center mt-4">
        <div className="agree-btn mt-4 text-center d-flex justify-content-center align-items-center gap-3">
          <Button
            variant="contained"
            className="green-btn"
            size="lg"
            onClick={() => handlePrevious()}
          >
            Previous
          </Button>

          <Button
            variant="contained"
            size="lg"
            className="green-btn"
            onClick={() => handleNext()}
          >
            <span className="f-16">Next</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SupportAssessment;
