"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import { Link } from "@mui/material";

export default function Privacy({ handleNext }: any) {
  const router = useRouter();
  return (
    <ContentWrapper>
      <div className="lease-privacy white-card">
        <h2 className="f-22 bold mb-2">Welcome!</h2>
        <p className="f-14 gray">
          We value your privacy. For more information on how we handle your
          data, please refer to our{" "}
          <Link href="/" className="bold">
            {" "}
            Privacy Policy{" "}
          </Link>
          . Your progress is saved automatically, so you can come back and
          finish the form anytime.
        </p>
        <h2 className="f-18 bold mb-2">Hello! </h2>

        <p className="f-14 gray">
          We know that seeking compensation after termination can be stressful.
          French law protects against wrongful termination (&quot;licenciement
          abusif&quot;) under Article L1235-3 of the Labor Code. Wrongful
          termination can include:
        </p>

        <ul className="f-14 gray context-list">
          <li>
            {" "}
            <strong>Discrimination: </strong>
            Age, gender, race, religion, etc.
          </li>
          <li>
            <strong>Termination during protected periods: </strong> Pregnancy,
            sick leave, etc.
          </li>
          <li>
            <strong>Without a real and serious cause</strong>
          </li>
          <li>
            <strong>
              Disproportionate sanction compared to the misconduct
            </strong>
          </li>
        </ul>
        <p className="f-14 gray">
          This form is designed to simplify the process of collecting the
          necessary information to assess your compensation request. Most users
          complete it in about 15 minutes.
        </p>
        <h2 className="f-18 bold mt-4">Why These Questions?</h2>
        <p className="f-14 gray mt-2 ">
          Answering these questions helps us understand your situation and
          provide the best possible support.
        </p>

        <h2 className="f-18 bold mt-4"> Tips for Completing the Form: </h2>

        <ul className="f-14 gray context-list">
          <li>
            {" "}
            <strong>Have your documents ready: </strong>
            Keep dismissal letters, emails, and meeting notes handy.{" "}
          </li>
          <li>
            <strong>Take your time: </strong> Your progress is saved
            automatically, so you can return to complete the form whenever
            needed.
          </li>
          <li>
            <strong>Need help? </strong> Click the &quot;Help&quot; button to
            ask a question or request a callback from our team. We&apos;re here
            to assist you!
          </li>
        </ul>
      </div>
      <div className="agree-btn mt-4 text-center">
        <Button
          variant="contained"
          className="green-btn"
          size="lg"
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </ContentWrapper>
  );
}
