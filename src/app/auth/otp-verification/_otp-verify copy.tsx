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
import {
  Alert,
  Checkbox,
  CircularProgress,
  FormControlLabel,
} from "@mui/material";
import OTPInput, { InputProps } from "react-otp-input";
import { Button } from "@/components/Form/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@/types/User";
import moment from "moment";

export default function OtpVerificationComponent() {
  const router = useRouter();

  const param = useSearchParams();
  const email = param?.get("email");
  const role = param?.get("role");

  const [loading, setLoading] = useState(false);
  const [otpLoad, setOtpLoad] = useState(false);
  const [disable, setDisable] = useState<boolean>(false);
  const { openSnackbar, snackProps, alertProps } = useSnackbar(); // Use the custom hook
  const [seconds, setSeconds] = useState(0);
  const [code, setCode] = useState<string>("");
  const [err, setErr] = useState(false);
  const [timer, setTimer] = useState("");
  const [userData, setUserData] = useState<User>();
  const [isVal, setValue] = useState<boolean>(false);
  const [resendClicked, setResendClicked] = useState(false);

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

      router.push(`/auth/otp-success?role=${userData?.role}`);
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
      setResendClicked(true);
      //setSeconds(30);
      setDisable(true);
      setOtpLoad(true);
      setCode("");
      const response = await axios.post(
        `/api/auth/resend-otp?email=${email}&role=${role}`
      );
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

  // useEffect(() => {
  //   if (!userData || !userData.expireOtp) return;

  //   const expireOtp = moment(userData.expireOtp);
  //   const current = moment();

  //   const remainingSeconds = expireOtp.diff(current, "seconds");
  //   const remainingMiliSeconds = expireOtp.diff(current);
  //   console.log(remainingMiliSeconds, isVal);

  //   const expireOtpQW = moment(userData.expireOtp, "HH:mm:ss");
  //   const currentQW = moment("HH:mm:ss");

  //   const interval = setInterval(() => {
  //     if (isVal && userData) {
  //       console.log("Current Time:", current.format("hh:mm:ss"));
  //       console.log("Expiration Time:", expireOtp.format("hh:mm:ss"));
  //       if (currentQW.isBefore(expireOtpQW)) {
  //         console.log("OTP is still valid");
  //         // setDisable(true);
  //         setSeconds(remainingSeconds);
  //         let minutes = Math.floor(remainingSeconds / 60);
  //         let second = remainingSeconds % 60;
  //         let formattedTime: any = `${padZero(minutes)}:${padZero(second)}`;
  //         setTimer(formattedTime);
  //       }

  //       // else {
  //       //   console.log("OTP has expired");
  //       //   setDisable(false);
  //       //   setSeconds(0);
  //       // }
  //     }
  //   }, 1000);
  //   setTimeout(() => {
  //     setDisable(false);
  //     setSeconds(0);
  //   }, 20000);

  //   return () => clearInterval(interval);
  // }, [userData]);

  // useEffect(() => {
  //   if (!userData || !userData.expireOtp) return;

  //   const expireOtp = moment(userData.expireOtp);
  //   const current = moment();
  //   const interval = setInterval(() => {
  //     if (userData) {
  //       const currentTime = moment();
  //       console.log(currentTime.isBefore(expireOtp));

  //       if (currentTime.isBefore(expireOtp)) {
  //         // OTP is still valid
  //         const remainingSeconds = expireOtp.diff(currentTime, "seconds");
  //         console.log("Current Time:", currentTime.format("hh:mm:ss"));
  //         console.log("Expiration Time:", expireOtp.format("hh:mm:ss"));
  //         console.log("OTP is still valid");
  //         setDisable(true);
  //         setSeconds(remainingSeconds);
  //         let minutes = Math.floor(remainingSeconds / 60);
  //         let second = remainingSeconds % 60;
  //         let formattedTime: any = `${padZero(minutes)}:${padZero(second)}`;
  //         setTimer(formattedTime);
  //         console.log("Timer updated:", formattedTime);
  //       } else {
  //         console.log("OTP has expired");
  //         setDisable(false);
  //         setSeconds(0);
  //       }
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [userData]);

  useEffect(() => {
    if (userData) {
      console.log(userData?.expireOtp);
    }

    const intervalId = setInterval(() => {
      const givenTimeDate = new Date(userData?.expireOtp ?? "");
      const currentTime = new Date();
      console.log(givenTimeDate);
      console.log(currentTime);

      if (givenTimeDate > currentTime) {
        console.log("=========trueeeee");

        // setIsButtonDisabled(true);
      } else {
        console.log("=========falseee");

        // setIsButtonDisabled(false);
      }
    }, 1000); // Run every 1000 milliseconds (1 second)

    return () => {
      clearInterval(intervalId);
    };
  }, [userData]);
  
  useEffect(() => {
    if (!userData || !userData.expireOtp) return;
    const interval = setInterval(() => {
      const expireOtp = moment(userData.expireOtp);
      const currentTime = moment();

      if (currentTime.isBefore(expireOtp)) {
        // OTP is still valid
        const remainingSeconds = expireOtp.diff(currentTime, "seconds");
        console.log("Current Time:", currentTime.format("hh:mm:ss"));
        console.log("Expiration Time:", expireOtp.format("hh:mm:ss"));
        console.log("OTP is still valid");
        setDisable(true);
        setSeconds(remainingSeconds);
        let minutes = Math.floor(remainingSeconds / 60);
        let second = remainingSeconds % 60;
        let formattedTime: any = `${padZero(minutes)}:${padZero(second)}`;
        setTimer(formattedTime);
        console.log("Timer updated:", formattedTime);
      } else {
        console.log("OTP has expired");
        setDisable(false);
        setSeconds(0);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [userData, resendClicked]);

  function padZero(value: number) {
    return (value < 10 ? "0" : "") + value;
  }

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
              // isLoading={otpLoad}
              variant="outline"
              className="w-100 border-btn"
              onClick={() => handleResend()}
              disabled={disable || otpLoad}
            >
              {otpLoad ? <CircularProgress size={20} /> : "Resend"}
            </Button>
          </div>
          {disable ? (
            <p className="f-12 text-center pt-4">
              Resend OTP after:
              <span className="bold dark"> {timer}</span>
              {/* Resend OTP after : <span className="bold dark"> (01.30)</span> */}
            </p>
          ) : (
            ""
          )}
        </div>
      </div>
      <Snackbar {...snackProps}>
        <Alert {...alertProps} />
      </Snackbar>
    </>
  );
}
