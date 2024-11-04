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

export default function Privacy({
  handleNext,
  err,
  handleChange,
  subject,
}: any) {
  const router = useRouter();

  // const [subject, setValue] = React.useState("");
  // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setValue((event.target as HTMLInputElement).value);
  // };
  return (
    <ContentWrapper>
      <div className="lease-privacy white-card p-4 mt-4 rounded">
        <h2 className="f-22 bold mb-2">WELCOME !</h2>
        <p className="f-14 gray">
          Your privacy is important to us. Please see our{" "}
          <Link href="/" className="bold">
            {" "}
            Privacy Policy.
          </Link>{" "}
          for more information on how we handle your data.
        </p>
        <p className="f-14 gray">
          <strong>Need help? </strong>Click the &quot;Help&quot; button to ask a question
          or request a callback from our team. We&apos;re here to assist you!
        </p>
        <p className="f-14 gray">
          <strong>Your progress is saved automatically. </strong>You can come
          back and finish this later.
        </p>
        <h2 className="f-22 bold mb-2">Hi there!</h2>
        <p className="f-14 gray">
          We understand that non-compete clauses can be complex. This form
          streamlines the process of gathering essential information to assess
          your situation. Most users complete it in about 10 minutes. Please
          select whether you are you are an employer seeking to enforce a
          non-compete clause or an employee who is subject to one.
        </p>
        <div className="radio-btns  pb-4">
          <FormControl className="w-100">
            <RadioGroup
              className="w-100"
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={subject}
              onChange={handleChange}
            >
              <FormControlLabel
                className="radio-light-ip"
                value="employer"
                control={<Radio />}
                label="Employer (An employer seeking to enforce a non-compete clause)"
              />
              <FormControlLabel
                className="radio-light-ip"
                value="employee"
                control={<Radio />}
                label="Employee (An employee who is subject to a non-compete clause)"
              />
            </RadioGroup>

            {err && (
              <span className="text-danger">
                Please select whether who you are{" "}
              </span>
            )}
          </FormControl>
        </div>
        {/* <p className="f-14 gray mb-1">
          • An employer seeking to enforce a non-compete clause:
        </p>
        <p className="f-14 gray mb-1">
          • An employee who is subject to a non-compete clause:
        </p> */}
        
      </div>
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
    </ContentWrapper>
  );
}
