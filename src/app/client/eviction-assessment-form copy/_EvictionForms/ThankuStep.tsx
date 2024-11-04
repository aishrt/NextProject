"use client";

import React from "react";
import "../../../client/client.css";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";

export const ThankuStep = () => {
  const [show, setShow] = useState<boolean>(false);
  const router = useRouter();
  return (
    <div className="lease-form">
      <h3 className="f-22 bold mb-2  text-center">
        Thank you for submitting your case. We will revert you soon.{" "}
      </h3>
    </div>
  );
};
