"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";

export default function Privacy({ handleNext }: any) {
  const router = useRouter();
  return (
<div>
      <div className="lease-privacy white-card mt-4">
        <h2 className="f-22 bold mb-2">
          WELCOME!
          {/* Evaluation Request Form for Sudden Contract Termination */}
        </h2>
        <p className="f-14  ">
          {/* We understand that the unexpected end of your business relationship
          has been difficult. This form is here to help you gather the
          information needed to assess your situation. It should take about 10
          minutes. */}
          Your privacy is important to us. Please see our [Privacy Policy] for
          more information on how we handle your data.
        </p>

        <p className="f-14 mb-1">
          <strong>Need help?</strong> Click the &quot;Help&quot; button to ask a
          question or request a callback from our team. We&apos;re here to
          assist you!
        </p>

        <p className="f-14  mb-1">
          <strong>Your progress is saved automatically.</strong>
          You can come back and finish this later.
        </p>
        <p className="f-14  mt-3 bold">
          Hi there! Did your business partner unexpectedly end your agreement?
        </p>

        <p className="f-14  mb-1">
          This can happen through various means like written notice, reduced
          orders, verbal communication, or even an abrupt halt in business
          activities. Let&apos;s understand your situation and see if you have a
          case. This assessment should take about 10 minutes.
        </p>
        {/* <h2 className="f-18 mb-2">Form Completion Tips: </h2> */}
        <p className="f-14  mt-3 bold">Form Completion Tips: </p>

        {/* <p className="f-14 gray mb-1">
          Have your medical and accident documents handy. Accurate information
          is essential for this evaluation.
        </p> */}

        <p className="f-14  mb-1">
          Have relevant documents, such as business agreements, financial
          records, and communication with the other party, readily available.
        </p>
        <p className="f-14  mb-1">
          Unsure about a question? You can save your progress and come back to
          it later.
        </p>
        {/* <p className="f-14 gray mb-1">
          📄 <strong>Have your lease documents handy.</strong> Accurate
          information is essential for this evaluation.
        </p>
        <p className="f-14 gray mb-1">
          💾 <strong> Unsure about a question? </strong> You can save your
          progress and come back to it later.
        </p>
        <h2 className="f-18 mb-2">Your Privacy Matters 🔒 </h2> */}
        {/* <p className="f-14 gray mt-3 bold">
          Your information is confidential and will only be used to evaluate
          your claim. For details, please see our Privacy Policy.
        </p> */}
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
