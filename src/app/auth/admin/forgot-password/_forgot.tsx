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
import emails from "@/assets/emial.png";
import Image from "next/image";

type FormValues = {
  email: string;
};

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

export default function ForgotComponent() {
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, reset } = methods;
  const [loading, setLoading] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const response = await axios.post(
        "/api/auth/forgot-password?role=admin",
        values
      );
      setValues({
        email: "",
      });
      if (!response) {
        throw new Error("There was an error sending the reset password email.");
      }
      openSnackbar({ message: response.data.message, type: "success" });
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to send reset password email.";
      openSnackbar({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      email: "",
    });
  }, []);

  return (
    <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
      <div className="row mt-3">
        <div className="col-12 col-md-12 mt-3">
          <InputField
            error={formState.errors["email"]}
            label="Email"
            name="email"
            startIcon={<Image src={emails} alt="" />}
            className="input-fill"
            placeholder="Email"
            control={control}
          />
        </div>

        <div className="col-12 col-md-12 mt-4 text-center">
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            className="w-100 login-btn"
            size="large"
          >
            <span>Reset Password</span>
          </LoadingButton>
        </div>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </Form>
  );
}
