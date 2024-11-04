"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Privacy({ handleNext }: any) {
  const router = useRouter();
  return (
    <div className="lease-form the-basices p-4 rounded white-card mt-4 indivi-form">
      <h3  className="f-26  fw-400 pb-3">
        Welcome!
        {/* <span className="bold"> Data Privacy Notice</span> 🔒 We take your
          privacy seriously. The information you provide in this form will be
          used solely to estimate the eviction compensation you may be entitled
          to. Your data will be stored securely and only accessed by authorized
          personnel. We will not share your information with any third party
          without your consent. */}
      </h3>
      <p className="f-20 fw-500  ">
        {/* *Here are some additional details regarding your data: */}
        We value your privacy. For more information on how we handle your data,
        please refer to our <Link href="#" className="dark"> Privacy Policy</Link>.
      </p>
      <p className="f-15">
        {/* *Here are some additional details regarding your data: */}
        Your progress is saved automatically, so you can come back and finish
        the form anytime.
      </p>
      <h3 className="f-18 fw-500 mb-2">Hello!</h3>

      <p className="f-15">
        We know that facing eviction and seeking compensation can be stressful
        and overwhelming. This form is designed to simplify the process of
        collecting the essential information needed to assess your compensation
        request. Most users complete this form in about 15 minutes.
      </p>

      <h3 className="f-18 fw-500 mb-2">Tips for Completing the Form:</h3>

      <ul className="legal-list ">
        <li>
          <span className="fw-500">Have your lease documents ready: </span>
          <span className="f-15">
            Providing accurate details is crucial for an accurate assessment.
          </span>
        </li>
        <li>
          <span className="fw-500">Take your time:</span>
          <span className="f-15">
            Your progress is saved automatically, so you can return to complete
            the form whenever you need.
          </span>
        </li>
      </ul>
      <div className="agree-btn mt-4 text-center">
        <Button
          variant="contained"
          className="client-btn"
          size="lg"
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
