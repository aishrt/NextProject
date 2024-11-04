"use client";

import React from "react";
import CaseDocuments from "../../../container/documents/caseDocuments/_caseDocuments";

const Documents = ({ params }: { params: any }) => {
  return (
    <div>
      <CaseDocuments role={"expert"} params={params} />
    </div>
  );
};

export default Documents;
