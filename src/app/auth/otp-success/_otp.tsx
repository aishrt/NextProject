"use client";

import { useHookForm } from "@/hooks/useHookForm";
import * as z from "zod";
import Form from "@/components/Form/Form";
import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert, Checkbox, FormControlLabel } from "@mui/material";
import google from "@/assets/google.png";
import twitt from "@/assets/twitter.png";
import facebook from "@/assets/facebook.png";
import apple from "@/assets/apple.png";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function OtpComponent() {
  const router = useRouter();
  const params = useSearchParams();
  const role = params?.get("role");
  console.log(role);

  const [loading, setLoading] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook

  return (
    <>
      <div className="row mt-3">
        <div className="col-12 col-md-12 mt-4 text-center">
          <LoadingButton
            loading={loading}
            variant="contained"
            className="w-100 login-btn"
            size="large"
            onClick={() => {
              setLoading(true);
              router.push(`/auth/${role}/login`);
              setLoading(false);
            }}
          >
            <span>Back to Login</span>
          </LoadingButton>
        </div>
      </div>

      <div className="relative mt-5">
        <p className="relative login-or  mb-0 text-center">
          <span className="f-14 semi-bold">Or Continue With</span>
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
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </>
  );
}
