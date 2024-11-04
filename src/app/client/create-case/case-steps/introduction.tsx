"use client";

import { Button } from "@/components/Form/Button";
import { progress } from "framer-motion";
import { Dispatch, SetStateAction } from "react";
import team from "@/assets/team.png";
import Image from "next/image";

// interface
interface IProps {
  handleChange: Function;
  setProgressValue: Dispatch<SetStateAction<number>>;
}

export default function Introduction(props: IProps) {
  // Destructuring the props object
  const { handleChange, setProgressValue } = props;

  // set progess value & return update function
  const handleNextStep = () => {
    setProgressValue(20);
    return handleChange({ progress: 20, nextProgress: 20 });
  };

  return (
    <div className="first-step white-card rounded-lg p-5">
      <div className="row align-items-center">
        <div className="col-12 col-md-7">
          <h3 className="f-26  pb-2 fw-400">
            Resolve Your Dispute & Get Your Legal Fees Covered
          </h3>
          <p className="f-14">
            {/* Step {activeStep + 1} */}
            Get a fair and quick solution to your dispute. Our experts will
            assess your case and determine if your legal costs can be covered.
          </p>
          <div className="step-btns d-flex gap-3">
            <Button
              variant="contained"
              className="client-btn"
              size="md"
              onClick={() => handleNextStep()}
            >
              Get Started
            </Button>
          </div>
        </div>
        <div className="col-12 col-md-5">
          <div className="text-center team-img">
            <Image src={team} className="teams-icon" alt="" />
          </div>
        </div>
      </div>

      {/* <p className="f-20 semi-bold">
                Start with a free case evaluation.
            </p> */}
    </div>
  );
}
