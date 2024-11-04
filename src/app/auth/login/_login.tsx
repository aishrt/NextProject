"use client";

import { useHookForm } from "@/hooks/useHookForm";
import * as z from "zod";
import Link from "next/link";
import Form from "@/components/Form/Form";
import { InputField } from "@/components/Form/InputField";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { ErrorMessage } from "@/constants/errors";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert, Checkbox, FormControlLabel, Snackbar } from "@mui/material";
import { useRouter } from "next/navigation";
import emails from "@/assets/emial.png";
import pass from "@/assets/lock.png";
import google from "@/assets/google.png";
import twitt from "@/assets/twitter.png";
import facebook from "@/assets/facebook.png";
import apple from "@/assets/apple.png";
import { PasswordField } from "@/components/Form/PasswordField";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import axios from "axios";
import { User } from "@/types/User";

type FormValues = {
  email: string;
  password: string;
};

const schema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z.string().min(1, "Password is required"),
});
14;
export default function LoginComponent({ role = "client" }: { role?: string }) {
  console.log(role);
  const session = useSession();
  const { methods, setValues } = useHookForm<FormValues, typeof schema>(schema);
  const { formState, control } = methods;
  const [checkUser, setCheckUser] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [isEmail, setIsEmail] = useState<boolean>();
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const router = useRouter();

  const getUser = async (email: string) => {
    // try {
    const user = await axios.get(
      `/api/auth/user/getUser?email=${email}&role=${role}`
    );

    if (!user) {
      throw new Error("There was an error");
    }
    setCheckUser(user)
    console.log(user);
    return user;
    // } catch (error: any) {
    //   const msg =
    //     error?.response?.data?.message ||
    //     error.message ||
    //     "Failed to resend otp.";
    //   openSnackbar({ message: msg, type: "error" });
    //   //setLoading(false);
    // }
  };

  const handleSubmit = async (values: FormValues) => {
    console.log(values);
    setLoading(true);
    try {
      const user = await getUser(values.email);
      console.log(user);

      const isEmail = user?.data?.data?.isEmailVerified;
      if (role !== "admin" && isEmail == false) {
        openSnackbar({
          message:
            "Please verify your account first. Email sent to your email address for verification. ",
          type: "success",
        }),
          // setTimeout(() => {
          router.push(
            `/auth/otp-verification?email=${values.email}&role=${role}`
          );
        //  }, 3000);
      } else {
        signIn("credentials", {
          username: values.email,
          password: values.password,
          role: role,
          redirect: false,
        }).then((response) => {
          if (response) {
            if (!response.ok && response.error) {
              const msg = ErrorMessage[response.error] ?? response.error;
              openSnackbar({
                type: "error",
                message: msg,
              });
            } else {
              role === "client"
                ? router.push("/client/dashboard")
                : role === "admin"
                ? router.push("/admin/dashboard")
                : role === "expert"
                ? router.push("/expert/dashboard")
                :( role === "lawyer" && checkUser?.docStatus !== 'accepted')
                ? router.push("/auth/lawyer/document-upload")
                :( role === "lawyer" && checkUser?.docStatus === 'accepted')
                ? router.push("/lawyer/dashboard")
                : router.push("/");
              // role === "user"
              //   ? router.push("/")
              //   : router.push("/client/dashboard");
            }
          }
        });
      }

      setLoading(false);
    } catch (error: any) {
      console.log("err", error);

      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to resend otp.";
      openSnackbar({ message: msg, type: "error" });

      setLoading(false);
    }
  };

  useEffect(() => {
    setIsEmail(session?.data?.user?.isEmailVerified);
  }, [session]);
  console.log(session?.data?.user?.isEmailVerified, "sessionn");

  useEffect(() => {
    setValues({
      email: "",
      password: "",
    });
  }, []);

  return (
    <Form<FormValues> onSubmit={handleSubmit} methods={methods}>
      <div className="row mt-3 ml-5">
        <div className="col-12">
          <InputField
            className="input-fill"
            startIcon={<Image src={emails} alt="" />}
            error={formState.errors["email"]}
            label="Email"
            placeholder="Email"
            name="email"
            control={control}
          />
        </div>
        <div className="col-12 mt-4">
          <InputField
            type="password"
            className="input-fill"
            startIcon={<Image src={pass} alt="" />}
            placeholder="Password"
            error={formState.errors["password"]}
            label="Password"
            name="password"
            control={control}
          />
        </div>
        <div className="col-12">
          <Typography className="mt-3" textAlign="right">
            <Link
              href={`/auth/${role}/forgot-password`}
              className="text-decoration-none dark text-black f-14"
            >
              Recover Password?
            </Link>
          </Typography>
        </div>

        <div className="col-12 mt-4">
          <LoadingButton
            loading={loading}
            variant="contained"
            type="submit"
            className="w-100 rounded-lg login-btn"
            size="large"
          >
            <span>Login</span>
          </LoadingButton>
        </div>
      </div>
      {role !== "admin" && (
        <>
          <div className="relative mt-5">
            <p className="relative login-or  mb-0 text-center">
              <span className="f-14 semi-bold">Or Login With</span>
            </p>
          </div>
          <ul className="login-social d-flex align-items-center gap-3 justify-content-center pt-4">
            <li>
              <Link href="#">
                <Image src={google} alt="" />
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src={twitt} alt="" />
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src={facebook} alt="" />
              </Link>
            </li>
            <li>
              <Link href="#">
                <Image src={apple} alt="" />
              </Link>
            </li>
          </ul>
        </>
      )}
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </Form>
  );
}
