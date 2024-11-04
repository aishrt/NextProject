"use client";
import React, { useState } from "react";
import { Metadata } from "next";
import "../../../expert/expert.css";
import MembersTable from "@/app/container/case-members/MemberTable";
import { useRouter } from "next/navigation";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";

export default function CaseMembersList({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = params.id;
  return (
    <ContentWrapper>
      <div className="main-content expert-cases case-members">
        <div className="top-br d-flex justify-content-between align-items-center">
          <h2 className="f-24 pb-3">Case Members</h2>
        </div>
          <MembersTable caseId={id} />
      </div> 
    </ContentWrapper>
  );
}
