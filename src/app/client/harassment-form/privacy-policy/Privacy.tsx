"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import {
  FormControl,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup,
} from "@mui/material";

export default function Privacy({ handleNext }: any) {
  const router = useRouter();

  return (
    <div>
      <div className="lease-privacy white-card mt-4 p-4 rounded">
        <h6 className="f-26  fw-400"> WELCOME !</h6>
        <p className="f-14">
          We value your privacy. For more information on how we handle your
          data, please refer to our Privacy Policy. Your progress is saved
          automatically, so you can come back and finish the form anytime.
        </p>
        <h2 className="f-18 fw-500 my-2">Hello !</h2>

        <p className="f-14">
          We understand that dealing with harassment and seeking compensation
          can be both stressful and overwhelming. This form is designed to
          simplify the process of collecting the essential information needed to
          assess your compensation request. Most users complete this form in
          about 15 minutes.
        </p>
        <h2 className="f-18 fw-500 my-2">Why We Ask These Questions:</h2>

        <p className="f-14">
          We will ask you a series of questions to gather all the necessary
          details about your employment and the circumstances surrounding the
          harassment. These questions are crucial because they help us
          understand your situation fully and ensure that we provide you with
          the best possible support.
        </p>
        <h2 className="f-18 fw-500 my-2">Tips for Completing the Form:</h2>
        <p className="f-14">
          We understand that non-compete clauses can be complex. This form
          streamlines the process of gathering essential information to assess
          your situation. Most users complete it in about 10 minutes. Please
          select whether you are you are an employer seeking to enforce a
          non-compete clause or an employee who is subject to one.
        </p>

        <p className="f-14  mb-1">
          • <strong>Have your documents ready : </strong> Having documents such
          as emails, notes, and medical records handy is crucial for providing
          accurate details.
        </p>

        <p className="f-14  mb-1">
          • <strong>Take your time : </strong> Your progress is saved
          automatically, so you can return to complete the form whenever you
          need.
        </p>

        <p className="f-14  mb-1">
          • <strong>Need help? </strong>Click the &quot;Help&quot; button to ask
          a question or request a callback from our team. We&apos;re here to
          assist you!
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
