"use client";
import React from "react";
import "../../../client/client.css";
import { Button } from "@/components/Form/Button";
import { useRouter } from "next/navigation";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";
import Privacy from "./Privacy";

export default function PrivacyPolicy() {
  return (
    <Privacy />
  );
}