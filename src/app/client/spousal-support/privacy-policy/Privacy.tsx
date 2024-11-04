"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import { Link } from "@mui/material";

export default function Privacy({ handleNext }: any) {
  return (
    <ContentWrapper>
      <div className="lease-step-privacy">
        <h3 className="f-22 bold mt-4 pb-3 gray">Welcome</h3>
        <p className="f-14 gray mb-2">
          Your privacy is important to us. Please see our
          <Link href="#" className="bold">
            [Privacy Policy]
          </Link>{" "}
          for more information on how we handle your data.
        </p>

        <p className="f-14 gray mt-4">
          <span className="bold">Need help? </span> Click the &quot;Help&quot; button to
          ask a question or request a callback from our team. We&apos;re here to
          assist you!
        </p>

        <p className="f-14 gray pb-4">
          <span className="bold"> Your progress is saved automatically. </span>
          You can come back and finish this later.
        </p>
        {/* <h2 className="f-18 bold mb-2">Hi there!</h2> */}

        {/* <p className="f-14 gray">
          We understand that navigating spousal support (alimony) can be a
          complex and emotional process. This form is designed to guide you
          through the necessary information step by step, making it as clear and
          straightforward as possible.
        </p> */}
        {/* <p className="f-14 gray">
          If you are also interested in requesting child support, you will have
          the opportunity to do so at the end of this form. This ensures that
          all your requests are handled together, streamlining our assessment
          and providing you with comprehensive support.
        </p> */}
        {/* <p className="f-14 gray">
          Let&apos;s begin with your spousal support assessment.
        </p> */}
      </div>
      <div className="agree-btn mt-4 text-center">
        <Button
          variant="contained"
          className="green-btn"
          size="lg"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    </ContentWrapper>
  );
}
