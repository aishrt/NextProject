"use client";

import React from "react";
import AddMember from "@/app/container/case-members/AddMember";
import "../../../../client/client.css";

const AddCaseMember = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  console.log(id);

  return (
    <div className="main-content expert-cases">
      <div className="top-br d-flex justify-content-between align-items-center">
        <h2 className="f-24">Add Case Member</h2>
      </div>
      <div className="res-table-box">
        <div className="mt-4">
          <AddMember caseId={id} />
        </div>
      </div>
    </div>
  );
};

export default AddCaseMember;
