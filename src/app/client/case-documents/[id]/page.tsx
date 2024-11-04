"use client";

import React from "react";
import CaseDocuments from "../../../container/documents/caseDocuments/_caseDocuments";
import ContentWrapper from "@/components/Layout/Client/ContentWrapper";

const Documents = ({ params }: { params: any }) => {
  return (
    <ContentWrapper>
      <CaseDocuments role={"client"} params={params} />
    </ContentWrapper>
  );
};

export default Documents;
