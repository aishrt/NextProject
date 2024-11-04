"use client";

import { useHookForm } from "@/hooks/useHookForm";
import * as z from "zod";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert, Checkbox, FormControlLabel } from "@mui/material";
import { PasswordField } from "@/components/Form/PasswordField";
import { NumberField } from "@/components/Form/NumberField";
import { useRouter } from "next/navigation";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

type FormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  password: string;
  confirm_password: string;
};

const schema = z
  .object({
    firstName: z
      .string({ required_error: "ddfds" })
      .min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    phoneNumber: z
      .number({ invalid_type_error: "Phone number is required" })
      .min(1, "Phone number is required"),

    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address"),

    password: z
      .string({ required_error: "Password is Required" })
      .min(1, "Password is Required")
      .min(8, "Password must be atleast 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
        "Password should be a combination of uppercase alphabets, numbers and special characters"
      ),

    confirm_password: z.string().min(1, "Confirm Password is Required"),
  })
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        path: ["confirm_password"],
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export default function LoginComponent() {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, reset } = methods;
  const [loading, setLoading] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();
  const [value, setValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      await axios.post("/api/auth/register", values);
      setValues({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirm_password: "",
      });
      openSnackbar({ message: "User created successfully!", type: "success" });
      router.push("/auth/login");
    } catch (error: any) {
      const msg = error?.response?.data?.message || error.message;
      openSnackbar({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirm_password: "",
    });
  }, []);

  return (
    <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
      <div className="row mt-3">
        <div className="col-12 col-md-6 mt-3">
          <InputField
            error={formState.errors["firstName"]}
            label="First Name"
            name="firstName"
            control={control}
          />
        </div>
        <div className="col-12 col-md-6 mt-3">
          <InputField
            error={formState.errors["lastName"]}
            label="Last Name"
            name="lastName"
            control={control}
          />
        </div>
        <div className="col-12 mt-3">
          <InputField
            error={formState.errors["email"]}
            label="Email"
            name="email"
            control={control}
          />
        </div>
        <div className="col-12 mt-3">
          <NumberField
            error={formState.errors["phoneNumber"]}
            label="Phone Number"
            name="phoneNumber"
            control={control}
          />
        </div>
        <div className="col-12 col-md-6 mt-4">
          <PasswordField
            error={formState.errors["password"]}
            label="Password"
            name="password"
            control={control}
          />
        </div>
        <div className="col-12 col-md-6 mt-4">
          <PasswordField
            error={formState.errors["confirm_password"]}
            label="Re-enter Password"
            name="confirm_password"
            control={control}
          />
        </div>

        <div className="col-12 col-md-12 mt-4">
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Role</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={value}
              onChange={handleChange}
            >
              <FormControlLabel
                value="client"
                control={<Radio />}
                label="Client"
              />
              <FormControlLabel
                value="expert"
                control={<Radio />}
                label="Legal Expert"
              />
            </RadioGroup>
          </FormControl>
        </div>

        <div className="col-12 col-md-6 mt-4">
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Remember me"
          />
        </div>
        <div className="col-12 col-md-6 mt-4 text-right">
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            size="large"
          >
            <span>Sign Up</span>
          </LoadingButton>
        </div>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </Form>
  );
}
