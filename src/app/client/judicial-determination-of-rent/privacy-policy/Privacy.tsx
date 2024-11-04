"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";
import { Link } from "@mui/material";

export default function Privacy({ handleNext }: any) {
  const router = useRouter();
  return (
    <div className=" rounded mt-4">
      <div className="lease-privacy white-card">
        <h6 className="f-26  fw-400 pb-2"> WELCOME !</h6>
        <p className="f-18 fw-500 mb-1">
          Your privacy is important to us. Please see our{" "}
          <Link href="/" className="bold">
            {" "}
            Privacy Policy.
          </Link>{" "}
          for more information on how we handle your data.
        </p>

        <p className="f-14  mb-3">
          <strong>Your progress is saved automatically. </strong> You can come
          back and finish this later.
        </p>

        <p className="f-20 fw-500 mb-1 mt-4">
          Hi there!
        </p>
        {/* <p className="f-14 gray mb-1">
           <strong>Save your progress. </strong> You can return to complete
          the form later if needed.
        </p> */}
        <p className="f-14  mt-2 ">
          We understand that dealing with lease issues can be complex. This form
          streamlines the process of gathering essential information to assess
          your request for a judicial determination of rent. Most users complete
          this form in about 15 minutes.
        </p>

        <h2 className="f-18 fw-500 mb-2 mt-4">Form Completion Tips: </h2>
        <p className="f-14  mb-1">
          📄 <strong>Have your lease documents ready.</strong> Accurate details
          are crucial.
        </p>

        <p className="f-14  mb-1">
          💾 <strong>Save your progress. </strong> You can return to complete
          the form later if needed.
        </p>
      </div>
      <div className="agree-btn mt-4 text-center">
        <Button
          variant="contained"
          className="client-btn f-16"
          size="lg"
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
