"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import { Link } from "@mui/material";

export default function Privacy({ handleNext }: any) {
  return (
    <div className="child-support white-card rounded p-4 mt-4">
      <div className="lease-step-privacy">
        <p className="f-14 gray my-2">
          Your privacy is important to us. Please see our{" "}
          <Link href="#" className="bold">
            [Privacy Policy]
          </Link>{" "}
          for more information on how we handle your data.
        </p>

        <p className="f-14 gray">
          <span className="bold">Need help? </span>Click the &quot;Help&quot; button to
          ask a question or request a callback from our team. We&apos;re here to
          assist you!{" "}
        </p>

        <p className="f-14 gray pb-2">
          <span className="bold"> Your progress is saved automatically. </span>
          You can come back and finish this later.
        </p>
        <hr />
        <h2 className="f-18 bold mb-2">Welcome!</h2>

        <p className="f-14 gray">
          We understand that navigating family financial matters can be complex.
          We&apos;re here to guide you through the process, making it as simple
          and straightforward as possible.
        </p>
        <p className="f-14 gray">
          This form will focus on <span className="bold">child support.</span>{" "}
          If you are also interested in seeking spousal support (alimony),
          you&apos;ll have the option to do so at the end of this form. This
          ensures that all your requests are handled together, streamlining our
          assessment and providing you with comprehensive support.
        </p>
        <p className="f-14 gray">
          Let&apos;s begin with your child support assessment.
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
    </div>
  );
}
