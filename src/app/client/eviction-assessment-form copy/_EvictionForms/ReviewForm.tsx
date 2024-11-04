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
  advantage: string;
  time: string;
  nature: string;
  inventory: string;
  rent: string;
  valuation: string;
  improvement: string;
};

const options = [
  { label: "Clearance", value: "clear" },
  { label: "Not Defined", value: "define" },
];

const schema = z.object({
  advantage: z.string().min(1, "This is required"),
  time: z.string().min(1, "This is required"),
  nature: z.string().min(1, "This is required"),
  inventory: z.string().min(1, "This is required"),
  rent: z.string().min(1, "This is required"),
  valuation: z.string().min(1, "This is required"),
  improvement: z.string().min(1, "This is required"),
});

export const ReviewForm = () => {
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
      </div>

      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row mt-5">
          <div className="col-12 col-md-6 mb-3">
            <h6 className="f-16 bold">
              Section 7: Business Environment & Characteristics
            </h6>
            <div className="mb-3 lease-input">
              <label>Miscellaneous Advantages</label>
              <SelectField
                options={options}
                label=""
                name="advantage"
                className="bglight-select"
                error={formState.errors["advantage"]}
                control={control}
              />
            </div>
            <div className="mb-3 lease-input">
              <label>Weekly Opening Range</label>
              <SelectField
                options={options}
                label=""
                variant="filled"
                className="bglight-select"
                name="time"
                error={formState.errors["time"]}
                control={control}
              />
            </div>
            <div className="mb-3 lease-input">
              <label>Nature of Clientele Reception</label>
              <SelectField
                options={options}
                label=""
                name="nature"
                className="bglight-select"
                error={formState.errors["nature"]}
                control={control}
              />
            </div>
            <div className="mb-3 lease-input">
              <label>Nature of Inventory</label>
              <SelectField
                options={options}
                label=""
                name="inventory"
                className="bglight-select"
                error={formState.errors["inventory"]}
                control={control}
              />
            </div>

            <h6 className="f-16 bold mt-5">Section 8: Business Valuation</h6>
            <div className="mb-3 lease-input">
              <label>Preferred Valuation Method(s)</label>
              <SelectField
                options={options}
                label=""
                name="valuation"
                className="bglight-select"
                error={formState.errors["valuation"]}
                control={control}
              />
            </div>

            <div className="mb-3 lease-input">
              <label>Market Rental Value (Expert)</label>
              <InputField
                error={formState.errors["rent"]}
                label="Market Rental Value (Expert)"
                name="rent"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
            <div className="mb-3 lease-input">
              <label>Potential Renewal Rental Value </label>
              <InputField
                error={formState.errors["rent"]}
                label="Potential Renewal Rental Value "
                name="rent"
                variant="filled"
                className="bglight-ip"
                control={control}
              />
            </div>
            <div className="mb-3 lease-input">
              <label>Improvements Made </label>
              <SelectField
                options={options}
                label=""
                name="improvement"
                className="bglight-select"
                error={formState.errors["improvement"]}
                control={control}
              />
            </div>
          </div>
        </div>

        {count == 0 ? (
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
