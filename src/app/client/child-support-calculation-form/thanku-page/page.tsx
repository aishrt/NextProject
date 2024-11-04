"use client";

import React from "react";
import "../../../client/client.css";

export default function ThankuStep() {
  return (
    <div className="consclusrion mt-4 white-card p-4 rounded">
      <h3 className="f-22 bold mb-4">Conclusion</h3>
      <h4 className="f-18 bold">Thank you </h4>
      <p className="f-14 gray">
        Your claim has been successfully submitted. You are not alone in this.
        We are here to help you navigate through this challenging situation.
        Let&apos;s work together to find the best solution for you. A legal
        professional will review your information and contact you within two
        business days to discuss your options and next steps.
      </p>

      <p className="f-14 gray">
        <span className="bold f-14">Please note: </span> This form is not a
        substitute for legal advice. We strongly recommend consulting an
        attorney to confirm your eligibility and guide you through the formal
        legal process. As part of our claim assessment, we will connect you with
        qualified attorneys who can support you in your legal journey. If you
        wish, Indemnisez Moi can cover legal fees through a litigation funding
        agreement.
      </p>
    </div>
  );
}
