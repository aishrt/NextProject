"use client";

import React from "react";
import * as z from "zod";
import "../../../client/client.css";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import DateField from "@/components/Form/DateField";
import { useHookForm } from "@/hooks/useHookForm";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import bubble from "@/assets/bubble.png";
import { Button } from "@mui/material";
import Image from "next/image";
import SelectField from "@/components/Form/SelectField";

type FormValues = {
  employee: string;
  notoriety: string;
  situation: string;
  date: string;
  hours: string;
};

const options = [
  { label: "Clearance", value: "clear" },
  { label: "Not Defined", value: "define" },
];

const schema = z.object({
  employee: z.string().min(1, "Rent is required"),
  situation: z.string().min(1, "Situation is required"),
  date: z.string().min(1, "Date is required"),
  hours: z.string().min(1, "Type is required"),
});

export const BussinessDetail = () => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [show, setShow] = useState<boolean>(false);
  const [count, setCount] = useState(0); // Initialize count state variable with 0
  const [useClause, setClause] = useState(""); // Initialize count state variable with 0
  const [isActivity, setActivity] = useState<boolean>(false);
  const [variant, setVariant] = useState<string>("");

  const [loading, setLoading] = useState(false);

  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();
  const handleSubmit = (values: FormValues) => {
    setLoading(true);
  };

  const handleAddInput = () => {
    const newCount = count + 1; // Increment count
    setCount(newCount); // Update count state variable
    newCount === 1 ? setShow(true) : setActivity(true);
  };

  return (
    <div className="lease-form">
      <h3 className="f-18 bold mb-2">Get what you&apos;re owed! </h3>
      <h3 className="f-18 mb-2">
        Eviction Compensation Assessment Form: Get the Compensation You Deserve!
      </h3>
      <div>
        <p className="f-14 gray">
          This form helps you get a preliminary estimate of the eviction
          compensation you may be entitled to. Answer the questions as
          accurately as possible. Tooltips (?) are available for guidance.
        </p>
        <p className="f-14 gray mb-2">Section 5: Business Details</p>
      </div>
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-3">
          <div className="col-12 col-md-6 mb-3">
            <h6 className="f-16 bold">Business History</h6>

            <div className="mb-3 lease-input">
              <label>Notoriety</label>
              <SelectField
                options={options}
                label=""
                name="notoriety"
                className="bglight-select"
                error={formState.errors["notoriety"]}
                control={control}
              />
            </div>
          </div>
        </div>

        {show && (
          <div>
            <h3 className="f-18 bold my-4 gray">Business Details</h3>
            <div className="row">
              <div className="col-12 col-md-6">
                <div className="mb-3 lease-input">
                  <label>Number of employees</label>
                  <InputField
                    error={formState.errors["employee"]}
                    label="Number of employees"
                    name="employee"
                    variant="filled"
                    className="bglight-ip"
                    control={control}
                  />
                </div>
                <div className="mb-3">
                  <label className=" relative">Opening hours</label>
                  <SelectField
                    options={options}
                    label=""
                    name="hours"
                    className="bglight-select"
                    error={formState.errors["hours"]}
                    control={control}
                  />
                </div>
                <div className="mb-3">
                  <label className="relative">
                    Current Financial Situation
                  </label>
                  <SelectField
                    options={options}
                    label=""
                    name="situation"
                  
                    className="bglight-select"
                    error={formState.errors["situation"]}
                    control={control}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {count == 1 ? (
          <div className="col-12 text-center mt-4">
            <Button className="" variant="contained" size="large">
              Submit
            </Button>
          </div>
        ) : (
          <div className="col-12 col-md-7">
            <Button
              className="w-100"
              variant="contained"
              size="large"
              onClick={() => handleAddInput()}
            >
              Next
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
};
