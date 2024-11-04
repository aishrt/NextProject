"use client";

import { useHookForm } from "@/hooks/useHookForm";
import * as z from "zod";
import Form from "@/components/Form/Form";
import { PasswordField } from "@/components/Form/PasswordField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import axios from "axios";
import lock from "@/assets/lock.png";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert, Checkbox, FormControlLabel } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import Typography from "@mui/material/Typography";
import Link from "next/link";
import Image from "next/image";
import { InputField } from "@/components/Form/InputField";

type FormValues = {
  password: string;
  confirmPassword: string;
};

const schema = z
  .object({
    password: z
      .string({ required_error: "Password is Required" })
      .min(1, "Password is Required")
      .min(8, "Password must be atleast 8 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
        "Password should be a combination of uppercase alphabets, numbers and special characters"
      ),

    confirmPassword: z.string().min(1, "Please confirm the password"),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export default function ResetComponent() {
  const searchParams = useSearchParams();
  const params = searchParams?.get("email");
  const role = searchParams?.get("role");

  const router = useRouter();

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control, reset } = methods;
  const [loading, setLoading] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      const response = await axios.post(
        `/api/auth/reset-password?email=${params}&role=${role}`,
        values
      );
      setValues({
        password: "",
        confirmPassword: "",
      });
      if (!response) {
        throw new Error("There was an error while resetting the password.");
      }
      openSnackbar({ message: response.data.message, type: "success" });
      router.push(`/auth/${role}/login`);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to reset the password.";
      openSnackbar({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setValues({
      password: "",
      confirmPassword: "",
    });
  }, []);

  return (
    <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
      <div className="row mt-3">
        <div className="col-12 col-md-12 mt-3">
          {/* <label className="">Password</label> */}
          {/* <PasswordField
            error={formState.errors["password"]}
            label=""
            name="password"
            placeholder="Password"
            className="input-fill"
            control={control}
          /> */}
          <InputField
            error={formState.errors["password"]}
            label=""
            type="password"
            name="password"
            placeholder="Password"
            startIcon={<Image src={lock} alt="" />}
            className="input-fill"
            control={control}
          />
        </div>

        <div className="col-12 col-md-12 mt-3">
          {/* <label className="">Confirm Password</label> */}

          {/* <PasswordField
            error={formState.errors["confirmPassword"]}
            label=""
            name="confirmPassword"
            placeholder="Confirm Password"
            className="input-fill"
            control={control}
          /> */}
          <InputField
            error={formState.errors["confirmPassword"]}
            label=""
            type="password"
            startIcon={<Image src={lock} alt="" />}
            name="confirmPassword"
            placeholder="Confirm Password"
            className="input-fill"
            control={control}
          />
        </div>

        <div className="col-12 col-md-12 mt-4 text-center">
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            size="large"
          >
            <span>Submit</span>
          </LoadingButton>
        </div>
        {/* {role !== "admin" && (
          <Typography className="mt-3 f-13" textAlign="center">
            No Account yet?
            <Link href={`/auth/${role}/register`} className="f-13 dark bold">
              SIGN UP
            </Link>
          </Typography>
        )} */}
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </Form>
  );
}
