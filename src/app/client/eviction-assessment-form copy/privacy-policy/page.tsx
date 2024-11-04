"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";

export default function PrivacyPolicy() {
  const router = useRouter();
  return (
    <ContentWrapper>
      <div className="lease-privacy white-card">
        <h3 className="f-18 bold gray mb-2">
          <span className="bold"> Data Privacy Notice</span> 🔒 We take your
          privacy seriously. The information you provide in this form will be
          used solely to estimate the eviction compensation you may be entitled
          to. Your data will be stored securely and only accessed by authorized
          personnel. We will not share your information with any third party
          without your consent.
        </h3>
        <p className="f-18 gray">
          *Here are some additional details regarding your data:
        </p>
        <ul className="legal-list gray">
          <li>
            <span className="bold">Data Retention:</span>We will retain your
            data for a limited time, as required by law or for legitimate
            business purposes (e.g., improving our assessment tool)
          </li>
          <li>
            <span className="bold">Your Rights:</span> You have the right to
            access, rectify, or erase your data at any time. You can also
            request to restrict the processing of your data or object to its
            processing entirely. *
          </li>
          <li>
            For more information about your data privacy rights, please refer to
            our Privacy Policy: [link to your privacy policy].
          </li>
        </ul>
        <div className="agree-btn mt-4 text-center">
          <Button
            type="submit"
            variant="contained"
            className="green-btn"
            size="lg"
            onClick={() => router.push("/client/eviction-assessment-form")}
          >
            Agree
          </Button>
        </div>
      </div>
    </ContentWrapper>
  );
}
