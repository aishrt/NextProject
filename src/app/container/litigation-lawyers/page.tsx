import React from "react";
import CaseTable from "./_Cases/CaseTable";
import "../../client/client.css";
import Title from "./_Cases/CaseTitle";

export default function LitigationLawyers({ role }: { role: string }) {
  return (
    <div className="main-content expert-cases">
      <Title />
      <div className="cases-list-table res-table-box">
        <div className="mt-4">
          <CaseTable role={role} />
        </div>
      </div>
    </div>
  );
}
