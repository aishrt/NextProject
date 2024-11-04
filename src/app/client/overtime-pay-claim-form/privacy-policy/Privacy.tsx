"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import { Link } from "@mui/material";

export default function Privacy({ handleNext }: any) {
  return (
    <ContentWrapper>
      <div className="lease-privacy white-card">
        <h2 className="f-18 bold pb-2">Instructions</h2>
        <p className="f-14 gray mb-2">
          Your privacy is important to us. Please see our{" "}
          <Link href="#" className="bold">
            [Privacy Policy]{" "}
          </Link>{" "}
          for more information on how we handle your data.
        </p>
        <p className="f-14 gray pb-4">
          Your progress is automatically saved as a draft. You can return to
          your drafts later to complete the form.
        </p>
        <h2 className="f-18 bold mb-2">Welcome!</h2>

        <p className="f-14 gray">
          Thank you for choosing our platform to assess your overtime pay claim.
          Please fill out this form to initiate the evaluation process.
        </p>
      </div>
      <div className="agree-btn mt-4 text-center">
        <Button
          variant="contained"
          className="client-btn"
          size="lg"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </ContentWrapper>
  );
}
