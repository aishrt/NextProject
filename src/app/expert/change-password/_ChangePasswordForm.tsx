"use client";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import { useHookForm } from "@/hooks/useHookForm";
import React, { useRef, useState } from "react";
import { z } from "zod";
import "../../expert/expert.css";
import { useRouter } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";
import { useSession } from "next-auth/react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert } from "@mui/material";

type FormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const schema = z
  .object({
    currentPassword: ((msg) => z.string({ required_error: msg }).min(1, msg))(
      "Please enter the current password"
    ),
    newPassword: z
      .string({ required_error: "Please enter the new password" })
      .min(1, "Please enter the new password")
      .min(8, "Password must be atleast 8 characters")
      .regex(
        // /^.*(?=.{3,})(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\d\x])(?=.*[!@$#%]).*$/,
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&_])[A-Za-z\d@$!%*?&_]{8,}$/,
        "Password should be a combination of uppercase alphabets, numbers and special characters"
      ),
    confirmPassword: z
      .string({ required_error: "Please confirm the password" })
      .min(1, "Please confirm the password"),
  })
  .superRefine(({ confirmPassword, newPassword }, ctx) => {
    if (confirmPassword !== newPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export const ChangePasswordForm = () => {
  const { data } = useSession();
  const userId = data?.user?._id;
  console.log(userId);

  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  const handleSubmit = async (values: FormValues) => {
    try {
      setLoading(true);
      if (userId) {
        const response = await axios.post(
          `/api/auth/change-password?id=${userId}&role=expert`,
          values
        );
        console.log(response);
        setValues({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        if (!response) {
          throw new Error("There was an error while changing the password.");
        }
        openSnackbar({ message: response.data.message, type: "success" });
      }
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

  return (
    <div
      className="change-upload p-4 rounded-lg"
      style={{ background: "#E0EDFA" }}
    >
      <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
        <div className="div docs-update ml-5">
          <div className="row">
            <div className="col-12 mb-4">
              <div className="change-pass-exp">
                <InputField
                  type="password"
                  className="input-fill"
                  placeholder="Password"
                  error={formState.errors["currentPassword"]}
                  label="Current Password"
                  name="currentPassword"
                  control={control}
                />
              </div>
            </div>
            <div className="col-12 mb-4">
              <div className="change-pass-exp relative">
                <InputField
                  type="password"
                  className="input-fill"
                  placeholder="Password"
                  error={formState.errors["newPassword"]}
                  label="New Password"
                  name="newPassword"
                  control={control}
                />
                {/* <p className="f-12 mb-0 text-end">Your Alternate Password must be more than 8  characters</p> */}
              </div>
            </div>
            <div className="col-12 mb-4">
              <div className="change-pass-exp">
                <InputField
                  type="password"
                  className="input-fill"
                  placeholder="Password"
                  error={formState.errors["confirmPassword"]}
                  label="Confirm New Password"
                  name="confirmPassword"
                  control={control}
                />
              </div>
            </div>
          </div>
          <div className="col-12 col-md-12 mt-4 text-right">
            <LoadingButton
              loading={loading}
              variant="contained"
              type="submit"
              className="expert-btn"
              size="large"
            >
              <span>Submit</span>
            </LoadingButton>
          </div>
        </div>
        <Snackbar {...snackProps}>
          <Alert {...alertProps} />
        </Snackbar>
      </Form>
    </div>
  );
};
