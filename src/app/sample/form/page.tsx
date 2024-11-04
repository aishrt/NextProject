"use client";

import DateField from "@/components/Form/DateField";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { NumberField } from "@/components/Form/NumberField";
import { PasswordField } from "@/components/Form/PasswordField";
import SelectField from "@/components/Form/SelectField";
import { useHookForm } from "@/hooks/useHookForm";
import { Button } from "@mui/material";
import { useEffect } from "react";
import * as z from "zod";

const options = [
  { label: "Option 1", value: "option1" },
  { label: "Option 2", value: "option2" },
];
type FormValues = {
  string: string;
  password: string;
  number: number;
  select: string;
  date: string;
};
const schema = z.object({
  string: z.string().min(1, "This is required"),
  number: z.number({ required_error: "Please enter number" }).min(1, "Please enter at least one").max(10, "Maximum value can be 10"),
  password: z.string().min(1, "This is required"),
  select: z.string().min(1, "This is required"),
  date: z.string().min(1, "This is required"),
});

export default function Sample() {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;

  const handleSubmit = (values: FormValues) => {
  };

  useEffect(() => {
    setValues({
      string: "",
      password: "",
      select: "",
      date: "",
    });
  }, []);

  return (
    <div className="m-5">
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="row">
          <div className="col-4">
            <InputField
              error={formState.errors["string"]}
              label="String"
              name="string"
              control={control}
            />
          </div>
          <div className="col-4">
            <NumberField
              error={formState.errors["number"]}
              label="Number"
              name="number"
              control={control}
            />
          </div>
          <div className="col-4">
            <PasswordField
              error={formState.errors["password"]}
              label="Password"
              name="password"
              control={control}
            />
          </div>
          <div className="col-4 mt-4">
            <SelectField
              options={options}
              label="Select"
              name="select"
              error={formState.errors["select"]}
              control={control}
            />
          </div>
          <div className="col-4 mt-4">
            <DateField
              label="Date"
              name="date"
              error={formState.errors["date"]}
              control={control}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-4">
            <Button variant="contained" type="submit">
              Submit
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
