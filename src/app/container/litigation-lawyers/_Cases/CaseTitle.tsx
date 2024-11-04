"use client";
import React from "react";
import "../../../client/client.css";
import { useRouter, useSearchParams } from "next/navigation";

export default function Title() {
  const router = useRouter();
  const params = useSearchParams();
  const type = params && params.get("type");
  return (
    <div className="top-br d-flex justify-content-between align-items-center">
      <h2 className="f-24">Litigation Lawyers</h2>
    </div>
  );
}
