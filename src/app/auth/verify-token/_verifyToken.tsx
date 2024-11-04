"use client";

import { useRouter, useSearchParams } from "next/navigation";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
import Image from "next/image";
import expired from "@/assets/expired.png";
import logo from "@/assets/logo.jpeg";
export default function VerifyToken() {
  const router = useRouter();
  const param = useSearchParams();
  const role = param?.get("role");
  const [loading, setLoading] = useState(false);
  return (
    <div className="row verify-token-share">
      <div>
        <Image src={logo} className="" alt="logo" width={70} height={60} />
      </div>
      <div className="text-center verify-tkn-content">
        <Image
          src={expired}
          className="mb-4"
          alt="expired"
          width={200}
          height={200}
        />
        <h3 className="bold f-52">
          Token has expired. Please request a new password reset.
        </h3>

        <div className="col-12  mt-4 ">
          <LoadingButton
            loading={loading}
            variant="contained"
            className=" login-btn"
            size="large"
            onClick={() => {
              setLoading(true);
              router.push(`/auth/${role}/login`);
            }}
          >
            <span>Back To Login</span>
          </LoadingButton>
        </div>
      </div>
    </div>
  );
}
