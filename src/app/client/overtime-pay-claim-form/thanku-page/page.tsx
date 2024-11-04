"use client";

import React from "react";
import "../../../client/client.css";

export default function ThankuStep() {
  return (
    <div className="lease-form white-card mt-4 rounded p-4">
      <h3 className="f-22 bold mb-4">Conclusion</h3>
      <p className="f-14 gray">
        Thank you for completing this form. Your claim has been successfully
        submitted. A legal professional will review your information and contact
        you within two business days to discuss your options and next steps.
      </p>

      <p className="f-14 gray">
        <span className="bold f-14">Please note: </span>This form is not a
        substitute for legal advice. We strongly recommend consulting an
        attorney to confirm your eligibility and guide you through the formal
        legal process.
      </p>
    </div>
  );
}
