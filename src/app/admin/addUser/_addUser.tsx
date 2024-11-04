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
import { Alert } from "@mui/material";
import { NumberField } from "@/components/Form/NumberField";
import { useRouter } from "next/navigation";
import {
  InputPhone,
  isValidMobile,
  isValidMobileMsg,
} from "@/components/Form/InputPhone";

type FormValues = {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  role: string;
};

const schema = z.object({
  firstName: z
    .string({ required_error: "ddfds" })
    .min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phoneNumber: z.custom(isValidMobile, isValidMobileMsg),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export default function AddUserComponent() {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, reset } = methods;
  const [loading, setLoading] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      values.role = "expert";
      await axios.post("/api/user/add", values);
      setValues({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
      });
      openSnackbar({
        message: "User created successfully!",
        type: "success",
      });
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
        <div className="col-12 new-phone mt-3">
          {/* <NumberField
            error={formState.errors["phoneNumber"]}
            label="Phone Number"
            name="phoneNumber"
            control={control}
          /> */}
          <InputPhone
            error={formState.errors["phoneNumber"]}
            label=""
            name="phoneNumber"
            control={control}
            variant="filled"
            className="bglight-ip phone"
          />
        </div>

        <div className="col-12 col-md-6 mt-4 text-right">
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            size="large"
          >
            <span>Create</span>
          </LoadingButton>
        </div>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </Form>
  );
}
