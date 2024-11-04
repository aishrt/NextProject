"use client";
import React from "react";
import "../../../client/client.css";
import { useRouter } from "next/navigation";

export default function ThankYou() {
  const router = useRouter();
  return (

      <div className="lease-privacy white-card p-4 rounded mt-4">
      <h6 className="f-26  fw-400 pb-3">Submission Message</h6>
        <p className="f-14  pb-4">
          Thank You! Your information has been recorded. We&apos;ll review your
          submission and contact you if we need additional details.
        </p>
      </div>

  );
}
