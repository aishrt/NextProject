"use client";

import LoadingButton from "@mui/lab/LoadingButton";
import { useEffect, useState } from "react";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import useSnackbar from "@/hooks/useSnackbar";
import { Alert, CircularProgress } from "@mui/material";
import OTPInput, { InputProps } from "react-otp-input";
import { Button } from "@/components/Form/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/types/User";

export default function OtpVerificationComponent() {
  const router = useRouter();

  const param = useSearchParams();
  const email = param?.get("email");
  const role = param?.get("role");

  const [loading, setLoading] = useState(false);
  const [otpLoad, setOtpLoad] = useState(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const [seconds, setSeconds] = useState(0);
  const [code, setCode] = useState<string>("");
  const [err, setErr] = useState(false);
  const [timer, setTimer] = useState("");
  const [userData, setUserData] = useState<User>();

  const handleVerify = async () => {
    try {
      setLoading(true);
      if (!code || code.length !== 4) {
        return setErr(true);
      }
      const response = await axios.post(
        `/api/auth/verify-otp?email=${email}&role=${role}`,
        {
          otp: code,
        }
      );
      if (!response) {
        throw new Error("There was an error sending the otp.");
      }
      openSnackbar({ message: response.data.message, type: "success" });

      router.push(`/auth/otp-success?role=${userData?.role ?? role}`);
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to verify otp.";
      openSnackbar({ message: msg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setOtpLoad(true);
      setCode("");
      const response = await axios.post(
        `/api/auth/resend-otp?email=${email}&role=${role}`
      );
      console.log(response?.status);

      if (response?.status == 200) {
        setSeconds(120);
      }

      if (!response) {
        throw new Error("There was an error sending the otp.");
      }
      openSnackbar({ message: response.data.message, type: "success" });
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        "Failed to resend otp.";
      openSnackbar({ message: msg, type: "error" });
    } finally {
      setOtpLoad(false);
    }
  };
  const renderCustomInput = (inputProps: InputProps, index: number) => (
    <input
      key={index}
      {...inputProps}
      maxLength={1}
      className="inputfield"
      style={{
        width: "2em",
        height: "2em",
        fontSize: "1.5em",
        margin: "0.5em",
      }}
    />
  );
  const handleOtpChange = (code: string) => {
    setCode(code);
    setErr(false);
  };

  useEffect(() => {
    if (email) {
      const getUser = async () => {
        try {
          const user = await axios.get(
            `/api/auth/user/getUser?email=${email}&getUser=true&role=${role}`
          );
          setUserData(user?.data?.data);
          if (!user) {
            throw new Error("There was an error sending the otp.");
          }
          //  openSnackbar({ message: user.data.message, type: "success" });
        } catch (error: any) {
          const msg =
            error?.response?.data?.message ||
            error.message ||
            "Failed to resend otp.";
          openSnackbar({ message: msg, type: "error" });
        }
      };
      getUser();
    }
  }, [email]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
      if (seconds === 0) {
        clearInterval(interval);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [seconds]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60);
    const remainingSeconds = secs % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <>
      <div className="row mt-3">
        <div
          style={{ display: "flex", justifyContent: "start" }}
          className="verify-otp col-12 mb-4 mt-2"
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <OTPInput
              onChange={handleOtpChange}
              value={code}
              numInputs={4}
              renderSeparator={<span style={{ width: "8px" }}></span>}
              shouldAutoFocus={true}
              renderInput={renderCustomInput}
            />
          </div>
        </div>

        {err && <span className="text-danger f-14">Please enter the OTP</span>}

        <div className="col-12 col-md-12 mt-4 text-center">
          <LoadingButton
            loading={loading}
            variant="contained"
            className="w-100 login-btn"
            size="large"
            onClick={() => handleVerify()}
          >
            <span>Verify</span>
          </LoadingButton>
          <div className="mt-4">
            <Button
              variant="outline"
              className="w-100 border-btn"
              onClick={() => handleResend()}
              disabled={seconds > 0 ? true : false}
            >
              {otpLoad ? <CircularProgress size={20} /> : "Resend"}
            </Button>
          </div>
          {seconds > 0 && (
            <p className="f-12 text-center pt-4">
              Resend OTP after:
              <span className="bold dark"> {formatTime(seconds)}</span>
            </p>
          )}
        </div>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </>
  );
}
