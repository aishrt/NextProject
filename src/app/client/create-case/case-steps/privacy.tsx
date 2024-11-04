"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import team from "@/assets/data.png";
import Link from "next/link";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";

// interface
interface IProps {
  handleChange: Function;
  setProgressValue: Dispatch<SetStateAction<number>>;
}

export default function Privacy(props: IProps) {
  // Destructuring the props object
  const { handleChange, setProgressValue } = props;
  const router = useRouter();

  const searchParams = useSearchParams();
  const caseId = searchParams?.get("caseId");

  const [loading, setLoading] = useState(false);
  const handleNext = (resumeLater = "") => {
    setProgressValue(30);
    return handleChange({
      progress: 30,
      nextProgress: 30,
      resumeLater: resumeLater,
    });
  };
  const handlePrevious = async () => {
    try {
      setLoading(true);
      const caseData = await axios.post("/api/client/case/add-case", {
        progress: 10,
        caseId: caseId,
      });
      router.push(`/client/create-case?progress=10&caseId=${caseId}`);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };
  return (
    <>
      {/* {loading ? (
        <div className="text-center mt-5"> <CircularProgress /> </div>
      ) : ( */}
      <div className="first-step white-card rounded-lg p-5">
        <div className="row align-items-center">
          <div className="col-12 col-md-7">
            <h3 className="f-26 fw-400 pb-2">We Protect Your Privacy</h3>
            {/* <p className="f-20 semi-bold">Start with a free case evaluation.</p> */}
            <p className="f-14">
              Your privacy is our top priority. All information you share with
              us is kept strictly confidential and used solely for the
              evaluation of your case. We employ robust security measures to
              protect your data and never share it without your explicit
              consent.
              {/* <ul className="privacy-listing">
          <li>
            <Image src={check} alt="op" />
            We take your privacy seriously.
          </li>
          <li>
            <Image src={check} alt="op" />
            Your data is used solely for case evaluation.
          </li>
          <li>
            <Image src={check} alt="op" />
            Your information is stored securely.
          </li>
          <li>
            <Image src={check} alt="op" />
            We never share your data without consent.
          </li>
        </ul> */}
            </p>
            <div className="privacy-link mb-4">
              <p className="f-14">
                To learn more about our commitment to safeguarding your privacy,
                please review our comprehensive Privacy Policy
              </p>
              <Link
                href="/client/privacy-policy"
                className="text-decoration-underline dark"
              >
                <span className="f-14 semi-bold dark">
                  View our Full Privacy Policy
                </span>
              </Link>
            </div>
            <div className="step-btns d-flex gap-3">
              <Button
                variant="contained"
                className="client-btn"
                onClick={() => {
                  handleNext();
                }}
              >
                Next{" "}
              </Button>
              <Button
                variant="outlined"
                className="border-0 text-black text-decoration-underline"
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  //handleSaveLater();
                  // handleNext("resumeLater");
                  handlePrevious();
                }}
              >
                Previous
              </Button>
              {/* <Button
          variant="outlined"
          className="green-border"
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            //handleSaveLater();
            handleNext("resumeLater");
          }}
        >
          Save and resume later
        </Button> */}
            </div>
          </div>
          <div className="col-12 col-md-5">
            <div className="text-center team-img">
              <Image src={team} className="teams-icon" alt="" />
            </div>
          </div>
        </div>
      </div>
      {/* )} */}
    </>
  );
}
