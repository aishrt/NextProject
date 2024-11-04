"use client";
import * as z from "zod";
import Form from "@/components/Form/Form";
import { useHookForm } from "@/hooks/useHookForm";
import { InputField } from "@/components/Form/InputField";
import React from "react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import DateField from "@/components/Form/DateField";

type FormValues = {
  firstName: string;
  lastName: string;
  date: string;
};
const schema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  date: z.string().min(1, "Date is required"),
});

export const Filters = () => {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  //   const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();
  const handleSubmit = (values: FormValues) => {
    setLoading(true);
  };
  return (
    <div className="minors-form">
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="invoice-filters mt-3 d-flex gap-2">
          <div className="filter-col dateinput mb-4">
            <DateField
              error={formState.errors["date"]}
              label="Date"
              name="date"
              className="bglight-ip"
              variant="filled"
              control={control}
            />
          </div>
          {/* <div className="filter-col">
            <InputField
              error={formState.errors["firstName"]}
              label="First Name"
              name="firstName"
              control={control}
            />
          </div>
          <div className="filter-col">
            <InputField
              error={formState.errors["lastName"]}
              label="Last Name"
              name="lastName"
              control={control}
            />
          </div> */}
        </div>
      </Form>
    </div>
  );
};
